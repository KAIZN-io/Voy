from voy.model import db


class Studies(db.Model):
    """information about the studies

    Args:
        db ([type]): [description]
    """

    __tablename__ = 'studies'

    id = db.Column(db.Integer, primary_key=True)
    internal_id = db.Column(db.Text, unique=True)
    is_active = db.Column(db.Boolean, default=False, nullable=False)
    comment = db.Column(db.Text)
