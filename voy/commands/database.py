import click
from flask import Blueprint
from flask.cli import with_appcontext
from voy.model import db
from voy.model import DB_User
from voy.controller.Compliance_Computerized_Systems_EMA import passwd_generator
from werkzeug.security import generate_password_hash

database = Blueprint('database', __name__)


@database.cli.command('init')
@with_appcontext
def init():
    """Initialize the database"""
    db.create_all()
    click.echo("Initialized the database.")

@database.cli.command('reset')
@click.argument('user_abbreviation')
@with_appcontext
def reset(user_abbreviation):
    """Reset a password of an user"""

    # filter the requested user
    user = DB_User.query.filter_by(abbrev=user_abbreviation).first()

    if user:
        # generate a system password with the lenght of 10 and hash it
        new_passwd = passwd_generator(size=10)

        new_passwd_hash = generate_password_hash(new_passwd, method='sha256')

        # commit the new system password to the database
        DB_User.query.filter_by(abbrev=abbrev).update(
            {"password": new_passwd_hash, "is_system_passwd": True})
        db.session.commit()

        click.echo("Reset the password of the user {}".format(abbrev))
        # print the new password
        click.echo("The new password is : {}".format(new_passwd))

    else:
        click.echo("A user with the abbreviation of {} does not exist".format(abbrev))

