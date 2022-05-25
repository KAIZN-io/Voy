from datetime import timedelta
from os import environ


def parse_boolean(value='false'):
    return value.lower() in {"1", "t", "true", "y", "yes"}


class Config:
    DEBUG   = parse_boolean(environ.get('DEBUG', default="false"))
    TESTING = parse_boolean(environ.get('TESTING', default="false"))

    # set it false, if you dont use the Flask-SQLAlchemy event system
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SQLALCHEMY_DATABASE_URI = 'postgresql://{user}:{password}@{host}:{port}/{dbName}'.format(
        user     = environ.get('DB_USERNAME'),
        password = environ.get('DB_PASSWORD'),
        host     = environ.get('DB_HOST'),
        port     = environ.get('DB_PORT'),
        dbName   = environ.get('DB_NAME')
    )

    # E-Mail settings
    MAIL_SERVER   = environ.get('MAIL_HOST')
    MAIL_PORT     = int(environ.get('MAIL_PORT'))
    MAIL_USERNAME = environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = environ.get('MAIL_PASSWORD')
    MAIL_USE_TLS  = parse_boolean(environ.get('MAIL_USE_TLS', default="false"))
    MAIL_USE_SSL  = parse_boolean(environ.get('MAIL_USE_SSL', default="false"))

    PERMANENT_SESSION_LIFETIME = timedelta(minutes=60)
    SECRET_KEY   = environ.get('SECRET_KEY')
    SESSION_TYPE = 'filesystem'
