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


# TODO: impolement the tag system
@qc_database_blueprint.route('/add_study', methods=['POST'])
@register_breadcrumb(qc_database_blueprint, '.qc_planning', '')
@login_required
def qc_planning():
    """save the new study id to the database

    Returns:
        [type]: [description]
    """
    # TODO: Form validation
    internal_id = int(request.form.get('internal_id'))

    study = Study(internal_id=internal_id, is_active=True)

    db.session.add(study)
    db.session.commit()

    return redirect(url_for('qc_database_controller.qc_planning'))


@qc_database_blueprint.route('/add_study', methods=['GET'])
@register_breadcrumb(qc_database_blueprint, '.qc_planning', '')
@login_required
def form_qc_planning():
    """render the html form for qc planning

    Returns:
        [type]: [description]
    """
    return render_template('qc_planning.html.j2')


@qc_database_blueprint.route('/data_entry', methods=['GET'])
@register_breadcrumb(qc_database_blueprint, '.form_add_tickets', '')
@login_required
def form_add_tickets():
    source_type = ["Source", "ICF"]
    study_list = Study.query.all()
    staff_list_medops = User.query.filter_by(role="MedOps").all()

    return render_template('data_entry.html.j2', study_list=study_list, staff_list_medops=staff_list_medops, source_type=source_type)


@qc_database_blueprint.route('/data_entry', methods=['POST'])
@register_breadcrumb(qc_database_blueprint, '.form_add_tickets', '')
@login_required
def add_tickets():

    # header data form the form
    study_id = int(request.form['study_id'])
    study = Study.query.filter_by(id=study_id).scalar()
    source_type = request.form['type']
    study_subject_id = request.form['source_number']

    # data under the header data
    finding_visit = request.form.getlist('row[][visit]')
    finding_page = request.form.getlist('row[][page]')
    finding_procedures = request.form.getlist('row[][procedure]')
    finding_description = request.form.getlist('row[][description]')
    finding_assignee_ids = request.form.getlist('row[][assignee_id]')

    for i in range(len(finding_visit)):
        assignee_id = int(finding_assignee_ids[i])
        assignee = User.query.filter_by(id=assignee_id).scalar()

        ticket = Ticket(
            study=study,
            type=source_type,
            source_number=study_subject_id,

            visit=finding_visit[i],
            page=finding_page[i],
            procedure=finding_procedures[i],
            description=finding_description[i],

            assignee=assignee,
            reporter=current_user
        )

        db.session.add(ticket)

    db.session.commit()
    return redirect(url_for('qc_database_controller.form_add_tickets'))


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


@qc_database_blueprint.route('/delete/<int:id>')
@login_required
def delete(id: int):
    """MedOps says that the data finding is corrected

    Args:
        id ([type]): [description]

    Returns:
        [type]: [description]
    """

    # give your anwser to DM
    Ticket.query.filter_by(id=id).update({"is_corrected": True})

    db.session.commit()

    return redirect('/')


@qc_database_blueprint.route('/requery/<int:id>')
@login_required
def requery_query(id: int):
    """requery the row from the table of the QC Check model

    Args:
        id ([type]): [description]

    Returns:
        [type]: [description]
    """

    Ticket.query.filter_by(id=id).update({"is_corrected": False})

    db.session.commit()

    return redirect('/')


@qc_database_blueprint.route('/modal_data/<int:ticket_id>')
@login_required
def modal_data(ticket_id: int):
    """query the comment to the data finding
    """

    comments = Ticket.query.get(ticket_id).comments.order_by(TicketComment.created_at.desc())

    return render_template('modal_data.html.j2', post=comments)


@qc_database_blueprint.route('/info_modal/<int:query_id>')
@login_required
def info_modal(query_id: int):
    """the meta data of the data finding

    Args:
        query_id ([type]): [description]

    Returns:
        [type]: [description]
    """

    data_about_query = Ticket.query.filter_by(id=query_id).scalar()

    return render_template('modal_info.html.j2', post=data_about_query)


@qc_database_blueprint.route('/close/<int:id>')
@login_required
def close_query(id: int):
    """close the data finding

    Args:
        id ([type]): [description]

    Returns:
        [type]: [description]
    """

    Ticket.query.filter_by(id=id).update({"is_closed": True})


    db.session.commit()

    return redirect('/')


@qc_database_blueprint.route('/edit_data', methods=('GET', 'POST'))
@register_breadcrumb(qc_database_blueprint, '.edit_data', '')
@login_required
def edit_data():
    """edit the data finding

    Returns:
        [type]: [description]
    """
    # get the id of the query you want to edit
    data_id = request.args.get('id', None)

    study_list = Study.query.all()
    data_old = Ticket.query.filter_by(id=data_id).first().__dict__
    user_data = User.query.filter_by(role=ROLE_MEDOPS).all()

    data_old["assignee"] = User.query.filter_by(id=data_old["assignee_id"]).scalar().abbreviation

    if request.method == 'POST':

        # get whole data as an dict
        data = request.form.to_dict()

        # !TEMP: Bug fix for the "source_number"
        try:
            data['source_number'] = int(data['source_number'])
        except:
            to_console.info("{} could not get transformed into an integer".format(data['source_number']))

        for category, new_value in data.items():
            # TODO: Temporary solution
            if category == "assignee":
                # compare the data from the DB with the from the request.form
                new_value = User.query.filter_by(abbreviation=new_value).scalar().id

            if (data_old[category] != data[category]):
                # add the data to the audit trail
                add_to_audit_trail(current_user.abbreviation, "edit", data_id, category,
                            data_old[category], new_value)

                # add new data to the data base
                Ticket.query.filter_by(id=data_id).update({category: new_value})
                # set the query status to 'open'
                db.session.commit()

        Ticket.query.filter_by(id=data_id).update({"is_corrected": False})

        db.session.commit()

        return redirect(url_for('qc_database_controller.index'))

    return render_template('edit_data.html.j2', data=data_old, Users=user_data, study_list=study_list)
