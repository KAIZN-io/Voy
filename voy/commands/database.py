import logging

import click
from flask import Blueprint
from flask.cli import with_appcontext
from werkzeug.security import generate_password_hash

from voy.constants import ROLE_ADMIN
from voy.controller.Compliance_Computerized_Systems_EMA import time_stamp
from voy.model import db, User, User_Management
from voy.model.utils import is_database_empty

# Get loggers
to_user_file = logging.getLogger('to_user_file')

# Create the Blueprint
database = Blueprint('database', __name__)


@database.cli.command('init')
@with_appcontext
def init():
    """ Initialize the database with the basic table structure and creates an admin user """

    if not is_database_empty(db):
        click.echo('Error: Database already initialized.')
        click.echo('Run \'voy database clear\' to remove all data then try again.')
        return

    # Recreate all needed schemas
    db.create_all()

    # TODO: Check if entered mail is valid.
    admin_email = click.prompt('Enter admin email', type=str)
    admin_abbreviation = click.prompt('Enter admin abbreviation', type=str)
    admin_password = click.prompt('Enter admin password', type=str, hide_input=True)

    # create new user with the form data. Hash the password so plaintext version isn't saved.
    user_new = User(
        email=admin_email,
        abbrev=admin_abbreviation,
        role=ROLE_ADMIN,
        password=generate_password_hash(admin_password, method='sha256'),
        is_system_passwd=False,
        is_active=True
    )

    # add the new user to the database
    db.session.add(user_new)
    db.session.commit()

    # add the change to the user_management db
    user_management = User_Management(
        email=admin_email,
        abbrev=admin_abbreviation,
        role=ROLE_ADMIN,
        change_by="Initial Signup",
        action="added"
    )

    audit_data = user_management.__dict__

    # NOTE: semi good solution for the extra data from sqlalchemy
    audit_data.pop('created_at', None)

    to_user_file.info(audit_data['change_by'], extra=audit_data)

    click.echo("Initialized the database.")


@database.cli.command('clear')
@with_appcontext
def clear():
    """ Clears all data from the database """

    if not click.confirm('THIS WILL DELETE ALL DATA. CONTINUE?'):
        click.echo("Aborted.")
        return

    if not click.confirm('ARE YOU SURE?'):
        click.echo("Aborted.")
        return

    # Remove all tables form teh database
    db.drop_all()

    click.echo("Database cleared.")
