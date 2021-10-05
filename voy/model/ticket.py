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

    # TODO: Make this a relation
    checker = db.Column(db.Text)

    # TODO: Make this a relation
    study_id = db.Column(db.Text)
    scr_no = db.Column(db.Integer)
    type = db.Column(db.Text)
    visit = db.Column(db.Text)
    page = db.Column(db.Text)
    procedure = db.Column(db.Text)
    description = db.Column(db.Text)
    responsible = db.Column(db.Text)
    # TODO: update naming to include `is_` prefix for boolean values
    prioritized = db.Column(db.Boolean, default=False, nullable=False)
    corrected = db.Column(db.Boolean, default=False, nullable=False)
    close = db.Column(db.Boolean, default=False, nullable=False)

    tags = db.relationship(
        'TicketTag',
        secondary='ticket_tag_mapping',
        back_populates='tickets')
