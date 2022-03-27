import json
import logging
import re

from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask.json import dump
from flask_breadcrumbs import register_breadcrumb, default_breadcrumb_root
from flask_login import login_required, current_user

from voy.constants import ROLE_MEDOPS, AVAILABLE_SOURCE_TYPES, FLASH_TYPE_SUCCESS
from voy.model import Ticket, TicketTag, User, Study
from voy.model import db

# Get loggers
to_console = logging.getLogger('to_console')


# Create the Blueprint
ticket_blueprint = Blueprint('ticket_controller', __name__)
default_breadcrumb_root(ticket_blueprint, '.')


@ticket_blueprint.route('/source-check', methods=['GET'])
@register_breadcrumb(ticket_blueprint, '.new', '')
@login_required
def new():
    return render_template('controller/ticket/new.html.j2',
                           available_source_types=AVAILABLE_SOURCE_TYPES,
                           staff_list_medops=User.query.filter_by(role=ROLE_MEDOPS).all(),
                           study_list=Study.query.all(),
                           ticket_tags=TicketTag.query.all())


@ticket_blueprint.route('/source-check', methods=['POST'])
@login_required
def new_post():

    split_pattern = re.compile("(?:\]\[?|\[)")

    form_ticket_items = filter(
        lambda key : key.startswith('ticket'),
        request.form.items())

    tickets = {}

    # Get general form data
    study = Study.query.get(request.form['study_uuid'])
    source_number = request.form['source_number']

    for field_name, value in request.form.lists():
        # Skip all fields that are not part of the ticket-array
        if not field_name.startswith('ticket'):
            continue

        _, index, field, _ = split_pattern.split(field_name)

        ticket = None

        if index not in tickets:
            # Create Ticket
            ticket = Ticket()

            # Add general data
            ticket.study = study
            ticket.source_number = source_number
            ticket.reporter = current_user

            # Store in list for later reference
            tickets[index] = ticket

            # Make sure ticket is saved on commit
            db.session.add(tickets[index])
        else:
            ticket = tickets[index]

        match field:
            case 'description':
                ticket.description = value[0]
            case 'assignee-uuid':
                ticket.assignee = User.query.get(value[0])
            case 'tags':
                for tag_uuid in value:
                    ticket.tags.append(TicketTag.query.get(tag_uuid))
            case 'visit':
                ticket.visit = value[0]
            case 'page':
                ticket.page = value[0]
            case 'procedure':
                ticket.procedure = value[0]

    db.session.commit()

    flash('Queries created successfully.', FLASH_TYPE_SUCCESS)

    # Stay on the page so that the user can add more tickets.
    return redirect(url_for('ticket_controller.new'))


@ticket_blueprint.route('/tickets/<string:ticket_uuid>/edit', methods=['GET'])
@login_required
def edit(ticket_uuid: str):
    return render_template('controller/ticket/edit.html.j2',
                           study_list=Study.query.all(),
                           staff_list_medops=User.query.filter_by(role=ROLE_MEDOPS).all(),
                           available_source_types=AVAILABLE_SOURCE_TYPES,
                           ticket=Ticket.query.get(ticket_uuid))


@ticket_blueprint.route('/tickets/<string:ticket_uuid>/edit', methods=['POST'])
@login_required
def edit_post(ticket_uuid: str):
    # Get the ticket
    ticket = Ticket.query.get(ticket_uuid)

    # Get the old ticket data. We need this alter for checking what has changed
    ticket_data_old = ticket.__dict__

    # Get data from the form and sanitize it
    ticket_data_new = request.form.to_dict()
    ticket_data_new['study_uuid'] = ticket_data_new['study_uuid']
    ticket_data_new['assignee_uuid'] = ticket_data_new['assignee_uuid']

    # Update the ticket
    Ticket.query.filter_by(uuid=ticket_uuid).update(ticket_data_new)

    # Reset the is_corrected status.
    ticket.is_corrected = False

    db.session.commit()

    flash('Query updated successfully.', FLASH_TYPE_SUCCESS)

    return redirect(url_for('dashboard_controller.index'))


# TODO: Make this a POST request; With a GET request it is too easy to just close tickets by their id. Also in terms of
# HTTP lingo, a GET request is only meant to get something. A POST is to modify.
@ticket_blueprint.route('/tickets/<string:ticket_uuid>/mark-as-corrected', methods=['GET'])
@login_required
def mark_as_corrected(ticket_uuid: str):

    Ticket.query.get(ticket_uuid).is_corrected = True

    db.session.commit()

    return redirect(url_for('dashboard_controller.index'))


# TODO: Make this a POST request; With a GET request it is too easy to just close tickets by their id. Also in terms of
# HTTP lingo, a GET request is only meant to get something. A POST is to modify.
@ticket_blueprint.route('/tickets/<string:ticket_uuid>/close', methods=['GET'])
@login_required
def close(ticket_uuid: str):

    Ticket.query.get(ticket_uuid).is_closed = True

    db.session.commit()

    return redirect(url_for('dashboard_controller.index'))
