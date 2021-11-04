from sqlalchemy import inspect

from voy.model import db
from voy.model.mixins import TimeStampMixin


# Tag relationship
db.Table('ticket_tag_mapping', db.Model.metadata,
    db.Column('ticket_id', db.ForeignKey('ticket.id'), primary_key=True),
    db.Column('ticket_tag_id', db.ForeignKey('ticket_tag.id'), primary_key=True))


class Ticket(TimeStampMixin, db.Model):
    __tablename__ = 'ticket'

    id = db.Column(db.Integer, primary_key=True)

    reporter_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    reporter = db.relationship('User', back_populates='reported_tickets', foreign_keys='Ticket.reporter_id')

    assignee_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    assignee = db.relationship('User', back_populates='assigned_tickets', foreign_keys='Ticket.assignee_id')

    study_id = db.Column(db.Integer, db.ForeignKey('study.id'))
    study = db.relationship('Study', back_populates='tickets')

    source_number = db.Column(db.Integer)
    type = db.Column(db.Text)
    visit = db.Column(db.Text)
    page = db.Column(db.Text)
    procedure = db.Column(db.Text)
    description = db.Column(db.Text)

    is_corrected = db.Column(db.Boolean, default=False, nullable=False)
    is_closed = db.Column(db.Boolean, default=False, nullable=False)

    comments = db.relationship('TicketComment',
                               back_populates='ticket',
                               lazy='dynamic')

    tags = db.relationship(
        'TicketTag',
        secondary='ticket_tag_mapping',
        back_populates='tickets')

    def to_dict(self):
        """transform the query results to a dict
        """

        return {column.key: getattr(self, column.key)
                for column in inspect(self).mapper.column_attrs}

    def to_export_dict(self):
        """transform the query results to a human readable dict
        """

        export_dict = self.to_dict()

        # TODO: Set correct timezone here.
        export_dict['created_at'] = export_dict['created_at'].format('YYYY-MM-DD HH:mm:ss')
        export_dict['updated_at'] = export_dict['updated_at'].format('YYYY-MM-DD HH:mm:ss')

        return export_dict