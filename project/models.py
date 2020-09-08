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

    #! overwrite the standard table name with 'posts', where you will commit the data to
    __tablename__ = 'posts'

    id = db.Column(db.Integer, primary_key=True)
    created = db.Column(db.Text)
    title = db.Column(db.Text)
    content = db.Column(db.Text)

class QC_Check(UserMixin, db.Model):

    #! overwrite the standard table name with 'posts', where you will commit the data to
    __tablename__ = 'qc_check'

    id = db.Column(db.Integer, primary_key=True)
    checker = db.Column(db.Text)
    created = db.Column(db.Text)
    study_id = db.Column(db.Integer)
    scr_no = db.Column(db.Integer)
    type = db.Column(db.Text)
    visit = db.Column(db.Text)
    page = db.Column(db.Text)
    procedure = db.Column(db.Text)
    description = db.Column(db.Text)
    responsible = db.Column(db.Text)
    corrected = db.Column(db.Integer)
    closed = db.Column(db.Integer)