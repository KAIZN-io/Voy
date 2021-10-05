from voy.model import db
from voy.model.mixins import TimeStampMixin


class Studies(TimeStampMixin, db.Model):
    """information about the studies

    Args:
        db ([type]): [description]
    """

    __tablename__ = 'studies'

    id = db.Column(db.Integer, primary_key=True)

    internal_id = db.Column(db.Text, unique=True)

    comment = db.Column(db.Text)

    is_active = db.Column(db.Boolean, default=False, nullable=False)

    users = db.relationship(
        'DB_User',
        secondary='study_user_mapping')
