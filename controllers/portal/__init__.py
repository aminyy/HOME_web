# coding=utf-8
from flask import Blueprint

portal_page = Blueprint('portal', __name__, template_folder='templates')

from controllers.portal import portal

from controllers.portal import metadata
from controllers.portal import land
from controllers.portal import test
from controllers.portal import sample
from controllers.portal import news
from controllers.portal import equipment
from controllers.portal import science
from controllers.portal import about
from controllers.portal import comment
from controllers.portal import map
from controllers.portal import library
from controllers.portal import topic
from controllers.portal import process
from controllers.portal import visualize
from controllers.portal import ehost
from controllers.portal import jobfarm
from controllers.portal import article
from controllers.portal import community
from controllers.portal import process
from controllers.portal import outcome
from controllers.portal import search
from controllers.portal import observe
