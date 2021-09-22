import logging
import time
from datetime import datetime
from pathlib import Path

from flask import Blueprint, render_template, request, redirect, url_for, send_file, current_app
from flask_breadcrumbs import register_breadcrumb, default_breadcrumb_root
from flask_login import login_required, current_user
from sqlalchemy import inspect

from voy.controller.Compliance_Computerized_Systems_EMA import audit_trail, time_stamp
from voy.controller.data_analysis import TransformData
from voy.model import QC_Check, DB_User, QC_Requery
from voy.model import db
from voy.constants import FILE_TYPE_PDF, FILE_TYPE_XLSX, ROLE_MEDOPS, SOURCE_TYPE_SOURCE, SOURCE_TYPE_ICF, EXPORT_FOLDER


# Get loggers
to_console = logging.getLogger('to_console')

# Create the Blueprint
qc_database_blueprint = Blueprint('qc_database', __name__)
default_breadcrumb_root(qc_database_blueprint, '.')


@qc_database_blueprint.route('/qc_planning', methods=('GET', 'POST'))
@register_breadcrumb(qc_database_blueprint, '.qc_planning', '')
@login_required
def qc_planning():
    """Prioritize the studies

    Returns:
        [type]: [description]
    """

    # filter all unique study numbers
    study_list = db.session.query(QC_Check.study_id).distinct().all()
    study_list = [x[0] for x in study_list]
    study_list.sort()

    studies_prioritized = QC_Check.query.filter_by(prioritized=True).all()

    # get an unique list of all prioritized studies
    studies_prioritized = list(set([str(i.study_id) for i in studies_prioritized]))

    if request.method == 'POST':

        studies_prioritize_new = request.form.getlist('studyCheckbox')

        # first reset all prioritizations
        QC_Check.query.update({"prioritized": False})

        db.session.commit()

        # then update the database with the new prioritizations:
        for study_id in studies_prioritize_new:
            QC_Check.query.filter_by(study_id=str(study_id)).update({"prioritized": True})

            db.session.commit()

        return redirect(url_for('qc_database.qc_planning'))

    return render_template('qc_planning.html.j2', studies=study_list, prioritized_studies=studies_prioritized)


@qc_database_blueprint.route('/data_entry', methods=('GET', 'POST'))
@register_breadcrumb(qc_database_blueprint, '.data_entry', '')
@login_required
def data_entry():
    """add new data from the CRF check

    Returns:
        [type]: [description]
    """

    source_types = [SOURCE_TYPE_SOURCE, SOURCE_TYPE_ICF]
    user_data = DB_User.query.filter_by(role=ROLE_MEDOPS).all()

    if request.method == 'POST':

        # header data form the form
        study_subject_id = request.form['scr_no']
        study_id = request.form['study_id']
        source_type = request.form['type']

        # the finding data
        finding_user_name = request.form.getlist('row[][name]')
        finding_title = request.form.getlist('row[][title]')
        finding_description = request.form.getlist('row[][description]')
        finding_page = request.form.getlist('row[][page]')
        finding_visit = request.form.getlist('row[][visit]')
        finding_time = time_stamp()

        for i in range(len(finding_user_name)):
            data = QC_Check(
                procedure=finding_title[i],
                type=source_type,
                corrected=False,
                close=False,
                prioritized=False,
                description=finding_description[i],
                checker=current_user.abbrev,
                created=finding_time,
                visit=finding_visit[i],
                page=finding_page[i],
                scr_no=study_subject_id,
                study_id=study_id,
                responsible=finding_user_name[i]
            )

            db.session.add(data)
            db.session.commit()

        return redirect(url_for('qc_database.data_entry'))

    return render_template('data_entry.html.j2', Users=user_data, source_type=source_types)


def get_queries_for_user(user: DB_User) -> list:
    """gets a list of queries for the user filtered depending on their role.

    Args:
        user (DB_User): The user to get the queries for.

    Returns:
        [type]: A list of queries for the user.
    """

    query = QC_Check.query \
        .order_by(QC_Check.prioritized.desc()) \
        .order_by(QC_Check.created)

    if user.role == ROLE_MEDOPS:
        query.filter_by(
            responsible=user.abbrev,
            corrected=False,
            close=False
        )

    # TODO: why can I see closed Queries ?
    else:
        query.filter_by(close=False)

    return query.all()


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
    user_qc_requery = QC_Requery.query.with_entities(QC_Requery.query_id, QC_Requery.abbrev).all()
    user_data = DB_User.query.with_entities(DB_User.abbrev, DB_User.role).all()
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
                abbrev=current_user.abbrev,
                date_time=time_stamp(),
                new_comment=data_comment_new,
                query_id=data_id
            )

            db.session.add(data_comment_new)
            db.session.commit()

            # NOTE: redirect after form submission to prevent duplicates.
            return redirect('/')

    return render_template('index.html.j2', user_queries=user_queries, user_requery=user_requery, export_file_types=export_file_types)


