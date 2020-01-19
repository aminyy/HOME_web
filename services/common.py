#coding=utf-8

import StringIO
import os
import re
import uuid

from PIL import Image

# 根据文件路径获取缩略图
from flask import send_file, abort

# 对指定文件生成指定大小的缩略图.
from config import Config


def gen_image_thumb(fn, w=320, h=240):
    # print('fn:', fn, w, h)
    if fn:
        if not os.path.isfile(fn):
            fn  = os.path.join(Config.STATIC_PATH, 'assets/images/nopic.jpg')
    else:
        fn = os.path.join(Config.STATIC_PATH, 'assets/images/nopic.jpg')

    im = None
    try:
        im = Image.open(fn).convert('RGB')
    except Exception:
        fn = os.path.join(Config.STATIC_PATH, 'assets/images/nopic.jpg')
        im = Image.open(fn).convert('RGB')

    if (w > 0 and h > 0):
        im.thumbnail((w, h))
    img_io = StringIO.StringIO()
    im.save(img_io, 'JPEG', quality=70)
    img_io.seek(0)
    return send_file(img_io, mimetype='image/jpeg')


def str_is_uuid( s ):
    return re.match(r"\b[A-F0-9]{8}(?:-[A-F0-9]{4}){3}-[A-F0-9]{12}\b$", s, re.IGNORECASE) is not None

def assert_uuid_or_404(s):
    if not str_is_uuid(s):
        abort(404)

    return uuid.UUID(s)
