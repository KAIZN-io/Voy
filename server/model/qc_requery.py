from flask_login import UserMixin

from server.model import db


class QC_Requery(UserMixin, db.Model):
    __tablename__ = 'qc_requery'

    id = db.Column(db.Integer, primary_key=True)
    query_id = db.Column(db.Integer)
    abbrev = db.Column(db.Text)
    date_time = db.Column(db.Text)
    new_comment = db.Column(db.Text)
