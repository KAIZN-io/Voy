import json
import logging.config
from pathlib import Path

import yaml
from flask import Flask
from flask_breadcrumbs import Breadcrumbs
from flask_login import LoginManager, current_user
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView

from .commands import database_cli, user_cli
from .constants import FLASH_TYPE_WARNING
from .controller import authentication_blueprint, profile_blueprint, dashboard_blueprint, home_blueprint, \
    user_blueprint, study_blueprint, ticket_blueprint, ticket_comment_blueprint
from .mail import mail
from .model import db, migrate, Study, Ticket, TicketComment, TicketTag, User


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
    login_manager.login_message_category = FLASH_TYPE_WARNING
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_uuid):
        # since the user_uuid is just the primary key of our user table, use it in the query for the user
        return User.query.get(user_uuid)


    admin = Admin()
    admin.add_view(ModelView(Study, db.session))
    admin.add_view(ModelView(Ticket, db.session))
    admin.add_view(ModelView(TicketComment, db.session))
    admin.add_view(ModelView(TicketTag, db.session))
    admin.add_view(ModelView(User, db.session))
    admin.init_app(app)

    # Register routing blueprints
    app.register_blueprint(authentication_blueprint)
    app.register_blueprint(dashboard_blueprint)
    app.register_blueprint(home_blueprint)
    app.register_blueprint(profile_blueprint)
    app.register_blueprint(study_blueprint)
    app.register_blueprint(ticket_blueprint)
    app.register_blueprint(ticket_comment_blueprint)
    # app.register_blueprint(user_blueprint)

    # Register CLI blueprints
    app.register_blueprint(database_cli)
    # app.register_blueprint(user_cli)

    # Inject current user into each template
    @app.context_processor
    def inject_user():
        return dict(current_user=current_user)

    # Register templating functions
    app.jinja_env.globals.update(
        asset=create_resolve_asset_path_function(
            Path(app.root_path, 'view/static/bundle/manifest.json')))

    return app


def create_resolve_asset_path_function(asset_manifest_path):
    def resolve_asset_path(asset_name):
        with open(asset_manifest_path, 'r') as asset_manifest_handle:
            asset_manifest_data = asset_manifest_handle.read()
            asset_manifest = json.loads(asset_manifest_data)

            return asset_manifest[asset_name]

    return resolve_asset_path
