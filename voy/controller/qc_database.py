import logging
from datetime import datetime
from pathlib import Path

from flask import Blueprint, render_template, request, send_file, current_app
from flask_breadcrumbs import register_breadcrumb, default_breadcrumb_root
from flask_login import login_required, current_user
from sqlalchemy import inspect

from voy.constants import FILE_TYPE_PDF, FILE_TYPE_XLSX, ROLE_MEDOPS, EXPORT_FOLDER
from voy.model import Ticket, User
from voy.services.file_export import exportDictAsExcel, exportDictAsPdf

# Get loggers
to_console = logging.getLogger('to_console')


# Create the Blueprint
qc_database_blueprint = Blueprint('qc_database_controller', __name__)
default_breadcrumb_root(qc_database_blueprint, '.')


def as_dict(self):
    """transform the query results to a readable dict

    Returns:
        [type]: [description]
    """
    return {c.key: getattr(self, c.key)
            for c in inspect(self).mapper.column_attrs}


def get_tickets_for_user(user: User) -> list:
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
            is_closed=False)

    # TODO: why can I see closed Queries ?
    else:
        query.filter_by(
            is_closed=False)

    return Ticket.query.all()


@qc_database_blueprint.route('/', methods=['GET'])
@register_breadcrumb(qc_database_blueprint, '.', 'QC-DB')
@login_required
def index():
    available_export_file_types = {
        FILE_TYPE_XLSX: 'Excel (.xlsx)',
        FILE_TYPE_PDF:  'PDF (.pdf)',
    }

    return render_template('index.html.j2',
                           user_tickets=get_tickets_for_user(current_user),
                           available_export_file_types=available_export_file_types)


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
    user_queries = get_tickets_for_user(current_user)

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
