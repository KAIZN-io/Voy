from voy.model import db
from voy.model.mixins import TimeStampMixin


class TicketTag(TimeStampMixin, db.Model):
    """Modelling tags to be used for adding information to tickets."""

    __tablename__ = 'ticket_tag'

    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(30), unique=True)
    description = db.Column(db.String(500))

    color = db.Column(db.String(12))

    is_active = db.Column(db.Boolean, default=True, nullable=False)

    tickets = db.relationship(
        'Ticket',
        secondary='ticket_tag_mapping',
        back_populates='tags')
