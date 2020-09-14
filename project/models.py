# models.py

from flask_login import UserMixin
from . import db
from sqlalchemy import DateTime
from datetime import datetime

# SQLAlchemy maps Python classes to database tables


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
    close = db.Column(db.Integer)


class QC_Audit(UserMixin, db.Model):

    __tablename__ = 'qc_audit'

    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.Text)
    date_time = db.Column(DateTime, default=datetime.strptime(
        str(datetime.now()), '%Y-%m-%d %H:%M:%S.%f'))
    user = db.Column(db.Text)
    old_value = db.Column(db.String(100))
    new_value = db.Column(db.String(100))


class DB_User(UserMixin, db.Model):

    __tablename__ = 'db_user'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    abbrev = db.Column(db.Text, unique=True)
    role = db.Column(db.Text)


class User_Management(UserMixin, db.Model):

    __tablename__ = 'user_management'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True)
    abbrev = db.Column(db.Text, unique=True)
    action = db.Column(db.Text)
    role = db.Column(db.Text)
    change_by = db.Column(db.Text)
