from sqlalchemy.dialects.postgresql import UUID

from voy.model import db
from voy.model.mixins import TimeStampMixin, UuidPrimaryKeyMixin


class TicketComment(UuidPrimaryKeyMixin, TimeStampMixin, db.Model):
    __tablename__ = 'ticket_comment'

    ticket_uuid = db.Column(UUID(as_uuid=True), db.ForeignKey('ticket.uuid'))
    ticket = db.relationship('Ticket', back_populates='comments')

    commenter_uuid = db.Column(UUID(as_uuid=True), db.ForeignKey('user.uuid'))
    commenter = db.relationship('User', foreign_keys='TicketComment.commenter_uuid')

    content = db.Column(db.Text)
