import logging.config

import yaml
from flask import Flask
from flask_breadcrumbs import Breadcrumbs
from flask_login import LoginManager

from .commands import database_cli, user_cli
from .controller import authentication_blueprint, user_blueprint, qc_database_blueprint, users_module_blueprint, \
    study_blueprint
from .mail import mail
from .model import db, migrate, User


# Load logging configuration
with open('config/logging.yaml', 'r') as stream:
    yamld = yaml.safe_load(stream)
    logging.config.dictConfig(yamld)


def create_app():
    # Create the app
    app = Flask(
        'voy',
        template_folder='view/templates',
        static_url_path='',
        static_folder='view/static',
        instance_relative_config=True
    )

    # Import the configuration
    app.config.from_object('config.default.Config')

    # Attach the database to the app
    db.init_app(app)

    # Init Flask-Migrate
    migrate.init_app(app, db)

    # Attach the mailing service to the app
    mail.init_app(app)

    # Initialize Flask-Breadcrumbs
    Breadcrumbs(app=app)

    # Initialize the login manager
    login_manager = LoginManager()
    login_manager.login_view = 'authentication_controller.login'
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        # since the user_id is just the primary key of our user table, use it in the query for the user
        return User.query.get(int(user_id))

    # Register routing blueprints
    app.register_blueprint(authentication_blueprint)
    app.register_blueprint(study_blueprint)
    app.register_blueprint(user_blueprint)
    app.register_blueprint(qc_database_blueprint)
    app.register_blueprint(users_module_blueprint)

    # Register CLI blueprints
    app.register_blueprint(database_cli)
    app.register_blueprint(user_cli)

    return app
