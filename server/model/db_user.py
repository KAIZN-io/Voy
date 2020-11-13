from flask_login import UserMixin

from server import db

class DB_User(UserMixin, db.Model):

    __tablename__ = 'db_user'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    system_passwd = db.Column(db.String(100))
    abbrev = db.Column(db.String(5), unique=True)
    role = db.Column(db.Text)
    active = db.Column(db.Integer)
