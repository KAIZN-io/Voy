import click
from flask.cli import FlaskGroup
from server.commands.database import database as database_cli


@click.group(cls=FlaskGroup)
def cli():
    """Management script for Voy."""
