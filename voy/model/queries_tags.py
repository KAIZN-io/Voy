from voy.model import db
from voy.model.mixins import TimeStampMixin



class QueriesTags(TimeStampMixin, db.Model):
    """Modelling tags to be used for adding information to queries.

    Args:
        db ([type]): [description]
    """

    __tablename__ = 'queries_tags'

    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(30), unique=True)
    description = db.Column(db.String(500))

    color = db.Column(db.String(12))

    is_active = db.Column(db.Boolean, default=True, nullable=False)

    queries = db.relationship(
        'Queries',
        secondary='query_tag_association',
        back_populates='tags')
