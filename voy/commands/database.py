import click
from flask import Blueprint
from flask.cli import with_appcontext
from voy.model import db


database_blueprint = Blueprint('database', __name__)


@database_blueprint.cli.command('init')
@with_appcontext
def init():
    """Initialize the database"""
    db.create_all()
    click.echo("Initialized the database.")

