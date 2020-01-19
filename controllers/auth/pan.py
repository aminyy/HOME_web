# coding=utf-8
import StringIO
import datetime
import os
import uuid
from functools import update_wrapper

from flask import current_app
from flask import make_response
from flask import render_template, request, jsonify
from flask import send_file

from config import Config
from controllers.auth import auth_page
from database import db
from models import Pan
from models import UavImage
from services.hdfs_service import get_hdfs


def crossdomain(origin=None, methods=None, headers=None,
                max_age=21600, attach_to_all=True,
                automatic_options=True):
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    if headers is not None and not isinstance(headers, basestring):
        headers = ', '.join(x.upper() for x in headers)
    if not isinstance(origin, basestring):
        origin = ', '.join(origin)
    if isinstance(max_age, datetime.timedelta):
        max_age = max_age.total_seconds()

    def get_methods():
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        def wrapped_function(*args, **kwargs):
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers

            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)

    return decorator


@auth_page.route('/pan/data', methods=['POST'])
def upload():
    status = "success"
    message = "success"
    try:
        parent_id = request.form.get('parentId')
        user_id = request.form.get('userId')
        uploaded_files = request.files.getlist("file[]")
        now = datetime.datetime.now()
        current_year = now.year
        current_month = now.month
        base_path = os.path.join(Config.HDFS_PAN_PATH, str(current_year), str(current_month))
        hdfs = get_hdfs()
        if not hdfs.exists_file_dir(base_path):
            hdfs.make_dir(base_path)

        for f in uploaded_files:
            original_file_name = f.filename
            _, ext = os.path.splitext(original_file_name.lower())
            pan_id = str(uuid.uuid4())
            new_file_name = pan_id + ext
            file_path = os.path.join(base_path, new_file_name)
            hdfs.create_file(file_path, f.stream)
            p = Pan(id=pan_id, name=original_file_name, type=1, parent_id=parent_id, user_id=user_id,
                    hdfs_path=file_path)
            db.session.add(p)
        db.session.commit()
    except Exception as err:
        db.session.rollback()
        status = "error"
        message = err.message
        raise
    finally:
        db.session.close()
    return jsonify(success=status, message=message)


@auth_page.route('/pan/data', methods=['GET'])
def download():
    pan_id = request.args.get("panId")
    hdfs = get_hdfs()
    pan = Pan.query.get(pan_id)
    if not pan:
        return render_template('auth/file_not_found.html')

    file_data = hdfs.read_file(pan.hdfs_path)
    str_io = StringIO.StringIO()
    str_io.write(file_data)
    str_io.seek(0)
    return send_file(str_io,
                     attachment_filename=pan.name,
                     as_attachment=True)


@auth_page.route('/pan/data/image', methods=['POST'])
def image_upload():
    status = "success"
    message = "success"
    try:
        uav_id = request.form.get('uavId')
        uploaded_files = request.files.getlist("file")
        now = datetime.datetime.now()
        current_year = now.year
        current_month = now.month
        base_path = os.path.join(Config.HDFS_UAV_PATH, str(current_year), str(current_month))
        hdfs = get_hdfs()
        if not hdfs.exists_file_dir(base_path):
            hdfs.make_dir(base_path)

        for f in uploaded_files:
            original_file_name = f.filename
            _, ext = os.path.splitext(original_file_name.lower())
            image_id = str(uuid.uuid4())
            new_file_name = image_id + ext
            file_path = os.path.join(base_path, new_file_name)
            hdfs.create_file(file_path, f.stream)
            p = UavImage(id=image_id, name=original_file_name, uav_id=uav_id,hdfs_path=file_path)
            db.session.add(p)
        db.session.commit()
    except Exception as err:
        db.session.rollback()
        status = "error"
        message = err.message
        raise
    finally:
        db.session.close()
    return jsonify(success=status, message=message)


@auth_page.route('/pan/data/image/<image_id>.jpg', methods=['GET'])
def image_preview(image_id):
    hdfs = get_hdfs()
    image = UavImage.query.get(image_id)
    if not image:
        return render_template('auth/file_not_found.html')

    file_data = hdfs.read_file(image.hdfs_path)
    str_io = StringIO.StringIO()
    str_io.write(file_data)
    str_io.seek(0)
    return send_file(str_io, mimetype='image/jpeg')
