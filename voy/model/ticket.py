from voy.model import db
from voy.model.mixins import TimeStampMixin


# Tag relationship
db.Table('ticket_tag_mapping', db.Model.metadata,
    db.Column('ticket_id', db.ForeignKey('ticket.id'), primary_key=True),
    db.Column('ticket_tag_id', db.ForeignKey('ticket_tag.id'), primary_key=True)
    )


class Ticket(TimeStampMixin, db.Model):
    __tablename__ = 'ticket'

    id = db.Column(db.Integer, primary_key=True)

    reporter_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    reporter = db.relationship("Reporter", back_populates="tickets")

    study_id = db.Column(db.Integer, db.ForeignKey('study.id'))
    study = db.relationship("Study", back_populates="tickets")

    scr_no = db.Column(db.Integer)
    type = db.Column(db.Text)
    visit = db.Column(db.Text)
    page = db.Column(db.Text)
    procedure = db.Column(db.Text)
    description = db.Column(db.Text)

    assignee_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    assignee = db.relationship("Assignee", back_populates="tickets")

    is_corrected = db.Column(db.Boolean, default=False, nullable=False)
    is_closed = db.Column(db.Boolean, default=False, nullable=False)

    tags = db.relationship(
        'TicketTag',
        secondary='ticket_tag_mapping',
        back_populates='tickets')
