# coding=utf-8
import StringIO
import copy
import os
import shutil
import uuid
from io import BytesIO
from datetime import datetime
from threading import Thread

import jwt
from flask import Response, jsonify
from flask import current_app
from flask import render_template, redirect, request, url_for, flash, session
from flask import send_file
from flask_login import login_user, current_user, logout_user, login_required
from flask_mail import Message
from itsdangerous import URLSafeTimedSerializer
from sqlalchemy import desc, or_
from werkzeug.utils import secure_filename

from config import Config
from controllers.auth import auth_page
from controllers.manage.common import get_degree_from_str, get_file_ext, get_opts, ajaxResult
from database import db, mail
from models import Cart
from models import Category
from models import DataItem
from models import DataOutcome
from models import DataPart
from models import DataProject
from models import DataWorker
from models import Favorite, ModelFavorite
from models import LineItem
from models import MetaTag
from models import Metadata
from models import Option
from models import Order
from models import Reviewer
from models import User
from models import Pan
from models import LibraryApply
from models.organization import Organization
from services.hdfs_service import get_hdfs
from sqlite3 import IntegrityError
from flask import make_response, session

from .get_verify_code import get_verify_code

@auth_page.route('/code', methods=['GET', 'POST'])
def get_code():
    image, code = get_verify_code()
    buf = BytesIO()
    image.save(buf, 'jpeg')
    buf_str = buf.getvalue()
    response = make_response(buf_str)
    response.headers['Content-Type'] = 'image/gif'
    session['image'] = code
    return response

@auth_page.before_app_request
def before_request():
    if current_user.is_authenticated:
        current_user.ping()

@auth_page.route('/login', methods=['GET'])
def login():
    return render_template('auth/new_login.html')


@auth_page.route('/login', methods=['POST'])
def do_login():
    email = request.form.get('email')
    password = request.form.get('password')
    code = request.form.get('code')
    print('referrer: ', request.referrer)
    if session.get('image').lower() != code.lower():
        flash('验证码错误！')
        return redirect(request.referrer or url_for('auth.login'))
    if email:
        user = User.query.filter_by(email=email).first()
        if user is not None and user.verify_password(password):
            if user.confirmed:
                login_user(user)
                # 设置登录类型为用户登录.
                session['login_type'] = 'user'
                next = request.args.get('next')
                flash('You were successfully logged in')
                url = url_for('portal.index')
                return redirect(next or url)
            else:
                flash(u"您的邮箱未验证!")
                return redirect(request.referrer or url_for('auth.login'))
        else:
            flash(u'请输入正确的邮箱和密码!')
            return redirect(request.referrer or url_for('auth.login'))
    else:
        return redirect(request.referrer or url_for('auth.login'))


@auth_page.route('/login_in_modal', methods=['POST'])
def do_login_in_modal():
    rst = {
        'success': False,
        'content': '',
        'msg': ''
    }

    email = request.form.get('email')
    password = request.form.get('password')
    code = request.form.get('code')

    if session.get('image').lower() != code.lower():
        rst['success'] = False
        rst['msg'] = u'验证码错误！'
        return jsonify(rst)
    if email:
        user = User.query.filter_by(email=email).first()
        if user is not None and user.verify_password(password):
            if user.confirmed:
                login_user(user)
                # 设置登录类型为用户登录.
                session['login_type'] = 'user'
                rst['success'] = True
                rst['content'] = 'You were successfully logged in'
            else:
                rst['success'] = False
                rst['msg'] = u"您的邮箱未验证!"
        else:
            rst['success'] = False
            rst['msg'] = u'请输入正确的邮箱和密码!'
    else:
        rst['success'] = False
        rst['msg'] = '缺少登录信息'

    return jsonify(rst)


@auth_page.route("/logout", methods=["GET"])
def logout():
    """Logout the current user."""
    logout_user()
    flash('You were successfully logged out')
    # 清除所有的session.
    for key in session.keys():
        session.pop(key)
    session.clear()
    return redirect(request.referrer)


@auth_page.route('/register')
def register():
    return render_template('auth/register.html')


def generate_confirm_token(email):
    serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    return serializer.dumps(email, salt=current_app.config.get('SECURITY_PASSWORD_SALT'))


def confirm_token(token, expiration=1800):
    serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    try:
        email = serializer.loads(
            token,
            salt=current_app.config.get('SECURITY_PASSWORD_SALT'),
            max_age=expiration
        )
    except:
        return False
    return email


def send_confirm_email(username, email):
    title = u"【寒旱区环境演变研究科技领域云】"
    sender = current_app.config.get('MAIL_USERNAME')
    message = Message(title,
                      sender=sender,
                      recipients=[email]
                      )
    token = generate_confirm_token(email)
    confirm_url = url_for('auth.confirm_email', token=token, _external=True)
    message.html = render_template('auth/email/email_confirm.html', username=username, confirm_url=confirm_url)
    mail.send(message)


@auth_page.route('/register/save', methods=['POST'])
def register_save():
    email = request.form.get('email')
    password = request.form.get('password')
    username = request.form.get('username')
    code = request.form.get('code')
    if session.get('image').lower() != code.lower():
        flash('验证码错误！')
        return redirect(url_for('auth.register'))
    user = User(email=email,
                username=username,
                password=password,
                )
    exist_user = User.query.filter_by(username=user.username).first()
    exist_email = User.query.filter_by(email=user.email).first()
    if exist_user is not None and not exist_email:
        flash(u'用户名已经使用，请重新输入!')
        return redirect(url_for('auth.register'))
    elif not exist_user and exist_email is not None:
        flash(u'邮箱已经注册，请重新输入!')
        return redirect(url_for('auth.register'))
    elif not exist_user and not exist_email:
        db.session.add(user)
        db.session.commit()
        send_confirm_email(user.username, user.email)
        flash(u'验证邮件已经发送到您的邮箱，请登录邮箱进行验证!')
        return redirect(url_for('auth.login'))
    else:
        if exist_user.confirmed:
            flash(u'你的邮箱已经注册，请登录!')
        else:
            send_confirm_email(user.username, user.email)
            flash(u'验证邮件已经发送到您的邮箱，请登录邮箱进行验证!')
        return redirect(url_for('auth.login'))


