from datetime import timedelta
from os import environ

# from dotenv import load_dotenv
# load_dotenv()

DEBUG = True
TESTING = False

# set it false, if you dont use the Flask-SQLAlchemy event system
SQLALCHEMY_TRACK_MODIFICATIONS = False
PERMANENT_SESSION_LIFETIME = timedelta(minutes=60)
SECRET_KEY = environ.get('SECRET_KEY')
SQLALCHEMY_DATABASE_URI = environ.get('SQLALCHEMY_DATABASE_URI')
