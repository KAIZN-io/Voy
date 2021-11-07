import json
import logging

from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask.json import dump
from flask_breadcrumbs import register_breadcrumb, default_breadcrumb_root
from flask_login import login_required, current_user

from voy.compliance.ema import add_to_audit_trail
from voy.constants import ROLE_MEDOPS, AVAILABLE_SOURCE_TYPES, FLASH_TYPE_SUCCESS
from voy.model import Ticket, User, Study
from voy.model import db

# Get loggers
to_console = logging.getLogger('to_console')


# Create the Blueprint
ticket_blueprint = Blueprint('ticket_controller', __name__)
default_breadcrumb_root(ticket_blueprint, '.')


@ticket_blueprint.route('/tickets/new', methods=['GET'])
@register_breadcrumb(ticket_blueprint, '.new', '')
@login_required
def new():
    return render_template('controller/ticket/new.html.j2',
                           study_list=Study.query.all(),
                           staff_list_medops=User.query.filter_by(role=ROLE_MEDOPS).all(),
                           available_source_types=AVAILABLE_SOURCE_TYPES)


@ticket_blueprint.route('/tickets/new', methods=['POST'])
@login_required
def new_post():
    # header data form the form
    study_id = int(request.form['study_id'])
    study = Study.query.filter_by(id=study_id).scalar()
    source_type = request.form['source_type']
    source_number = request.form['source_number']

    # data under the header data
    visits = request.form.getlist('row[][visit]')
    pages = request.form.getlist('row[][page]')
    procedures = request.form.getlist('row[][procedure]')
    descriptions = request.form.getlist('row[][description]')
    assignee_ids = request.form.getlist('row[][assignee_id]')

    for i in range(len(visits)):
        assignee_id = int(assignee_ids[i])
        assignee = User.query.filter_by(id=assignee_id).scalar()

        ticket = Ticket(
            study=study,
            type=source_type,
            source_number=source_number,

            visit=visits[i],
            page=pages[i],
            procedure=procedures[i],
            description=descriptions[i],

            assignee=assignee,
            reporter=current_user
        )

        db.session.add(ticket)

    db.session.commit()

    flash('Queries created successfully.', FLASH_TYPE_SUCCESS)

    # Stay on the page so that the user can add more tickets.
    return redirect(url_for('ticket_controller.new'))


@ticket_blueprint.route('/tickets/<int:ticket_id>/edit', methods=['GET'])
@login_required
def edit(ticket_id: int):
    return render_template('controller/ticket/edit.html.j2',
                           study_list=Study.query.all(),
                           staff_list_medops=User.query.filter_by(role=ROLE_MEDOPS).all(),
                           ticket_data=Ticket.query.get(ticket_id))


@ticket_blueprint.route('/tickets/<int:ticket_id>/edit', methods=['POST'])
@login_required
def edit_post(ticket_id: int):
    # Get the ticket
    ticket = Ticket.query.get(ticket_id)

    # Get the old ticket data. We need this alter for checking what has changed
    ticket_data_old = ticket.__dict__

    # Get data from the form and sanitize it
    ticket_data_new = request.form.to_dict()
    ticket_data_new['study_id'] = int(ticket_data_new['study_id'])
    ticket_data_new['assignee_id'] = int(ticket_data_new['assignee_id'])

    # Log the updates to the ticket
    for key, value_new in ticket_data_new.items():
        value_old = ticket_data_old[key]

        if value_new != value_old:
            # add the data to the audit trail
            add_to_audit_trail(current_user.abbreviation, "edit", ticket_id, key,
                               value_old, value_new)

    # Update the ticket
    Ticket.query.filter_by(id=ticket_id).update(ticket_data_new)

    # Reset the is_corrected status.
    ticket.is_corrected = False

    db.session.commit()

    flash('Query updated successfully.', FLASH_TYPE_SUCCESS)

    return redirect(url_for('dashboard_controller.index'))


# TODO: Make this a POST request; With a GET request it is too easy to just close tickets by their id. Also in terms of
# HTTP lingo, a GET request is only meant to get something. A POST is to modify.
@ticket_blueprint.route('/tickets/<int:ticket_id>/mark-as-corrected', methods=['GET'])
@login_required
def mark_as_corrected(ticket_id: int):

    Ticket.query.get(ticket_id).is_corrected = True

    db.session.commit()

    return redirect(url_for('dashboard_controller.index'))


# TODO: Make this a POST request; With a GET request it is too easy to just close tickets by their id. Also in terms of
# HTTP lingo, a GET request is only meant to get something. A POST is to modify.
@ticket_blueprint.route('/tickets/<int:ticket_id>/close', methods=['GET'])
@login_required
def close(ticket_id: int):

    Ticket.query.get(ticket_id).is_closed = True

    db.session.commit()

    return redirect(url_for('dashboard_controller.index'))
