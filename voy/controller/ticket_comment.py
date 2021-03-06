import logging

from flask import Blueprint, render_template, request, redirect, url_for
from flask_breadcrumbs import default_breadcrumb_root
from flask_login import login_required, current_user

from voy.constants import ROLE_MEDOPS, AVAILABLE_SOURCE_TYPES
from voy.model import Ticket, User, Study, TicketComment
from voy.model import db

# Get loggers
to_console = logging.getLogger('to_console')


# Create the Blueprint
ticket_comment_blueprint = Blueprint('ticket_comment_controller', __name__)
default_breadcrumb_root(ticket_comment_blueprint, '.')


@ticket_comment_blueprint.route('/tickets/<string:ticket_uuid>/comments/modal-content', methods=['GET'])
@login_required
def modal_content(ticket_uuid: str):
    return render_template('controller/ticket/comment/modal-content.html.j2',
                           ticket=Ticket.query.get(ticket_uuid))


@ticket_comment_blueprint.route('/tickets/<string:ticket_uuid>/comments/new', methods=['POST'])
@login_required
def new_post(ticket_uuid: str):
    comment_new = TicketComment(
        ticket = Ticket.query.get(ticket_uuid),
        commenter = current_user,
        content = request.form['content']
    )

    db.session.add(comment_new)
    db.session.commit()

    return redirect(url_for('dashboard_controller.index'))