@auth_page.route('/confirm/<path:token>')
def confirm_email(token):
    email = confirm_token(token)
    if email:
        user = User.query.filter_by(email=email).first()
        if user.confirmed is not True:
            user.confirmed = True
            user.registeration_date = datetime.now()
            db.session.add(user)
            db.session.commit()
        flash(u'验证成功，请登录!')
        return redirect(url_for('auth.login'))
    else:
        flash(u'激活超时，请重新注册!')
        return redirect(url_for('auth.register'))


def send_reset_email(email):
    title = u"【寒旱区环境演变研究科技领域云】"
    sender = current_app.config.get('MAIL_USERNAME')
    message = Message(title,
                      sender=sender,
                      recipients=[email]
                      )
    token = generate_confirm_token(email)
    reset_url = url_for('auth.reset_passwd', token=token, _external=True)
    message.html = render_template('auth/email/email_passwd_reset.html', reset_url=reset_url)
    mail.send(message)


@auth_page.route('/login/forget', methods=['GET'])
def forget_passwd():
    return render_template('auth/forget_passwd.html')


@auth_page.route('/login/check')
def check_email():
    rst = ajaxResult()
    user_email = request.args.get('user_email')
    print user_email
    exist_user = User.query.filter(User.email == user_email, User.confirmed == True).first()
    if not exist_user:
        rst.success = False
    else:
        send_reset_email(user_email)
        rst.success = True
  
    return jsonify(rst.__dict__)

@auth_page.route('/login/mail')
def not_get_mail():
    return render_template('auth/not_get_mail.html')


@auth_page.route('/reset/<path:token>')
def reset_passwd(token):
    email = confirm_token(token)

    if email:
        return render_template('auth/reset_passwd.html', email=email)
    else:
        flash("密码重置邮箱已过期！")
        return redirect(url_for('auth.login'))


@auth_page.route('/passwd_save', methods=['POST'])
def passwd_save():
    passwd = request.form.get('passwd')
    email = request.form.get('email')

    user = User.query.filter(User.email == email).first()
    if user:
        user.password = passwd
        db.session.add(user)
        db.session.commit()
        flash("密码重置成功，请登录！")
        return redirect(url_for('auth.login'))
    else:
        info = "该帐号 " + str(email) + " 不存在，请注册！"
        flash(info)
        return redirect(url_for('auth.register'))


@auth_page.route('/profile', methods=['POST', 'GET'])
@login_required
def profile():
    user = current_user
    return render_template('auth/profile.html', user=user)


@auth_page.route('/profile/save', methods=['POST'])
def profile_save():
    username = request.form.get('username')
    email = request.form.get('email')
    same_user = User.query.filter(or_(User.username == username, User.email == email),
                                  User.id != current_user.id).first()
    if same_user is not None:
        flash("用户名或邮箱已存在，请重新填写！")
    else:
        user = User.query.get(current_user.id)
        user.username = username
        realname = request.form.get('realname')
        print realname
        orders = Order.query.filter_by(user_id=current_user.id).all()
        for order in orders:
            order.realname = realname
            db.session.add(order)
            db.session.commit()

        user.realname = realname
        user.email = email
        user.phone = request.form.get('phone')
        user.unit = request.form.get('unit')
        user.address = request.form.get('address')
        user.post_code = request.form.get('post_code')
        db.session.commit()
        flash(u'保存成功')
    return redirect(url_for('auth.profile'))


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in set(['png', 'jpg', 'jpeg', 'gif'])


@auth_page.route('/change_avatar', methods=['POST'])
def change_avatar():
    image_file_path = current_app.config.get('IMAGE_FILE_PATH')
    u = User.query.filter_by(id=current_user.id).first()
    if 'avatar' in request.files.to_dict():
        image = request.files['avatar']
        if image and allowed_file(image.filename):
            filename = secure_filename(image.filename)
            image.save(os.path.join(image_file_path, filename))
            u.avatar = filename
    db.session.commit()
    flash(u'头像修改成功')
    return redirect(url_for('manage.dashboard'))


@auth_page.route('/password')
def password():
    return render_template('auth/change_password.html')


@auth_page.route('/change_password', methods=['POST'])
def save():
    user = User.query.get(current_user.id)
    password = request.form.get('password')
    new_password = request.form.get('new_password')
    confirm_password = request.form.get('confirm_password')
    if new_password == confirm_password and user.verify_password(password):
        user.password = new_password
        db.session.add(user)
        db.session.commit()
        flash(u'修改成功')
        return redirect(url_for('auth.password'))
    else:
        flash(u'修改失败')
        return render_template('auth/change_password.html')


@auth_page.route('/favorite')
@login_required
def favorite():
    user_id = current_user.id
    current_page = request.args.get('current_page', 1)
    current_page = int(str(current_page))
    page_size = 20
    total = Favorite.query.options(db.joinedload('meta')).filter_by(user_id=user_id).count()
    if (total % page_size) == 0:
        total_page = total / page_size
    else:
        total_page = (total / page_size) + 1
    offset = (current_page - 1) * page_size
    favorites = Favorite.query.options(db.joinedload('meta')).filter_by(user_id=user_id).offset(offset).limit(
        page_size).all()
    return render_template('auth/favorite.html', favorites=favorites, current_page=current_page, total_page=total_page,
                           total=total)


@auth_page.route('/favorite/delete/<path:id>')
def delete_favorite(id):
    Favorite.query.filter_by(id=id).delete()
    db.session.commit()
    flash(u'删除成功')
    return redirect(url_for('auth.favorite'))


