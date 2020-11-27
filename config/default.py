from datetime import timedelta
from os import environ


class Config(object):
    DEBUG   = environ.get('DEBUG')
    TESTING = environ.get('TESTING')

    # set it false, if you dont use the Flask-SQLAlchemy event system
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SQLALCHEMY_DATABASE_URI = "mysql+mysqlconnector://%s:%s@%s:%s/%s" % (
        environ.get('MYSQL_USER'),
        environ.get('MYSQL_PASSWORD'),
        environ.get('MYSQL_HOST'),
        environ.get('MYSQL_PORT'),
        environ.get('MYSQL_DATABASE'),
    )

    PERMANENT_SESSION_LIFETIME = timedelta(minutes=60)
    SECRET_KEY   = environ.get('SECRET_KEY')
    SESSION_TYPE = 'filesystem'
