import click
from flask import Blueprint

database = Blueprint('database', __name__)


@database.cli.command()
def hello_world():
    """Can be called as `hello-world`."""
    print("Hello World!")


@database.cli.command('create')
@click.argument('name')
def create(name):
    """Create a user"""
    print("Create user: {}".format(name))
