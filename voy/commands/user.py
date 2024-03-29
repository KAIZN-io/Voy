import click
from flask import Blueprint
from flask.cli import with_appcontext
from voy.model import db
from voy.model import User
from voy.compliance.ema import generate_password
from werkzeug.security import generate_password_hash


# Create the Blueprint
user_blueprint = Blueprint('user_cli', __name__, cli_group='user')


@user_blueprint.cli.command('reset')
@click.argument('user_abbreviation')
@with_appcontext
def reset(user_abbreviation):
    """Reset a password of an user"""

    # filter the requested user
    user = User.query.filter_by(abbreviation=user_abbreviation).scalar()

    if not user:
        click.echo()
        click.echo("Error!")
        click.echo("A user with the abbreviation of \"{}\" does not exist.".format(user_abbreviation))
        click.echo()
        return

    # generate a system password with the lenght of 10 and hash it
    password_new = generate_password(size=10)
    password_new_hash = generate_password_hash(password_new, method='sha256')

    # commit the new system password to the database
    User.query.filter_by(abbreviation=user_abbreviation).update(
        {"password": password_new_hash, "is_password_reset_required": True})
    db.session.commit()

    click.echo()
    click.echo("Success.")
    click.echo("Password for user \"{}\" was reset.".format(user_abbreviation))
    click.echo("New password: {}".format(password_new))
    click.echo()