@auth_page.route('/order')
@login_required
def order():
    current_page = request.args.get('current_page', 1)
    current_page = int(str(current_page))
    page_size = 20
    total = Order.query.filter(Order.user_id == current_user.id, Order.status == 0).count()
    if (total % page_size) == 0:
        total_page = total / page_size
    else:
        total_page = (total / page_size) + 1
    offset = (current_page - 1) * page_size
    orders = Order.query.filter(Order.user_id == current_user.id, Order.status == 0).order_by(
        desc(Order.created)).offset(offset).limit(
        page_size).all()
    return render_template('auth/order.html', current_page=current_page, total_page=total_page, orders=orders,
                           total=total)


# 待审批的订单
@auth_page.route('/approve')
@login_required
def approve():
    current_page = request.args.get('current_page', 1)
    current_page = int(str(current_page))
    page_size = 20
    total = Order.query.filter(Order.user_id == current_user.id).filter(
        or_(Order.status == 1, Order.status == -1)).count()
    if (total % page_size) == 0:
        total_page = total / page_size
    else:
        total_page = (total / page_size) + 1
    offset = (current_page - 1) * page_size
    orders = Order.query.filter(Order.user_id == current_user.id).filter(
        or_(Order.status == 1, Order.status == -1)).order_by(
        desc(Order.created)).offset(offset).limit(
        page_size).all()
    return render_template('auth/order/approve.html', current_page=current_page, total_page=total_page,
                           orders=orders, total=total)


@auth_page.route('/pass/apply')
@login_required
def pass_apply():
    current_page = request.args.get('current_page', 1)
    current_page = int(str(current_page))
    page_size = 20
    total = Order.query.filter(Order.user_id == current_user.id, Order.status == 2).count()
    if (total % page_size) == 0:
        total_page = total / page_size
    else:
        total_page = (total / page_size) + 1
    offset = (current_page - 1) * page_size
    orders = Order.query.filter(Order.user_id == current_user.id, Order.status == 2).order_by(
        desc(Order.created)).offset(offset).limit(
        page_size).all()
    return render_template('auth/order/pass_apply.html', current_page=current_page, total_page=total_page,
                           orders=orders, total=total)


@auth_page.route('/public')
@login_required
def public():
    current_page = request.args.get('current_page', 1)
    current_page = int(str(current_page))
    page_size = 20
    total = Order.query.filter(Order.user_id == current_user.id, Order.type == 'public').count()
    if (total % page_size) == 0:
        total_page = total / page_size
    else:
        total_page = (total / page_size) + 1
    offset = (current_page - 1) * page_size
    orders = Order.query.filter(Order.user_id == current_user.id, Order.type == 'public').order_by(
        desc(Order.created)).offset(offset).limit(
        page_size).all()
    return render_template('auth/order/public.html', current_page=current_page, total_page=total_page,
                           orders=orders, total=total)


@auth_page.route('/cart')
@login_required
def cart():
    current_cart = current_user.cart
    if current_cart is None:
        current_cart = Cart()
        current_cart.user_id = current_user.id
        db.session.add(current_cart)
        db.session.commit()
    cart_id = current_cart.id
    current_page = request.args.get('current_page', 1)
    current_page = int(str(current_page))
    page_size = 20
    total = LineItem.query.options(db.joinedload('meta')).filter_by(cart_id=cart_id).count()
    if (total % page_size) == 0:
        total_page = total / page_size
    else:
        total_page = (total / page_size) + 1
    offset = (current_page - 1) * page_size
    items = LineItem.query.options(db.joinedload('meta')).filter_by(cart_id=cart_id).offset(offset).limit(
        page_size).all()
    return render_template('auth/cart.html', items=items, current_page=current_page, total_page=total_page, total=total)


@auth_page.route('/cart/delete/data/<path:id>')
def cart_delete_data(id):
    LineItem.query.filter_by(id=id).delete()
    db.session.commit()
    flash('删除成功')
    return redirect(url_for('auth.cart'))


@auth_page.route('/add_metadata_to_cart', methods=['POST'])
def add_metadata_to_cart():
    file_name = 'auth/cart/add_to_cart.js.html'
    operate = True
    result = u"操作成功"
    message = u"已成功添加至数据篮"
    cart_line_item_number = 0
    next = request.form.get('next')
    if not current_user.is_authenticated:
        file_name = 'auth/login_required.js.html'
    else:
        metadata_id = request.form.get('id')
        if metadata_id is None: return
        current_cart = current_user.cart
        if current_cart is None:
            current_cart = Cart()
            current_cart.user_id = current_user.id
            db.session.add(current_cart)
            db.session.commit()
        cart_id = current_cart.id
        current_line_item = LineItem.query.filter_by(cart_id=cart_id, metadata_id=metadata_id).first()
        if current_line_item:
            operate = False
            result = u'操作失败'
            message = u'数据已在数据篮中'
            current_line_item.quantity += 1
        else:
            current_line_item = LineItem(cart_id, metadata_id)
        db.session.add(current_line_item)
        db.session.commit()
        cart_line_item_number = len(current_cart.line_items)
        file_name = 'auth/cart/add_to_cart.js.html'

    template = current_app.jinja_env.get_or_select_template(file_name)
    js = template.render(operate=operate, result=result, message=message, cart_line_item_number=cart_line_item_number,
                         next=next)
    return current_app.response_class(js, mimetype='text/javascript')


# 模型添加到购物车
@auth_page.route('/add_model_to_cart', methods=['POST'])
def add_model_to_cart():
    file_name = 'auth/cart/add_to_cart.js.html'
    operate = True
    result = u"操作成功"
    message = u"已成功添加至数据篮"
    cart_line_item_number = 0
    next = request.form.get('next')
    if not current_user.is_authenticated:
        file_name = 'auth/login_required.js.html'
    else:
        library_id = request.form.get('id')
        if library_id is None: return
        current_cart = current_user.cart
        if current_cart is None:
            current_cart = Cart()
            current_cart.user_id = current_user.id
            db.session.add(current_cart)
            db.session.commit()
        cart_id = current_cart.id
        current_apply = LibraryApply.query.filter_by(cart_id=cart_id, library_id=library_id).first()
        if current_apply:
            operate = False
            result = u'操作失败'
            message = u'数据已在数据篮中'
            current_apply.quantity += 1
        else:
            current_apply = LibraryApply(cart_id, library_id)
        db.session.add(current_apply)
        db.session.commit()
        cart_line_item_number = len(current_cart.line_items)
        file_name = 'auth/cart/add_to_cart.js.html'

    template = current_app.jinja_env.get_or_select_template(file_name)
    js = template.render(operate=operate, result=result, message=message, cart_line_item_number=cart_line_item_number,
                         next=next)
    return current_app.response_class(js, mimetype='text/javascript')


