import arrow

from voy.model import db


def get_utc_datetime_now():
    return arrow.utcnow().datetime


class ArrowDateTime(db.TypeDecorator):
    impl = db.DateTime

    def process_result_value(self, value, dialect):
        return arrow.get(value)

class TimeStampMixin(object):
	created_at = db.Column(ArrowDateTime, default=get_utc_datetime_now, nullable=False)
	updated_at = db.Column(ArrowDateTime, default=get_utc_datetime_now, nullable=False, onupdate=get_utc_datetime_now)
