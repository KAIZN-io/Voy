from voy.model import db
from voy.model.flask_admin import ProtectedModelView
from voy.model.mixins import TimeStampMixin, UuidPrimaryKeyMixin


class Study(UuidPrimaryKeyMixin, TimeStampMixin, db.Model):
    """information about the study"""

    __tablename__ = 'study'

    internal_id = db.Column(db.Text, unique=True)

    comment = db.Column(db.Text)

    is_active = db.Column(db.Boolean, default=False, nullable=False)

    tickets = db.relationship('Ticket', back_populates='study')
    users = db.relationship(
        'User',
        secondary='study_user_mapping',
        back_populates='studies')

    def __repr__(self):
        return '<Study: %s>' % self.internal_id


class StudyView(ProtectedModelView):
    form_excluded_columns = ('tickets')
