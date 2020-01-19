# coding=utf-8
import uuid
from functools import wraps
from flask import g, request, redirect, url_for, session, render_template, flash, logging, current_app
from controllers.auth import auth_page
from models import  UserPassport, User
from controllers.auth.auth import login_user, send_confirm_email
from database import db


def passport_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        print 'passport_required:', session.items()
        if not session.has_key('cstnetId'):
            return redirect('https://passport.escience.cn/oauth2/authorize?response_type=code&redirect_uri={}&client_id={}&theme=full'.format(
                current_app.config.get('ESCIENCE_PASSPORT_APP_CALLBACK'),
                current_app.config.get('ESCIENCE_PASSPORT_APP_KEY')
            ))
        return f(*args, **kwargs)
    return decorated_function


# 选择映射到科研通行证的用户
@auth_page.route('/map_user_to_passport')
def map_user_to_passport():
    cstnetId = request.args.get('cstnetId')
    print('cstnetId:', cstnetId)
    return render_template('auth/map_user_to_passport.html', cstnetId=cstnetId)


# 选择映射到科研通行证的用户
@auth_page.route('/save_map_user_to_passport', methods=['POST'])
def save_map_user_to_passport():
    map_type = request.form.get("map_type")
    cstnetId = request.form.get('cstnetId')
    email = request.form.get('email')
    password = request.form.get('password')
    code = request.form.get('code')
    if session.get('image').lower() != code.lower():
        flash('验证码错误！')
        return redirect(url_for('portal.index'))

    if email is None:
        flash('缺少邮箱！')
        return redirect(url_for('portal.index'))

    # from main import app
    print('@save_map_user_to_passport')


    # try:
    if map_type=='login':
        user = User.query.filter_by(email=email).first()
        if user is not None and user.verify_password(password):
            # 和通行证关联
            print('@save_map_user_to_passport: user link to password')
            user_passport = UserPassport()
            user_passport.id = uuid.uuid4()
            user_passport.user_id = user.id
            user_passport.cstnet_id = cstnetId
            db.session.add(user_passport)
            db.session.commit()
            if user.confirmed:
                login_user(user)
                # 设置登录类型为用户登录.
                # session['login_type'] = 'user'
                next = request.args.get('next')
                flash('You were successfully logged in')
                url = url_for('portal.index')
                return redirect(next or url)
            else:
                flash(u"请验证邮箱后登录!")
                return redirect(request.referrer)
    elif map_type=='register':
        current_app.logger.info('@save_map_user_to_passport: in register block')
        realname = request.form.get('realname')
        username = request.form.get('username')
        phone = request.form.get('phone')
        password_confirm = request.form.get('password_confirm')
        if password!=password_confirm:
            flash(u"两次密码不相同!")
            return redirect(request.referrer)

        user = User(email=email,
                    username=username,
                    password=password,
                    id=uuid.uuid4()
                    )
        user.realname = realname
        user.phone = phone

        exist_user = User.query.filter_by(username=user.username).first()
        exist_email = User.query.filter_by(email=user.email).first()
        print('@save_map_user_to_passport: user created')

        if exist_user is not None and not exist_email:
            flash(u'用户名已经使用，请重新输入!')
            return redirect(request.referrer)
        elif not exist_user and exist_email is not None:
            flash(u'邮箱已经注册，请重新输入!')
            return redirect(request.referrer)
        elif not exist_user and not exist_email:
            print('@save_map_user_to_passport: add user')
            db.session.add(user)
            # 和通行证关联
            user_passport = UserPassport()
            user_passport.id = uuid.uuid4()
            user_passport.user_id = user.id
            user_passport.cstnet_id = cstnetId
            db.session.add(user_passport)
            db.session.commit()
            print('@save_map_user_to_passport: user saved')
            send_confirm_email(user.username, user.email)
            flash(u'验证邮件已经发送到您的邮箱，请登录邮箱进行验证!')
            print('@save_map_user_to_passport: mail sended')
            return redirect(request.referrer)
        else:
            if exist_user.confirmed:
                flash(u'你的邮箱已经注册，请登录!')
            else:
                send_confirm_email(user.username, user.email)
                flash(u'验证邮件已经发送到您的邮箱，请登录邮箱进行验证!')
            return redirect(url_for('portal.index'))
    # except Exception as err:
    #     current_app.logger.info('exception:{}', err)
    #     flash('err:', err.message)

    return redirect(request.referrer)