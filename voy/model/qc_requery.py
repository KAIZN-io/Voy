from voy.model import db
from voy.model.mixins import TimeStampMixin


class QC_Requery(TimeStampMixin, db.Model):
    __tablename__ = 'qc_requery'

    id = db.Column(db.Integer, primary_key=True)

    # TODO: Make this a relation.
    query_id = db.Column(db.Integer)

    # TODO: Relate to user here
    abbreviation = db.Column(db.Text)

    new_comment = db.Column(db.Text)
