from sqlalchemy.dialects.postgresql import UUID

from voy.model import db
from voy.model.flask_admin import ProtectedModelView
from voy.model.mixins import DictMixin, TimeStampMixin, UuidPrimaryKeyMixin


class TicketTag(DictMixin, UuidPrimaryKeyMixin, TimeStampMixin, db.Model):
    """Modelling tags to be used for adding information to tickets."""

    __tablename__ = 'ticket_tag'

    title = db.Column(db.String(30), unique=True)
    description = db.Column(db.Text)

    color_scheme_uuid = db.Column(UUID(as_uuid=True), db.ForeignKey('ticket_tag_color_scheme.uuid'))
    color_scheme = db.relationship('TicketTagColorScheme', back_populates='tags')

    is_active = db.Column(db.Boolean, default=True, nullable=False)

    tickets = db.relationship(
        'Ticket',
        secondary='ticket_tag_mapping',
        back_populates='tags')

    def __repr__(self):
        return '<Tag: %s>' % self.title

    def __json__(self):

        json_dict = self.to_dict()

        del json_dict['color_scheme_uuid']

        json_dict['uuid'] = self.uuid.hex

        json_dict['created_at'] = self.created_at.isoformat()
        json_dict['updated_at'] = self.updated_at.isoformat()

        json_dict['text_color'] = self.color_scheme.text_color
        json_dict['background_color'] = self.color_scheme.background_color

        return json_dict


class TicketTagView(ProtectedModelView):
    form_excluded_columns = ('tickets')
