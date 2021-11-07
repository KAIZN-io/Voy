from voy.model import db
from voy.model.mixins import TimeStampMixin, UuidPrimaryKeyMixin


class TicketTag(UuidPrimaryKeyMixin, TimeStampMixin, db.Model):
    """Modelling tags to be used for adding information to tickets."""

    __tablename__ = 'ticket_tag'

    title = db.Column(db.String(30), unique=True)
    description = db.Column(db.String(500))

    color = db.Column(db.String(12))

    is_active = db.Column(db.Boolean, default=True, nullable=False)

    tickets = db.relationship(
        'Ticket',
        secondary='ticket_tag_mapping',
        back_populates='tags')
