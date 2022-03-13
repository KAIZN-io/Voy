import logging

import click
from flask import Blueprint
from flask.cli import with_appcontext
from werkzeug.security import generate_password_hash

from voy.constants import ROLE_ADMIN, ROLE_MEDOPS
from voy.model import db, User, Study
from voy.model.utilities import is_database_empty

# Get loggers
to_user_file = logging.getLogger('to_user_file')

# Create the Blueprint
database_blueprint = Blueprint('database', __name__)


@database_blueprint.cli.command('init')
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
    user_admin = User(
        email=admin_email,
        abbreviation=admin_abbreviation,
        role=ROLE_ADMIN,
        password=generate_password_hash(admin_password, method='sha256'),
        is_system_password=False,
        is_active=True
    )
    db.session.add(user_admin)

    # Add sample Medops user
    user_medops = User(
        email='medops@kaizn.io',
        abbreviation='MED',
        role=ROLE_MEDOPS,
        password=generate_password_hash('MED', method='sha256'),
        is_system_password=False,
        is_active=True
    )
    db.session.add(user_medops)

    # Add a sample study
    study = Study(
        internal_id='123456789',
        is_active=True
    )
    db.session.add(study)

    # Save everything
    db.session.commit()

    click.echo("Initialized the database.")


@database_blueprint.cli.command('clear')
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