@auth_page.route('/add_to_favorite', methods=['POST'])
def add_to_favorite():
    operate = True
    result = u"操作成功"
    message = u"已成功收藏该数据"
    if not current_user.is_authenticated:
        file_name = 'auth/login_required.js.html'
    else:
        metadata_id = request.form.get('id')
        if metadata_id is None: return
        current_favorite = Favorite.query.filter_by(user_id=current_user.id, metadata_id=metadata_id).first()
        if not current_favorite:
            current_favorite = Favorite(current_user.id, metadata_id)
            db.session.add(current_favorite)
            db.session.commit()
        else:
            operate = False
            result = u'操作失败'
            message = u'数据已在收藏夹中'
        file_name = 'auth/favorite/add_to_favorite.js.html'
    template = current_app.jinja_env.get_or_select_template(file_name)
    js = template.render(operate=operate, result=result, message=message)
    return current_app.response_class(js, mimetype='text/javascript')

@auth_page.route('/add_model_to_favorite', methods=['POST'])
def add_model_to_favorite():
    operate = True
    result = u"操作成功"
    message = u"已成功收藏该模型"

    model_id = request.form.get('id')
    if model_id is None:
        return

    if not current_user.is_authenticated:
        file_name = 'auth/login_required.js.html'
    else:
        current_favorite = ModelFavorite.query.filter_by(user_id=current_user.id, model_id=model_id).first()
        if not current_favorite:
            current_favorite = ModelFavorite(current_user.id, model_id)
            db.session.add(current_favorite)
        else:
            operate = False
            result = u'操作失败'
            message = u'模型已在收藏夹中'
        file_name = 'auth/favorite/add_model_to_favorite.js.html'

    fav_count = ModelFavorite.query.filter(ModelFavorite.model_id==model_id).count()
    db.session.commit()

    template = current_app.jinja_env.get_or_select_template(file_name)
    js = template.render(operate=operate, result=result, message=message, fav_count=fav_count)
    return current_app.response_class(js, mimetype='text/javascript')

@auth_page.route('/add_to_order', methods=['POST'])
@login_required
def add_to_order():
    data = ""
    item_ids = request.form.getlist('item_ids')
    if len(item_ids) != 0:
        data = "cart"
        items = LineItem.query.options(db.joinedload('meta')).filter(LineItem.id.in_(item_ids)).all()
    else:
        data = "favorite"
        favorite_id = request.form.getlist('favo_id')
        items = Favorite.query.options(db.joinedload('meta')).filter(Favorite.id.in_(favorite_id)).all()
    user = current_user
    return render_template('auth/order/new.html', items=items, user=user, data=data)


@auth_page.route('/save_to_order', methods=['POST'])
@login_required
def save_to_order():
    username = request.form.get('username')
    realname = request.form.get('realname')
    email = request.form.get('email')
    phone = request.form.get('phone')
    unit = request.form.get('unit')
    address = request.form.get('address')
    post_code = request.form.get('post_code')
    project_info = request.form.get('project_info')
    project_type = request.form.get('project_type')
    project_code = request.form.get('project_code')
    project_title = request.form.get('project_title')
    project_leader = request.form.get('project_leader')
    purpose = request.form.get('purpose')
    item_ids = request.form.getlist('item_ids')

    title = u"【寒旱区环境演变研究科技领域云】数据申请"
    sender = current_app.config.get('MAIL_USERNAME')
    items = []
    for item_id in item_ids:
        mails = []
        order = Order()
        order.user_id = current_user.id
        order.username = username
        order.realname = realname
        order.email = email
        order.phone_no = phone
        order.unit = unit
        order.address = address
        order.post_code = post_code
        order.project_info = project_info
        order.project_type = project_type
        order.project_code = project_code
        order.project_title = project_title
        order.project_leader = project_leader

        purposes = [purpose[i:i + 42] for i in range(0, len(purpose), 42)]
        purpose = ''
        for pur in purposes:
            purpose += pur + '<br />'
        order.purpose = purpose

        item = LineItem.query.get(item_id)
        items.append(item) 
        contributors = item.meta.ds_contributors            
        if item.meta.ds_share_type == u"离线申请":
            order.type = "email"
            for con in contributors:
                if con.mailbox != None and con.mailbox != '':
                    print con.mailbox
                    mails.append(con.mailbox)
            message = Message(title,
                      sender=sender,
                      recipients=mails
                      )
            html = render_template('auth/order/email_notification.html',
                           username=username, items=[item])
            message.html = html
            mail.send(message)
        elif item.meta.ds_share_type == u"在线下载":
            order.type = "normal"
        elif item.meta.ds_share_type == u"完全公开":
            order.type = "public"
        order.item = item
        db.session.add(order)
    
    message = Message(title,
                      sender=sender,
                      recipients=[sender]
                      )
    html = render_template('auth/order/email_notification.html',
                           username=username, items=items)
    message.html = html

    mail.send(message)

    db.session.commit()
    flash(u'您的数据申请表格已经提交，请下载PDF证明材料')
    return redirect(url_for('auth.order'))


@auth_page.route('/order/<path:id>')
@login_required
def order_details(id):
    order = Order.query.get(id)
    return render_template('auth/order/details.html', order=order)


@auth_page.route('/order/pass_apply/<path:id>')
@login_required
def pass_apply_details(id):
    order = Order.query.get(id)
    return render_template('auth/order/pass_apply_details.html', order=order)


