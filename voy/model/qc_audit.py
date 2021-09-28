from voy.model import db
from voy.model.mixins import TimeStampMixin


class QC_Audit(TimeStampMixin, db.Model):
    __tablename__ = 'qc_audit'

    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.Text)
    user = db.Column(db.Text)
    old_value = db.Column(db.String(100))
    new_value = db.Column(db.String(100))
