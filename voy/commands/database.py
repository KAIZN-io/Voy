import logging

import click
from flask import Blueprint
from flask.cli import with_appcontext
from sqlalchemy import inspect
from werkzeug.security import generate_password_hash

from voy.constants import ROLE_ADMIN
from voy.controller.Compliance_Computerized_Systems_EMA import time_stamp
from voy.model import db, DB_User, User_Management

# Get loggers
to_user_file = logging.getLogger('to_user_file')

# Create the Blueprint
database = Blueprint('database', __name__)


@database.cli.command('init')
@with_appcontext
def init():
    """Initialize the database"""

    if not is_database_empty():
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
    new_user = DB_User(
        email=admin_email,
        abbrev=admin_abbreviation,
        role=ROLE_ADMIN,
        password=generate_password_hash(admin_password, method='sha256'),
        is_system_passwd=False,
        is_active=True
    )

    # add the new user to the database
    db.session.add(new_user)
    db.session.commit()

    # add the change to the user_management db
    user_management = User_Management(
        email=admin_email,
        abbrev=admin_abbreviation,
        role=ROLE_ADMIN,
        change_by="Initial Signup",
        date_time=time_stamp(),
        action="added"
    )

    audit_data = user_management.__dict__

    # NOTE: semi good solution for the extra data from sqlalchemy
    audit_data.pop('date_time', None)

    to_user_file.info(audit_data['change_by'], extra=audit_data)

    click.echo("Initialized the database.")


@database.cli.command('clear')
@with_appcontext
def clear():
    """Initialize the database"""

    if not click.confirm('THIS WILL DELETE ALL DATA. CONTINUE?'):
        click.echo("Aborted.")
        return

    if not click.confirm('ARE YOU SURE?'):
        click.echo("Aborted.")
        return

    # Remove all tables form teh database
    db.drop_all()

    click.echo("Database cleared.")


def is_database_empty():
    return inspect(db.engine).get_table_names() == []
