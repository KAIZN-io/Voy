import click
# import subprocess
from flask import Blueprint
from flask.cli import with_appcontext
from voy.model import db

database = Blueprint('database', __name__)


@database.cli.command('create')
@click.argument('name')
def create(name):
    """Create a user"""
    print("Create user: {}".format(name))

@database.cli.command('init')
@with_appcontext
def init():
    """Initialize the database"""
    db.create_all()
    click.echo("Initialized the database.")
    # subprocess.run('voy shell <(echo "ls")', shell=True)

