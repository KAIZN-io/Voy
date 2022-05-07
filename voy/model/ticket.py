import arrow
import hashlib
from sqlalchemy import inspect
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.hybrid import hybrid_property

from voy.model import db
from voy.model.mixins import DictMixin, TimeStampMixin, UuidPrimaryKeyMixin
from voy.utilities import count_working_days

# Tag relationship
db.Table('ticket_tag_mapping', db.Model.metadata,
    db.Column('ticket_uuid', db.ForeignKey('ticket.uuid'), primary_key=True),
    db.Column('ticket_tag_uuid', db.ForeignKey('ticket_tag.uuid'), primary_key=True))


class Ticket(DictMixin, TimeStampMixin, UuidPrimaryKeyMixin, db.Model):
    __tablename__ = 'ticket'

    reporter_uuid = db.Column(UUID(as_uuid=True), db.ForeignKey('user.uuid'))
    reporter = db.relationship('User', back_populates='reported_tickets', foreign_keys='Ticket.reporter_uuid')

    assignee_uuid = db.Column(UUID(as_uuid=True), db.ForeignKey('user.uuid'))
    assignee = db.relationship('User', back_populates='assigned_tickets', foreign_keys='Ticket.assignee_uuid')

    study_uuid = db.Column(UUID(as_uuid=True), db.ForeignKey('study.uuid'))
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

    @hybrid_property
    def internal_id(self):
        uuid_hash = str.upper(hashlib.sha224(str.encode(self.uuid.hex)).hexdigest()[:6])
        return f'{uuid_hash[:3]}-{uuid_hash[3:]}'

    @hybrid_property
    def working_days_open(self):
        return count_working_days(self.created_at, arrow.now())

    def to_export_dict(self):
        """transform the query results to a human readable dict
        """

        export_dict = self.to_dict()

        # TODO: Set correct timezone here.
        export_dict['created_at'] = export_dict['created_at'].format('YYYY-MM-DD HH:mm:ss')
        export_dict['updated_at'] = export_dict['updated_at'].format('YYYY-MM-DD HH:mm:ss')

        # TODO: Instead of ids, set the actual user abbreviations here.

        return export_dict

    def __json__(self):

        json_dict = self.to_dict()

        json_dict['uuid'] = self.uuid.hex
        json_dict['internal_id'] = self.internal_id

        json_dict['reporter'] = self.reporter.__json__()
        del json_dict['reporter_uuid']

        json_dict['assignee'] = self.assignee.__json__()
        del json_dict['assignee_uuid']

        json_dict['study'] = self.study.__json__()
        del json_dict['study_uuid']

        json_dict['created_at'] = self.created_at.isoformat()
        json_dict['updated_at'] = self.updated_at.isoformat()

        json_dict['working_days_open'] = self.working_days_open

        json_dict['tags'] = [ tag.__json__() for tag in self.tags ]

        return json_dict
