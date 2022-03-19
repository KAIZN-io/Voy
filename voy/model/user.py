import arrow

from flask_login import UserMixin
from sqlalchemy.dialects.postgresql import UUID
from flask_admin.contrib.sqla import ModelView
from wtforms import SelectField, StringField
from werkzeug.security import generate_password_hash

from voy.constants import ROLE_ADMIN, ROLE_MEDOPS, ROLE_DATA_ENTRY, ROLE_DATA_MANAGER
from voy.model import db
from voy.model.mixins import TimeStampMixin, UuidPrimaryKeyMixin
from voy.model.types import UppercaseStringType

db.Table('study_user_mapping', db.Model.metadata,
    db.Column('study_uuid', UUID(as_uuid=True), db.ForeignKey('study.uuid'), primary_key=True),
    db.Column('user_uuid', UUID(as_uuid=True), db.ForeignKey('user.uuid'), primary_key=True),
    db.Column('is_qualified', db.Boolean, default=False, nullable=False),
    db.Column('qualified_since', db.DateTime, default=arrow.utcnow().datetime, nullable=False))


class User(UuidPrimaryKeyMixin, UserMixin, TimeStampMixin, db.Model):
    __tablename__ = 'user'

    reported_tickets = db.relationship('Ticket', back_populates='reporter', foreign_keys='Ticket.reporter_uuid')
    assigned_tickets = db.relationship('Ticket', back_populates='assignee', foreign_keys='Ticket.assignee_uuid')

    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    is_password_reset_required = db.Column(db.Boolean, default=False, nullable=False,)

    abbreviation = db.Column(UppercaseStringType(5), unique=True)
    role = db.Column(db.Text)

    is_active = db.Column(db.Boolean, default=True, nullable=False)

    studies = db.relationship(
        'Study',
        secondary='study_user_mapping',
        back_populates='users')

    def get_id(self):
        return self.uuid

    def __repr__(self):
        return '<User: %s>' % self.abbreviation


class UserView(ModelView):

    column_exclude_list = ('password', 'is_password_reset_required')

    form_excluded_columns = ('reported_tickets', 'assigned_tickets', 'password')

    form_overrides = dict(
        abbreviation=StringField,
        role=SelectField)
    form_args = dict(
        role=dict(choices=[ROLE_ADMIN, ROLE_MEDOPS, ROLE_DATA_ENTRY, ROLE_DATA_MANAGER]))

    form_extra_fields = {
        'new_password': StringField('New Password')
    }

    def on_model_change(self, form, model, is_created):

        # Update the password, if a new one was set.
        if model.new_password:
            model.password = generate_password_hash(model.new_password, method='sha256')
