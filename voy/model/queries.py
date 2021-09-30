from voy.model import db
from voy.model.mixins import TimeStampMixin


class Queries(TimeStampMixin, db.Model):
    __tablename__ = 'queries'

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
        'QueriesTags',
        secondary='query_tag_association',
        back_populates='queries')


# Tag relationship
db.Table('query_tag_association', db.Model.metadata,
    db.Column('query_id', db.ForeignKey('queries.id'), primary_key=True),
    db.Column('query_tag_id', db.ForeignKey('queries_tags.id'), primary_key=True),
)
