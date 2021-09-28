from voy.model import db
from voy.model.mixins import TimeStampMixin


class QC_Requery(TimeStampMixin, db.Model):
    __tablename__ = 'qc_requery'

    id = db.Column(db.Integer, primary_key=True)
    query_id = db.Column(db.Integer)
    abbrev = db.Column(db.Text)
    new_comment = db.Column(db.Text)
