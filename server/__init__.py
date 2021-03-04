import logging
import logging.config
import yaml
from flask import Flask
from flask_breadcrumbs import Breadcrumbs, register_breadcrumb
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy

from .controller import auth_blueprint, qc_database_blueprint, users_module_blueprint
from .commands import databaseCLI_blueprint
from .model import db, migrate, DB_User

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
        static_folder='view/static/dist',
        instance_relative_config=True
    )

    # Import the configuration
    app.config.from_object('config.default.Config')

    # Attach the database to the app
    db.init_app(app)

    # Init Flask-Migrate
    migrate.init_app(app, db)

    # Initialize Flask-Breadcrumbs
    Breadcrumbs(app=app)

    # Initialize the login manager
    login_manager = LoginManager()
    login_manager.login_view = 'auth.login'
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        # since the user_id is just the primary key of our user table, use it in the query for the user
        return DB_User.query.get(int(user_id))

    # blueprint for auth routes in our app
    app.register_blueprint(databaseCLI_blueprint)
    app.register_blueprint(auth_blueprint)
    app.register_blueprint(qc_database_blueprint)
    app.register_blueprint(users_module_blueprint)

    return app