@auth_page.route('/order/public/<path:id>')
@login_required
def public_details(id):
    order = Order.query.get(id)
    return render_template('auth/order/public_details.html', order=order)


def render_pdf(html):
    from xhtml2pdf import pisa
    from cStringIO import StringIO
    pdf = StringIO()
    pisa.CreatePDF(StringIO(html.encode('utf-8')), pdf)
    resp = pdf.getvalue()
    pdf.close()
    return resp


@auth_page.route('/order/pdf/<path:token>')
@login_required
def order_pdf(token):
    static_path = current_app.config.get('STATIC_PATH')
    font_path = os.path.join(static_path, 'assets/fonts/yahei.ttf')
    result = jwt.decode(token, 'crensed')
    now = datetime.now()
    html = render_template('auth/order/pdf.html', result=result, font_path=font_path, now=now)
    pdf = render_pdf(html)
    return Response(pdf,
                    mimetype="application/pdf",
                    headers={"Content-Disposition":
                                 "attachment;filename=application.pdf"})


@auth_page.route('/order/pdf')
@login_required
def order_old_pdf():
    id = request.args.get('id')
    order = Order.query.get(id)
    static_path = current_app.config.get('STATIC_PATH')
    font_path = os.path.join(static_path, 'assets/fonts/yahei.ttf')
    now = datetime.now()
    html = render_template('auth/order/old_pdf.html', order=order, font_path=font_path, now=now)
    pdf = render_pdf(html)
    return Response(pdf,
                    mimetype="application/pdf",
                    headers={"Content-Disposition":
                                 "attachment;filename=application.pdf"})

@auth_page.route('/order/protocol')
def protocol():
    return render_template('auth/order/protocol.html')


def send_email(order):
    if not order.item.meta.ds_contributors:
        return
    title = u"【寒旱区环境演变研究科技领域云】数据申请"
    sender = current_app.config.get('MAIL_USERNAME')

    contributor = order.item.meta.ds_contributors[0]
    reviewer = Reviewer()
    reviewer.username = contributor.true_name
    reviewer.email = contributor.mailbox
    reviewer.result = 0
    reviewer.order_id = order.id
    s_token = jwt.encode({'contributor': contributor.mailbox, 'order_id': str(order.id), 'result': 1},
                         'itishardtoguess_crensed', algorithm='HS256')
    f_token = jwt.encode({'contributor': contributor.mailbox, 'order_id': str(order.id), 'result': -1},
                         'itishardtoguess_crensed', algorithm='HS256')

    message = Message(title,
                      sender=sender,
                      recipients=[contributor.mailbox])
    html = render_template('auth/order/email_template.html', contributor=contributor, order=order, s_token=s_token,
                           f_token=f_token)
    message.html = html
    _, ext = os.path.splitext(order.stuff)
    mime_type = "image/png"
    if ext == ".jpg":
        mime_type = "image/jpg"
    elif ext == ".jpeg":
        mime_type = "image/jpeg"
    elif ext == ".gif":
        mime_type = "image/gif"
    with current_app.open_resource("static/upload/images/" + order.stuff) as fp:
        message.attach(u"证明材料" + ext, mime_type, fp.read())

    send_async_email(reviewer, message)


@auth_page.route('/order/stuff/upload', methods=['POST'])
@login_required
def stuff_upload():
    id = request.form.get('id')
    image_file_path = current_app.config.get('IMAGE_FILE_PATH')
    result = {}
    if 'stuff' in request.files.to_dict():
        image = request.files['stuff']
        if image and allowed_file(image.filename):
            _, ext = os.path.splitext(image.filename)
            filename = str(uuid.uuid4()) + ext
            dist_path = os.path.join(image_file_path, filename)
            image.save(dist_path)
            order = Order.query.get(id)
            order.stuff = filename
            order.status = 1
            db.session.commit()
            if order.type == 'email':
                send_email(order)
            result['type'] = 'success'
            result['message'] = u'证明材料上传成功，请等待审核'
        else:
            result['type'] = 'error'
            result['message'] = u'证明材料格式为图片'

    else:
        result['type'] = 'error'
        result['message'] = u'请上传证明材料'

    return jsonify(result)



@auth_page.route("/order_email_audit/<path:token>")
def order_email_audit(token):
    r = jwt.decode(token, 'itishardtoguess_crensed', algorithms=['HS256'])
    email = r['contributor']
    order_id = r['order_id']
    result = int(r['result'])
    reviewers = Reviewer.query.filter_by(email=email, order_id=order_id)
    for r in reviewers:
        r.result = result
    order = Order.query.get(order_id)
    if result == -1:
        order.status = -1
    if result == 1:
        order.status = 2
        try:
            parent_id = '00000000-0000-0000-0000-000000000000'
            p = Pan(name=order.item.meta.title_cn, type=0, parent_id=parent_id, user_id=order.user_id)
            db.session.add(p)
            for d in order.item.meta.ds_data:
                ps = Pan(name=d.data_title, type=1, parent_id=p.id, user_id=order.user_id,
                              hdfs_path=d.data_name)
                db.session.add(ps)
        except IntegrityError, e:
            print e.message
    db.session.commit()
    return render_template('auth/order/email_audit.html')


@auth_page.route("/get-file")
def get_file():
    id = request.args.get('id')
    hdfs = get_hdfs()
    d = DataPart.query.get(id)
    file_data = hdfs.read_file(d.data_name)
    strIO = StringIO.StringIO()
    strIO.write(file_data)
    strIO.seek(0)
    return send_file(strIO,
                     attachment_filename=os.path.basename(d.data_name),
                     as_attachment=True)


def async(f):
    def wrapper(*args, **kwargs):
        thr = Thread(target=f, args=args, kwargs=kwargs)
        thr.start()

    return wrapper


@async
def send_async_email(reviewer, message):
    from main import app
    with app.app_context():
        try:
            mail.send(message)
            db.session.add(reviewer)
        except Exception as e:
            print "error", e
            db.session.roll_back()


