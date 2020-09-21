class Config(object):
    """Base config, uses staging database server."""
    DEBUG = False
    TESTING = False
    SECRET_KEY = '9OLWxND4o83j4K4iuopO'
    # database location 
    SQLALCHEMY_DATABASE_URI = 'sqlite:///database/db.sqlite'

    # set it false, if you dont use the Flask-SQLAlchemy event system 
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # SQLALCHEMY_DATABASE_URI = 'sqlite:///database.db'

# class ProductionConfig(Config):
    """Uses production database server."""

#     DATABASE_URI = 'mysql://user@localhost/foo'

class DevelopmentConfig(Config):
    DB_SERVER = 'localhost'
    # hot reload mit 'DEBUG=True'
    DEBUG = True

    # zur Sicherungen von Sitzungen 


# class TestingConfig(Config):
#     TESTING = True
