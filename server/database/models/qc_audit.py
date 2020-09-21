class QC_Audit(UserMixin, db.Model):

    __tablename__ = 'qc_audit'

    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.Text)
    date_time = db.Column(DateTime, default=datetime.strptime(
        str(datetime.now()), '%Y-%m-%d %H:%M:%S.%f'))
    user = db.Column(db.Text)
    old_value = db.Column(db.String(100))
    new_value = db.Column(db.String(100))