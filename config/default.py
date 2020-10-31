from datetime import timedelta

DEBUG = True
TESTING = False

# set it false, if you dont use the Flask-SQLAlchemy event system
SQLALCHEMY_TRACK_MODIFICATIONS = False
PERMANENT_SESSION_LIFETIME = timedelta(minutes=60)
