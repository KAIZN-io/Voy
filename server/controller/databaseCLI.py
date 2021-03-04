import click
from flask import Blueprint

databaseCLI = Blueprint('databaseCLI', __name__)

@databaseCLI.cli.command('create')
@click.argument('name')
def create(name):
    """"Create a user"""
    print("Create user: {}".format(name))
