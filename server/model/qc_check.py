from flask_login import UserMixin

from server import db


class QC_Check(UserMixin, db.Model):

    #! overwrite the standard table name with 'posts', where you will commit the data to
    __tablename__ = 'qc_check'

    id = db.Column(db.Integer, primary_key=True)
    checker = db.Column(db.Text)
    created = db.Column(db.Text)
    study_id = db.Column(db.Integer)
    scr_no = db.Column(db.Integer)
    type = db.Column(db.Text)
    visit = db.Column(db.Text)
    page = db.Column(db.Text)
    procedure = db.Column(db.Text)
    description = db.Column(db.Text)
    responsible = db.Column(db.Text)
    prioritized = db.Column(db.Integer)
    corrected = db.Column(db.Integer)
    close = db.Column(db.Integer)
