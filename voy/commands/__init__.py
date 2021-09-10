import click
from flask.cli import FlaskGroup

from voy.commands.database import database_blueprint as database_cli
from voy.commands.user import user_blueprint as user_cli


@click.group(cls=FlaskGroup)
def cli():
    """Management script for Voy."""
