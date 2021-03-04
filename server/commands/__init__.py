import click
from flask.cli import FlaskGroup
from server.commands.database import database as databaseCLI_blueprint


@click.group(cls=FlaskGroup)
def cli():
    """Management script for Voy."""
