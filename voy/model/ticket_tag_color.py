from voy.model import db
from voy.model.mixins import TimeStampMixin, UuidPrimaryKeyMixin


class TicketTagColor(UuidPrimaryKeyMixin, TimeStampMixin, db.Model):
    """Modelling color to be used for coloring TicketTags."""

    __tablename__ = 'ticket_tag_color'

    name = db.Column(db.String(30), unique=True)
    hex_code = db.Column(db.String(7), unique=True)

    tags = db.relationship('TicketTag', back_populates='color')

    def __repr__(self):
        return '<Color: %s>' % self.name

