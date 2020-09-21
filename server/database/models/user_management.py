class User_Management(UserMixin, db.Model):

    __tablename__ = 'user_management'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True)
    action = db.Column(db.Text)
    abbrev = db.Column(db.Text, unique=True)
    role = db.Column(db.Text)
    date_time = db.Column(DateTime, default=datetime.strptime(
        str(datetime.now()), '%Y-%m-%d %H:%M:%S.%f'))
    change_by = db.Column(db.Text)