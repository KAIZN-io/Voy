import click
from flask.cli import FlaskGroup
from voy.commands.database import database as database_cli
from voy.commands.user import user as user_cli


@click.group(cls=FlaskGroup)
def cli():
    """Management script for Voy."""
