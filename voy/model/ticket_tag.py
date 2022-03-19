from sqlalchemy.dialects.postgresql import UUID

from voy.model import db
from voy.model.mixins import TimeStampMixin, UuidPrimaryKeyMixin


class TicketTag(UuidPrimaryKeyMixin, TimeStampMixin, db.Model):
    """Modelling tags to be used for adding information to tickets."""

    __tablename__ = 'ticket_tag'

    title = db.Column(db.String(30), unique=True)
    description = db.Column(db.Text)

    color_uuid = db.Column(UUID(as_uuid=True), db.ForeignKey('ticket_tag_color.uuid'))
    color = db.relationship('TicketTagColor', back_populates='tags')

    is_active = db.Column(db.Boolean, default=True, nullable=False)

    tickets = db.relationship(
        'Ticket',
        secondary='ticket_tag_mapping',
        back_populates='tags')

    def __repr__(self):
        return '<Tag: %s>' % self.title