@auth_page.route('/metadata')
@login_required
def metadata():
    current_page = request.args.get('current_page', 1)
    current_page = int(str(current_page))
    page_size = 20
    total = Metadata.query.filter_by(creater_id=current_user.id).count()
    if (total % page_size) == 0:
        total_page = total / page_size
    else:
        total_page = (total / page_size) + 1
    offset = (current_page - 1) * page_size
    metadatas = Metadata.query.filter_by(creater_id=current_user.id).order_by(desc(Metadata.updated)).offset(
        offset).limit(
        page_size).all()
    return render_template('auth/metadata.html', current_page=current_page, total_page=total_page, metadatas=metadatas,
                           total=total)


@auth_page.route('/metadata_do_new')
@login_required
def metadata_do_new():
    meta = Metadata()
    opts = Option.get_opts(['ds_share_type', 'geo_coordinate', 'station_name', 'ds_quality_level'])
    opts.update({'category': Category.query.filter_by(parent_id=None).all()})
    return render_template('auth/metadata/new.html', meta=meta, opts=opts)


@auth_page.route('/metadata_save', methods=['POST'])
@login_required
def metadata_save():
    meta = Metadata()
    cid = uuid.uuid4()
    try:
        if request.form.get("id", None):
            meta.id = uuid.UUID(request.form.get("id"))
        else:
            meta.id = cid

        meta.meta_code = request.form.get('meta_code', '')
        meta.title_cn = request.form.get('title_cn', '')
        if request.form['ds_category']:
            meta.ds_category = request.form.get('ds_category', None)
        meta.title_en = request.form.get('title_en', '')
        meta.ds_abstract = request.form.get('ds_abstract', '')
        meta.ds_source = request.form.get('ds_source', '')
        meta.ds_process_way = request.form.get('ds_process_way', '')
        meta.ds_quality = request.form.get('ds_quality', '')
        if request.form['ds_acq_start_time']:
            meta.ds_acq_start_time = datetime.strptime(request.form['ds_acq_start_time'], '%Y-%m-%d')
        if request.form['ds_acq_end_time']:
            meta.ds_acq_end_time = datetime.strptime(request.form['ds_acq_end_time'], '%Y-%m-%d')

        meta.ds_acq_place = request.form.get('ds_acq_place', '')
        if request.form['ds_acq_lon_east']:
            meta.ds_acq_lon_east = get_degree_from_str(request.form['ds_acq_lon_east'])
        if request.form['ds_acq_lat_south']:
            meta.ds_acq_lat_south = get_degree_from_str(request.form['ds_acq_lat_south'])
        if request.form['ds_acq_lon_west']:
            meta.ds_acq_lon_west = get_degree_from_str(request.form['ds_acq_lon_west'])
        if request.form['ds_acq_lat_north']:
            meta.ds_acq_lat_north = get_degree_from_str(request.form['ds_acq_lat_north'])
        if request.form['ds_acq_alt_low']:
            meta.ds_acq_alt_low = float(request.form['ds_acq_alt_low'])
        if request.form['ds_acq_alt_high']:
            meta.ds_acq_alt_high = float(request.form['ds_acq_alt_high'])

        meta.ds_share_type = request.form.get('ds_share_type', '')
        if request.form['ds_total_size']:
            meta.ds_total_size = int(request.form['ds_total_size'])
        meta.ds_format = request.form.get('ds_format', '')
        if request.form['ds_space_res']:
            meta.ds_space_res = int(request.form['ds_space_res'])
        meta.ds_time_res = request.form.get('ds_time_res', '')
        meta.ds_coordinate = request.form.get('ds_coordinate', '')
        meta.ds_projection = request.form.get('ds_projection', '')

        meta.ds_ref_way = request.form.get('ds_ref_way', '')
        meta.ds_ref_instruction = request.form.get('ds_ref_instruction', '')
        meta.ds_from_station = request.form.get('ds_from_station', '')
        meta.ds_serv_man = request.form.get('ds_serv_man', '')
        meta.ds_serv_phone = request.form.get('ds_serv_phone', '')
        meta.ds_serv_mail = request.form.get('ds_serv_mail', '')

        # 上传缩略图
        if 'file_thumbnail' in request.files.to_dict():
            file_thumb = request.files['file_thumbnail']
            if file_thumb is not None:
                file_ext = get_file_ext(secure_filename(file_thumb.filename)).lower()
                new_name = '%s.%s' % (str(meta.id), file_ext)
                file_thumb.save(os.path.join(current_app.config.get('DS_THUMB_PATH'), new_name))
                meta.ds_thumbnail = new_name
        else:
            meta.ds_thumbnail = request.form.get("thumbnail_old", "")

        # 添加标签列表
        for cat in ['topic', 'subject', 'class', 'time', 'locus']:
            field = 'ds_%s_tags' % cat
            if request.form[field]:
                tokens = set(request.form[field].split(','))
                for tok in tokens:
                    if tok:
                        tag = MetaTag(text=tok.decode(encoding='utf-8'), meta_id=cid,
                                      category=cat.decode(encoding='utf-8'))
                        getattr(meta, field).append(tag)

        # 添加支持项目
        if request.form.has_key('ds_projects') and request.form['ds_projects']:
            ds_projects = request.form['ds_projects'].split(',')
            for pid in ds_projects:
                if pid:
                    q = DataProject.query.filter_by(id=pid).first()
                    if q:
                        meta.ds_projects.append(q)

        # 添加数据贡献者
        if request.form.has_key('ds_data_contributors') and request.form['ds_data_contributors']:
            ds_data_contributors = request.form['ds_data_contributors'].split(',')
            for pid in ds_data_contributors:
                if pid:
                    q = DataWorker.query.filter_by(id=pid).first()
                    if q:
                        meta.ds_contributors.append(q)

        # # 添加元数据作者
        if request.form.has_key('ds_meta_authors'):
            ds_meta_authors = request.form['ds_meta_authors'].split(',')
            for pid in ds_meta_authors:
                if pid:
                    q = DataWorker.query.filter_by(id=pid).first()
                    if q:
                        meta.ds_meta_authors.append(q)

        # # 添加数据管理者
        if request.form.has_key('ds_data_managers'):
            ds_data_managers = request.form['ds_data_managers'].split(',')
            for pid in ds_data_managers:
                if pid:
                    q = DataWorker.query.filter_by(id=pid).first()
                    if q:
                        meta.ds_managers.append(q)

        # # 添加数据产出
        if request.form.has_key('ds_outcomes'):
            ds_outcomes = request.form['ds_outcomes'].split(',')
            for pid in ds_outcomes:
                if pid:
                    q = DataOutcome.query.filter_by(id=pid).first()
                    if q:
                        meta.ds_outcomes.append(q)

        meta.creater = current_user
        meta.updater = current_user

        db.session.add(meta)
        db.session.commit()
        flash(u'元数据创建成功，请上传数据！')
        return redirect(url_for('auth.metadata_data', id=meta.id))

        # si = get_si()
        # j = json.dumps(meta.serialize())
        # si.add(json.loads(j))
        # si.commit()

    except Exception as err:
        print 'meta:', meta.ds_category
        print "err:", err.message
        db.session.rollback()

    finally:
        db.session.close()


