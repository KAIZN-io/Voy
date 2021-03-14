from datetime import timedelta
from os import environ


def parse_boolean(value='false'):
    return value.lower() in {"1", "t", "true", "y", "yes"}


class Config(object):
    DEBUG   = parse_boolean(environ.get('DEBUG', default="false"))
    TESTING = parse_boolean(environ.get('TESTING', default="false"))

    # set it false, if you dont use the Flask-SQLAlchemy event system
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SQLALCHEMY_DATABASE_URI = 'postgresql://{user}:{password}@{host}:{port}/{dbName}'.format(
        user     = environ.get('DB_USER'),
        password = environ.get('DB_PASSWORD'),
        host     = environ.get('DB_HOST'),
        port     = environ.get('DB_PORT'),
        dbName   = environ.get('DB_NAME')
    )

    PERMANENT_SESSION_LIFETIME = timedelta(minutes=60)
    SECRET_KEY   = environ.get('SECRET_KEY')
    SESSION_TYPE = 'filesystem'
