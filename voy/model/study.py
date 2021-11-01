from voy.model import db
from voy.model.mixins import TimeStampMixin


class Study(TimeStampMixin, db.Model):
    """information about the study"""

    __tablename__ = 'study'

    id = db.Column(db.Integer, primary_key=True)
    internal_id = db.Column(db.Text, unique=True)

    comment = db.Column(db.Text)

    is_active = db.Column(db.Boolean, default=False, nullable=False)

    tickets = db.relationship('Ticket', back_populates='study')
    users = db.relationship(
        'User',
        secondary='study_user_mapping',
        back_populates='study')
