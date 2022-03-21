import logging

import click
from flask import Blueprint
from flask.cli import with_appcontext
from werkzeug.security import generate_password_hash

from voy.constants import ROLE_ADMIN, ROLE_MEDOPS
from voy.model import db, User, Study, TicketTagColorScheme
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
        is_password_reset_required=False,
        is_active=True
    )
    db.session.add(user_admin)

    # Add sample Medops user
    user_medops = User(
        email='medops@kaizn.io',
        abbreviation='MED',
        role=ROLE_MEDOPS,
        password=generate_password_hash('MED', method='sha256'),
        is_password_reset_required=False,
        is_active=True
    )
    db.session.add(user_medops)

    # Add a sample study
    study = Study(
        internal_id='123456789',
        is_active=True
    )
    db.session.add(study)

    # Add default Tag colors
    text_light = '#ffffffff'
    text_dark = '#000000b2'
    db.session.add(TicketTagColorScheme(name='Black',   text_color=text_light, background_color='#0a0a0aff'))
    db.session.add(TicketTagColorScheme(name='Dark',    text_color=text_light, background_color='#363636ff'))
    db.session.add(TicketTagColorScheme(name='Light',   text_color=text_dark,  background_color='#f5f5f5ff'))
    db.session.add(TicketTagColorScheme(name='White',   text_color=text_dark,  background_color='#ffffffff'))
    db.session.add(TicketTagColorScheme(name='Primary', text_color=text_light, background_color='#00d1b2ff'))
    db.session.add(TicketTagColorScheme(name='Link',    text_color=text_light, background_color='#485fc7ff'))
    db.session.add(TicketTagColorScheme(name='Info',    text_color=text_light, background_color='#3e8ed0ff'))
    db.session.add(TicketTagColorScheme(name='Success', text_color=text_light, background_color='#48c78eff'))
    db.session.add(TicketTagColorScheme(name='Warning', text_color=text_dark,  background_color='#ffe08aff'))
    db.session.add(TicketTagColorScheme(name='Danger',  text_color=text_light, background_color='#f14668ff'))

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
