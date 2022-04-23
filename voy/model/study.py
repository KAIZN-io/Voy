from voy.model import db
from voy.model.flask_admin import ProtectedModelView
from voy.model.mixins import DictMixin, TimeStampMixin, UuidPrimaryKeyMixin


class Study(DictMixin, UuidPrimaryKeyMixin, TimeStampMixin, db.Model):
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

    def __json__(self):

        json_dict = self.to_dict()

        json_dict['uuid'] = self.uuid.hex

        json_dict['created_at'] = self.created_at.isoformat()
        json_dict['updated_at'] = self.updated_at.isoformat()

        return json_dict


class StudyView(ProtectedModelView):
    form_excluded_columns = ('tickets')
