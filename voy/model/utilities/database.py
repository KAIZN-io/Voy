from sqlalchemy import inspect


def is_database_empty(db):
    """ Check if there are any tables in the database """

    return inspect(db.engine).get_table_names() == []
