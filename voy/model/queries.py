from voy.model import db
from voy.model.mixins import TimeStampMixin


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
