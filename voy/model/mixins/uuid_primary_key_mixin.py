import uuid

from sqlalchemy.dialects.postgresql import UUID

from voy.model import db


class UuidPrimaryKeyMixin(object):
    uuid = db.Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True, nullable=False)