@auth_page.route('/metadata_data')
@login_required
def metadata_data():
    id = request.args.get('id')
    if not id:
        flash(u'请先创建元数据，再上传数据！')
        return redirect(url_for('auth.metadata_new'))

    meta = Metadata.query.filter_by(id=id).first_or_404()
    opts = get_opts(['field_data_type', 'data_input_control'])
    files = DataPart.query.join(DataItem, DataPart.id == DataItem.part_id).filter_by(meta_id=id).all()
    return render_template('auth/metadata/data/list.html', items=files, opts=opts, meta=meta, indent=None)


@auth_page.route('/metadata/view/<cid>')
def metadata_view(cid):
    if cid == None:
        return redirect(url_for('auth.metadata_list'))
    meta = Metadata.query.filter_by(id=cid).first_or_404()
    opts = Option.get_opts(['ds_share_type', 'geo_coordinate', 'station_name', 'ds_quality_level'])
    db.session.commit()
    cols = [c.name for c in Metadata.__table__.columns] \
           + ['ds_topic_tags', 'ds_subject_tags', 'ds_class_tags', 'ds_time_tags', 'ds_locus_tags',
              'ds_projects', 'ds_contributors', 'ds_meta_authors', 'ds_managers', 'ds_outcomes']
    rst = {c: getattr(meta, c) for c in cols}
    if meta.ds_category:
        cat = Category.query.get(meta.ds_category)
        rst['ds_category'] = cat.name if cat else ''
    else:
        rst['ds_category'] = ''

    if meta.organization_id:
        org = Organization.query.get(meta.organization_id)
        rst['organization'] = org.name if org else ''
    else:
        rst['organization'] = ''
    print rst
    return render_template('auth/metadata/view.html', meta=rst, opts=opts, is_copy=False, indent=None)


@auth_page.route('/metadata/copy/<cid>')
def metadata_copy(cid):
    meta = Metadata.query.filter_by(id=cid).first()
    if not meta:
        return redirect(url_for('manage.metadata'))
    meta2 = copy.copy(meta)
    meta2.id = uuid.uuid4()
    meta2.title_cn = 'copy-' + meta.title_cn

    # 不复制元数据编码
    meta2.meta_code = None

    # 复制缩略图
    if meta2.ds_thumbnail and meta2.ds_thumbnail.strip():
        thumb_src = os.path.join(current_app.config.get('DS_THUMB_PATH'), meta.ds_thumbnail)
        n, thumb_ext = os.path.splitext(secure_filename(meta.ds_thumbnail).lower())
        meta2.ds_thumbnail = '%s%s' % (str(meta2.id), thumb_ext)
        thumb_dst = os.path.join(current_app.config.get('DS_THUMB_PATH'), '{0}{1}'.format(meta2.id, thumb_ext))
        shutil.copy(thumb_src, thumb_dst)
        print 'dst:', thumb_dst
    else:
        meta2.ds_thumbnail = None

    opts = get_opts(['ds_share_type', 'geo_coordinate', 'station_name', 'ds_quality_level'])
    opts.update({'category': Category.query.filter_by(parent_id=None).all()})
    return render_template('auth/metadata/edit.html', meta=meta2, opts=opts, is_copy=True, indent=None)


@auth_page.route('/metadata/edit/<cid>')
def metadata_edit(cid):
    if cid == None:
        return redirect(url_for('auth.metadata'))
    meta = Metadata.query.filter_by(id=cid, creater_id=current_user.id).first_or_404()
    opts = Option.get_opts(['ds_share_type', 'geo_coordinate', 'station_name', 'ds_quality_level'])
    opts.update({'category': Category.query.filter_by(parent_id=None).all()})
    db.session.commit()

    return render_template('auth/metadata/edit.html', meta=meta, opts=opts, is_copy=False, indent=None)


