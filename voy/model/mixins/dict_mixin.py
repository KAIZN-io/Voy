from sqlalchemy import inspect


class DictMixin(object):

    def to_dict(self):
        """transform the query results to a dict
        """

        return {column.key: getattr(self, column.key)
                for column in inspect(self).mapper.column_attrs}
