import arrow

from voy.model import db


class TimeStampMixin(object):
	created_at = db.Column(db.DateTime, default=arrow.utcnow().datetime, nullable=False)
	updated_at = db.Column(db.DateTime, default=arrow.utcnow().datetime, nullable=False, onupdate=arrow.utcnow().datetime)