@qc_database_blueprint.route('/export-data', methods=['POST'])
@login_required
def export_data():
    export_file_name = "Queries_{}_{}".format(current_user.abbrev, datetime.now().strftime("%Y-%m-%d_%H-%M-%S"))

    # get the requestesd file format
    export_file_type = request.form.get('export-file-type')

    # Set and create export path
    export_file_path = Path(current_app.root_path, EXPORT_FOLDER)
    export_file_path.mkdir(parents=True, exist_ok=True)

    # prepare the data to get read by pandas dataframe
    user_queries = get_queries_for_user(current_user)

    user_queries_dict = [as_dict(r) for r in user_queries]

    try:

        if export_file_type == FILE_TYPE_PDF:
            path_output = TransformData.DictToPdf(user_queries_dict, export_file_name, export_file_path)
        elif export_file_type == FILE_TYPE_XLSX:
            path_output = TransformData.DictToExcel(user_queries_dict, export_file_name, export_file_path)
        else:
            return "Unsupported file type."

        to_console.info("{} downloaded the query table as a {} file".format(current_user.abbrev, export_file_type))

    except Exception as e:
        to_console.info(e)
        to_console.info("The query table for {} could not get transformed into a {} file".format(
                current_user.abbrev, export_file_type))

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
    QC_Check.query.filter_by(id=id).update({"corrected": True})

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

    QC_Check.query.filter_by(id=id).update({"corrected": False})

    db.session.commit()

    return redirect('/')


@qc_database_blueprint.route('/modal_data/<int:query_id>')
@login_required
def modal_data(query_id: int):
    """query the comment to the data finding

    Args:
        query_id ([type]): [description]

    Returns:
        [type]: [description]
    """

    data_comment = db.session.query(QC_Requery).filter_by(
        query_id=query_id).order_by(QC_Requery.id.desc()).first()

    return render_template('modal_data.html.j2', post=data_comment)


@qc_database_blueprint.route('/info_modal/<int:query_id>')
@login_required
def info_modal(query_id: int):
    """the meta data of the data finding

    Args:
        query_id ([type]): [description]

    Returns:
        [type]: [description]
    """

    data_meta = QC_Check.query.filter_by(id=query_id).scalar()

    return render_template('modal_info.html.j2', post=data_meta)


@qc_database_blueprint.route('/close/<int:id>')
@login_required
def close_query(id: int):
    """close the data finding

    Args:
        id ([type]): [description]

    Returns:
        [type]: [description]
    """

    QC_Check.query.filter_by(id=id).update({"close": True})

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

    data_id: int = request.args.get('id', None)

    data_old = QC_Check.query.filter_by(id=data_id).first().__dict__
    user_data = DB_User.query.filter_by(role=ROLE_MEDOPS).all()

    if request.method == 'POST':

        # get whole data as an dict
        data = request.form.to_dict()

        # !TEMP: Bug fix for the "scr_no"
        try:
            data['scr_no'] = int(data['scr_no'])
        except:
            to_console.info("{} could not get transformed into an integer".format(data['scr_no']))

        for category, data_value in data.items():

            # compare the data from the DB with the from the request.form
            if (data_old[category] != data[category]):
                # add the data to the audit trail
                audit_trail(current_user.abbrev, "edit", data_id, category,
                            data_old[category], data_value)

                # add new data to the data base
                QC_Check.query.filter_by(id=data_id).update({category: data_value})
                # set the query status to 'open'
                db.session.commit()

        QC_Check.query.filter_by(id=data_id).update({"corrected": False})

        db.session.commit()

        return redirect(url_for('qc_database.index'))

    return render_template('edit_data.html.j2', data=data_old, Users=user_data)


def as_dict(self):
    """transform the data finding into a readable dict

    Returns:
        [type]: [description]
    """

    return {c.key: getattr(self, c.key)
            for c in inspect(self).mapper.column_attrs}
