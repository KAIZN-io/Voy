class DB_User(UserMixin, db.Model):

    __tablename__ = 'db_user'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    abbrev = db.Column(db.Text, unique=True)
    role = db.Column(db.Text)