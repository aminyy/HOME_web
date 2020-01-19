from flask import Blueprint

auth_page = Blueprint('auth', __name__, template_folder='templates')

from controllers.auth import auth
from controllers.auth import pan
from controllers.auth import passport
