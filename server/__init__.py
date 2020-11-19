from flask import Flask
from flask import current_app, g
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
import logging
from flask_breadcrumbs import Breadcrumbs, register_breadcrumb

import os
import sqlite3
from contextlib import closing

import yaml
import logging.config

# logging.config.fileConfig('logging.conf',
#                           disable_existing_loggers=False)
# logging.config.dictConfig('logging.yml')

# logger = logging.getLogger(__name__)

with open('config/logging.yaml', 'r') as stream:
    yamld = yaml.safe_load(stream)
    logging.config.dictConfig(yamld)

to_qc_file = logging.getLogger('to_qc_file')
to_console = logging.getLogger('to_console')
to_user_file = logging.getLogger('to_user_file')

# init SQLAlchemy so we can use it later in our models
db = SQLAlchemy()


def create_app():
    app = Flask(__name__, template_folder='view/templates',
                static_url_path='', static_folder='view/static/dist',
                instance_relative_config=True)

    # import the configuration from the file config.py
    # app.config.from_object('config.DevelopmentConfig')
    app.config.from_object('config.default')
    # app.config.from_object("config."+os.getenv("ENV"))

    # Initialize Flask-Breadcrumbs
    Breadcrumbs(app=app)

    db.init_app(app)

    login_manager = LoginManager()
    login_manager.login_view = 'auth.login'
    login_manager.init_app(app)

    # dont get information level logs
    log = logging.getLogger('werkzeug')
    log.disabled = True

    from server.model import DB_User

    @login_manager.user_loader
    def load_user(user_id):
        # since the user_id is just the primary key of our user table, use it in the query for the user
        return DB_User.query.get(int(user_id))

    # blueprint for auth routes in our app
    # from .auth import auth as auth_blueprint
    from server.controller.auth import auth as auth_blueprint

    app.register_blueprint(auth_blueprint)

    # blueprint for non-auth parts of app
    # from .main import main as main_blueprint
    from server.controller.qc_database import qc_database as qc_database_blueprint

    app.register_blueprint(qc_database_blueprint)

    from server.controller.users_module import users_module as users_module_blueprint

    app.register_blueprint(users_module_blueprint)

    return app
