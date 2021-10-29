import arrow

from voy.model import db


class ArrowDateTime(db.TypeDecorator):
    impl = db.DateTime

    def process_result_value(self, value, dialect):
        return arrow.get(value)

class TimeStampMixin(object):
	created_at = db.Column(ArrowDateTime, default=arrow.utcnow().datetime, nullable=False)
	updated_at = db.Column(ArrowDateTime, default=arrow.utcnow().datetime, nullable=False, onupdate=arrow.utcnow().datetime)

