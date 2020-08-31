# models.py

from flask_login import UserMixin
from . import db

# SQLAlchemy maps Python classes to database tables
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True) # primary keys are required by SQLAlchemy
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    name = db.Column(db.String(1000))

class Blog_Entry(UserMixin, db.Model):
    # overwrite the standard table name
    __tablename__ = 'posts'

    id = db.Column(db.Integer, primary_key=True)
    created = db.Column(db.Text)
    title = db.Column(db.Text)
    content = db.Column(db.Text)