@auth_page.route('/metadata/do_edit', methods=['POST'])
def metadata_do_edit(is_copy=False):
    cid = request.form.get('id')
    meta = Metadata.query.get(cid)
    try:
        meta.meta_code = request.form.get('meta_code', '')
        meta.title_cn = request.form.get('title_cn', '')

        if request.form['ds_category']:
            meta.ds_category = request.form['ds_category']

        meta.title_en = request.form.get('title_en', '')
        meta.ds_abstract = request.form.get('ds_abstract', '')
        meta.ds_source = request.form.get('ds_source', '')
        meta.ds_process_way = request.form.get('ds_process_way', '')
        meta.ds_quality = request.form.get('ds_quality', '')

        if request.form['ds_acq_start_time']:
            meta.ds_acq_start_time = datetime.strptime(request.form['ds_acq_start_time'], '%Y-%m-%d')
        if request.form['ds_acq_end_time']:
            meta.ds_acq_end_time = datetime.strptime(request.form['ds_acq_end_time'], '%Y-%m-%d')

        meta.ds_acq_place = request.form.get('ds_acq_place', '')

        if request.form['ds_acq_lon_east']:
            meta.ds_acq_lon_east = get_degree_from_str(request.form['ds_acq_lon_east'])
        if request.form['ds_acq_lat_south']:
            meta.ds_acq_lat_south = get_degree_from_str(request.form['ds_acq_lat_south'])
        if request.form['ds_acq_lon_west']:
            meta.ds_acq_lon_west = get_degree_from_str(request.form['ds_acq_lon_west'])
        if request.form['ds_acq_lat_north']:
            meta.ds_acq_lat_north = get_degree_from_str(request.form['ds_acq_lat_north'])

        if request.form['ds_acq_alt_low']:
            meta.ds_acq_alt_low = float(request.form['ds_acq_alt_low'])
        if request.form['ds_acq_alt_high']:
            meta.ds_acq_alt_high = float(request.form['ds_acq_alt_high'])

        meta.ds_share_type = request.form.get('ds_share_type', None)
        if request.form['ds_total_size']:
            meta.ds_total_size = int(request.form['ds_total_size'])

        meta.ds_format = request.form.get('ds_format')
        if request.form['ds_space_res']:
            meta.ds_space_res = int(request.form.get('ds_space_res'))
        meta.ds_time_res = request.form.get('ds_time_res', '')
        meta.ds_coordinate = request.form.get('ds_coordinate')
        meta.ds_projection = request.form.get('ds_projection')

        meta.ds_ref_way = request.form.get('ds_ref_way', '')
        meta.ds_ref_instruction = request.form.get('ds_ref_instruction', '')
        meta.ds_from_station = request.form.get('ds_from_station', '')
        meta.ds_serv_man = request.form.get('ds_serv_man', '')
        meta.ds_serv_phone = request.form.get('ds_serv_phone', '')
        meta.ds_serv_mail = request.form.get('ds_serv_mail', '')

        # 上传缩略图
        if 'file_thumbnail' in request.files.to_dict():
            file_thumb = request.files['file_thumbnail']
            if file_thumb:
                file_ext = get_file_ext(secure_filename(file_thumb.filename)).lower()
                new_name = '%s.%s' % (str(meta.id), file_ext);
                file_thumb.save(os.path.join(Config.DS_THUMB_PATH, new_name))
                meta.ds_thumbnail = new_name
                meta.ds_thumb_from = 2

        with db.session.no_autoflush:
            # 添加标签列表
            MetaTag.query.filter_by(meta_id=meta.id).delete()
            for cat in ['topic', 'subject', 'class', 'time', 'locus']:
                field = 'ds_%s_tags' % cat
                if request.form[field]:
                    print
                    field, request.form.get(field, '')
                    tokens = set(request.form[field].split(','))
                    for tok in tokens:
                        if tok:
                            getattr(meta, field).append(MetaTag(text=tok, meta_id=cid, category=cat))

            # 添加支持项目
            meta.ds_projects = []
            if request.form.has_key('ds_projects'):
                ds_projects = request.form['ds_projects'].split(',')
                for pid in set(ds_projects):
                    if not pid:
                        continue
                    q = DataProject.query.filter_by(id=pid).first()
                    if q:
                        meta.ds_projects.append(q)

            # 添加数据贡献者
            meta.ds_contributors = []
            if request.form.has_key('ds_data_contributors'):
                ds_contributors = request.form['ds_data_contributors'].split(',')
                for pid in set(ds_contributors):
                    if not pid:
                        continue
                    q = DataWorker.query.filter_by(id=pid).first()
                    if q:
                        meta.ds_contributors.append(q)

            # # 添加元数据作者
            meta.ds_meta_authors = []
            if request.form.has_key('ds_meta_authors'):
                ds_meta_authors = request.form['ds_meta_authors'].split(',')
                for pid in set(ds_meta_authors):
                    if not pid:
                        continue
                    q = DataWorker.query.filter_by(id=pid).first()
                    if q:
                        meta.ds_meta_authors.append(q)

            # # 添加数据管理者
            meta.ds_managers = []
            if request.form.has_key('ds_data_managers'):
                ds_data_managers = request.form['ds_data_managers'].split(',')
                for pid in set(ds_data_managers):
                    if not pid:
                        continue
                    q = DataWorker.query.filter_by(id=pid).first()
                    if q:
                        meta.ds_managers.append(q)

            # # 添加数据应用成果
            meta.ds_outcomes = []
            if request.form.has_key('ds_outcomes'):
                ds_outcomes = request.form['ds_outcomes'].split(',')
                for pid in set(ds_outcomes):
                    if not pid:
                        continue
                    q = DataOutcome.query.filter_by(id=pid).first()
                    if q:
                        meta.ds_outcomes.append(q)

            meta.updater = current_user

        db.session.commit()
        # si = get_si()
        # j = json.dumps(meta.serialize())
        # si.add(json.loads(j))
        # si.commit()
        flash(u'元数据修改成功，请上传数据！')
        return redirect(url_for('auth.metadata_data', id=meta.id))

    except Exception as err:
        print 'err：', err.message
        db.session.rollback()
    finally:
        db.session.close()


@auth_page.route('/metadata/delete', methods=['POST'])
def metadata_delete():
    rst = ajaxResult()
    try:
        mid = request.form.get('id')
        # meta=Metadata.query.filter_by(mid)
        Metadata.query.filter_by(id=mid, creater_id=current_user.id).delete()
        db.session.commit()
        # si = get_si()
        # sidel = si.delete_by_ids([mid])
        rst.success = True
        rst.msg = '删除成功'
    except Exception as err:
        print
        'err：', err.message
        rst.success = False
        rst.msg = '错误: %s' % (err.message,)
        db.session.rollback()
    finally:
        db.session.close()

    return jsonify(rst.__dict__)


@auth_page.route("/passport_logout", methods=["GET"])
def passport_logout():
    logout_user()
    return redirect('https://passport.escience.cn/logout?WebServerURL={}'.format(current_app.config.get('SITE_HOMEPAGE')))