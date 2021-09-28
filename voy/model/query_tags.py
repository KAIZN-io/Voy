from voy.model import db


class QueryTags(db.Model):
    """Modelling tags to be used for adding information to queries.

    Args:
        db ([type]): [description]
    """

    __tablename__ = 'study_tags'

    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(30), unique=True)
    description = db.Column(db.String(500))

    color = db.Column(db.String(12))

    is_active = db.Column(db.Boolean, default=True, nullable=False)
