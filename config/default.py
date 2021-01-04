from datetime import timedelta
from os import environ


class Config(object):
    DEBUG   = environ.get('DEBUG')
    TESTING = environ.get('TESTING')

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
