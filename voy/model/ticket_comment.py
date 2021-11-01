from voy.model import db
from voy.model.mixins import TimeStampMixin


class TicketComment(TimeStampMixin, db.Model):
    __tablename__ = 'ticket_comment'

    id = db.Column(db.Integer, primary_key=True)

    ticket_id = db.Column(db.Integer, db.ForeignKey('ticket.id'))
    ticket = db.relationship('Ticket', back_populates='comments')

    commenter_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    commenter = db.relationship('User', foreign_keys='TicketComment.commenter_id')

    content = db.Column(db.Text)
