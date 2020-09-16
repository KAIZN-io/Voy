from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager 
import logging


import sqlite3
from contextlib import closing
from flask import current_app, g

# DATABASE = 'flaskr.db'

# def connect_db():
#     return sqlite3.connect(app.config[’DATABASE’])


# def init_db():
#     with closing(connect_db()) as db:
#         with app.open_resource(’schema.sql’, mode=’r’) as f:
#             db.cursor().executescript(f.read())
#         db.commit()


# init SQLAlchemy so we can use it later in our models
db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    # import the configuration from the file config.py
    app.config.from_object('config.DevelopmentConfig')

    db.init_app(app)

    login_manager = LoginManager()
    login_manager.login_view = 'auth.login'
    login_manager.init_app(app)

    # dont get information level logs 
    log = logging.getLogger('werkzeug')
    log.disabled = True

    from server.database.models import DB_User


    @login_manager.user_loader
    def load_user(user_id):
        # since the user_id is just the primary key of our user table, use it in the query for the user
        return DB_User.query.get(int(user_id))

    # blueprint for auth routes in our app
    from .auth import auth as auth_blueprint
    app.register_blueprint(auth_blueprint)

    # blueprint for non-auth parts of app
    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    return app