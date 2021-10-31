import logging
from datetime import datetime
from pathlib import Path

from flask import Blueprint, render_template, request, send_file, current_app
from flask_breadcrumbs import register_breadcrumb, default_breadcrumb_root
from flask_login import login_required, current_user

from voy.constants import FILE_TYPE_PDF, FILE_TYPE_XLSX, EXPORT_FOLDER
from voy.repositories.user import get_tickets_for_user
from voy.services.file_export import export_dict_list

# Get loggers
to_console = logging.getLogger('to_console')


# Create the Blueprint
qc_database_blueprint = Blueprint('qc_database_controller', __name__)
default_breadcrumb_root(qc_database_blueprint, '.')


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


@qc_database_blueprint.route('/export-data', methods=['POST'])
@login_required
def export_data():

    export_file_type = request.form.get('export-file-type')

    try:
        path_output = export_dict_list(
            dict_list=get_tickets_for_user(current_user, as_dict=True),
            file_path=Path(current_app.root_path, '..', EXPORT_FOLDER),
            file_name="Queries_{}_{}".format(current_user.abbreviation, datetime.now().strftime("%Y-%m-%d_%H-%M-%S")),
            file_type=export_file_type)

        to_console.info("{} downloaded the query table as a {} file".format(current_user.abbreviation, export_file_type))

    except Exception as e:
        to_console.info(e)
        to_console.info("The query table for {} could not get transformed into a {} file".format(
                current_user.abbreviation, export_file_type))

        return "Error generating download file.", 500

    return send_file(path_output, as_attachment=True)
