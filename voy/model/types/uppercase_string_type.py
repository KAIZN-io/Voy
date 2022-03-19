from sqlalchemy import types


class UppercaseStringType(types.TypeDecorator):
    impl = types.String()

    def process_bind_param(self, value, dialect):
        return value.upper()
