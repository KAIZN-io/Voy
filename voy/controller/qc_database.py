import logging
import time
from datetime import datetime
from pathlib import Path

from flask import Blueprint, render_template, request, redirect, url_for, send_file, current_app
from flask_breadcrumbs import register_breadcrumb, default_breadcrumb_root
from flask_login import login_required, current_user
from sqlalchemy import inspect

from voy.compliance.ema import add_to_audit_trail
from voy.services.file_export import exportDictAsExcel, exportDictAsPdf
from voy.model import Ticket, User, TicketComment, Study
from voy.model import db
from voy.constants import FILE_TYPE_PDF, FILE_TYPE_XLSX, ROLE_MEDOPS, SOURCE_TYPE_SOURCE, SOURCE_TYPE_ICF, EXPORT_FOLDER

# Create the Blueprint
qc_database_blueprint = Blueprint('qc_database_controller', __name__)
default_breadcrumb_root(qc_database_blueprint, '.')

# Get loggers
to_console = logging.getLogger('to_console')

def as_dict(self):
    """transform the query results to a readable dict

    Returns:
        [type]: [description]
    """
    return {c.key: getattr(self, c.key)
            for c in inspect(self).mapper.column_attrs}


def get_queries_for_user(user: User) -> list:
    """gets a list of queries for the user filtered depending on their role.

    Args:
        user (User): The user to get the queries for.

    Returns:
        [type]: A list of queries for the user.
    """

    query = Ticket.query \
        .order_by(Ticket.created_at)

    if user.role == ROLE_MEDOPS:
        query.filter_by(
            assignee=current_user,
            is_corrected=False,
            is_closed=False
        )

    # TODO: why can I see closed Queries ?
    else:
        query.filter_by(is_closed=False)

    return Ticket.query.all()


# TODO: this function is to big !
@qc_database_blueprint.route('/', methods=['GET', 'POST'])
@register_breadcrumb(qc_database_blueprint, '.', 'QC-DB')
@login_required
def index():
    """generate the data table inside the start page

    Returns:
        [type]: [description]
    """

    export_file_types = {
        FILE_TYPE_XLSX: 'Excel (.xlsx)',
        FILE_TYPE_PDF:  'PDF (.pdf)',
    }

    # get the data in a dict structure
    # for the right person, if the query is not closed --> corrected=False
    user_queries = get_queries_for_user(current_user)

    # query all user and the corresponding roles
    user_qc_requery = TicketComment.query.with_entities(TicketComment.ticket_id, TicketComment.commenter_id).all()
    user_data = User.query.with_entities(User.abbreviation, User.role).all()
    user_data = (dict(user_data))
    user_qc_requery = dict(user_qc_requery)

    user_requery = {}
    # map the query id with the corresponding user role
    for i, j in user_qc_requery.items():
        user_requery[str(i)] = user_data[j]

    if request.method == 'POST':

        if request.form['button'] == 'send_requery':
            data_comment_new = request.form['comment']
            data_id = request.form['query_id']

            data_comment_new = QC_Requery(
                abbreviation=current_user.abbreviation,
                new_comment=data_comment_new,
                query_id=data_id
            )

            db.session.add(data_comment_new)
            db.session.commit()

            # NOTE: redirect after form submission to prevent duplicates.
            return redirect('/')

    return render_template('index.html.j2', user_queries=user_queries, user_requery=user_requery, export_file_types=export_file_types)


# TODO: fix the data export
@qc_database_blueprint.route('/export-data', methods=['POST'])
@login_required
def export_data():
    export_file_name = "Queries_{}_{}".format(current_user.abbreviation, datetime.now().strftime("%Y-%m-%d_%H-%M-%S"))

    # get the requestesd file format
    export_file_type = request.form.get('export-file-type')

    # Set and create export path
    export_file_path = Path(current_app.root_path, '..', EXPORT_FOLDER)
    export_file_path.mkdir(parents=True, exist_ok=True)

    # prepare the data to get read by pandas dataframe
    user_queries = get_queries_for_user(current_user)

    user_queries_dict = [as_dict(r) for r in user_queries]

    try:

        if export_file_type == FILE_TYPE_PDF:
            path_output = exportDictAsPdf(user_queries_dict, export_file_name, export_file_path)
        elif export_file_type == FILE_TYPE_XLSX:
            path_output = exportDictAsExcel(user_queries_dict, export_file_name, export_file_path)
        else:
            return "Unsupported file type."

        to_console.info("{} downloaded the query table as a {} file".format(current_user.abbreviation, export_file_type))

    except Exception as e:
        to_console.info(e)
        to_console.info("The query table for {} could not get transformed into a {} file".format(
                current_user.abbreviation, export_file_type))

        return "Error generating download file."

    return send_file(path_output, as_attachment=True)

# TODO: Move this action to the ticket controller
@qc_database_blueprint.route('/modal_data/<int:ticket_id>')
@login_required
def modal_data(ticket_id: int):
    """query the comment to the data finding
    """

    comments = Ticket.query.get(ticket_id).comments.order_by(TicketComment.created_at.desc())

    return render_template('modal_data.html.j2', post=comments)


# TODO: Move this action to the ticket controller
@qc_database_blueprint.route('/info_modal/<int:query_id>')
@login_required
def info_modal(query_id: int):
    """the meta data of the data finding

    Args:
        query_id ([type]): [description]

    Returns:
        [type]: [description]
    """

    data_about_query = Ticket.query.get(query_id)

    return render_template('modal_info.html.j2', post=data_about_query)
