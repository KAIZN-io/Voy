import click
from flask.cli import FlaskGroup
from server import create_app


@click.group(cls=FlaskGroup, create_app=create_app)
def cli():
    """Management script for the Wiki application."""


@cli.command()
def hello_world():
    """Can be called as `hello-world`."""
    print("Hello World!")
