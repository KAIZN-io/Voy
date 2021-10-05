import arrow

from flask_login import UserMixin

from voy.model import db
from voy.model.mixins import TimeStampMixin


db.Table('study_user_mapping', db.Model.metadata,
    db.Column('study_id', db.Integer, db.ForeignKey('studies.id'), primary_key=True),
    db.Column('user_id', db.Integer, db.ForeignKey('db_user.id'), primary_key=True),
    db.Column('is_qualified', db.Boolean, default=False, nullable=False),
    db.Column('qualified_since', db.DateTime, default=arrow.utcnow().datetime, nullable=False))


class DB_User(UserMixin, TimeStampMixin, db.Model):
    __tablename__ = 'db_user'

    id = db.Column(db.Integer, primary_key=True)

    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    is_system_passwd = db.Column(db.Boolean, default=False, nullable=False,)

    abbrev = db.Column(db.String(5), unique=True)
    role = db.Column(db.Text)

    is_active = db.Column(db.Boolean, default=False, nullable=False)

    studies = db.relationship(
        'Studies',
        secondary='study_user_mapping',
        back_populates='users') # how it get named in the table "Studies"
