from voy.model import db
from voy.model.mixins import TimeStampMixin


query_tag_association = db.Table('query_tag_association', db.Model.metadata,
    db.Column('query_id', db.ForeignKey('queries.id'), primary_key=True),
    db.Column('query_tag_id', db.ForeignKey('query_tags.id'), primary_key=True),
)


class Queries(TimeStampMixin, db.Model):
    # ! overwrite the standard table name with 'posts', where you will commit the data to
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
        'QueryTags',
        secondary=query_tag_association,
        back_populates='queries')


class QueryTags(TimeStampMixin, db.Model):
    """Modelling tags to be used for adding information to queries.

    Args:
        db ([type]): [description]
    """

    __tablename__ = 'query_tags'

    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(30), unique=True)
    description = db.Column(db.String(500))

    color = db.Column(db.String(12))

    is_active = db.Column(db.Boolean, default=True, nullable=False)

    queries = db.relationship(
        Queries,
        secondary=query_tag_association,
        back_populates='tags')
