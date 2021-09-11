import logging
import time

from flask import Blueprint, render_template, request, redirect, url_for, send_file
from flask_breadcrumbs import register_breadcrumb, default_breadcrumb_root
from flask_login import login_required, current_user
from sqlalchemy import inspect

from voy.controller.Compliance_Computerized_Systems_EMA import audit_trail, time_stamp
from voy.controller.data_analysis import TransformData
from voy.model import QC_Check, DB_User, QC_Requery
from voy.model import db

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

    return render_template('qc_planning.html', studies=study_list, prioritized_studies=studies_prioritized)


@qc_database_blueprint.route('/data_entry', methods=('GET', 'POST'))
@register_breadcrumb(qc_database_blueprint, '.data_entry', '')
@login_required
def data_entry():
    """add new data from the CRF check

    Returns:
        [type]: [description]
    """

    source_types = ["Source", "ICF"]
    user_data = DB_User.query.filter_by(role="MedOps").all()

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

    return render_template('data_entry.html', Users=user_data, source_type=source_types)

# TODO: this function is to big !
@qc_database_blueprint.route('/', methods=('GET', 'POST'))
@register_breadcrumb(qc_database_blueprint, '.', 'QC-DB')
@login_required
def index():
    """generate the data table inside the start page

    Returns:
        [type]: [description]
    """

    file_type = ['xlsx', 'pdf']

    # get the data in a dict structure
    # for the right person, if the query is not closed --> corrected=False
    if current_user.role == "MedOps":
        data = QC_Check.query \
            .filter_by(
            responsible=current_user.abbrev,
            corrected=False,
            close=False
        ) \
            .order_by(QC_Check.prioritized.desc()) \
            .order_by(QC_Check.created) \
            .all()
    else:
        # what DM / Admin sees
        data = db.session.query(QC_Check) \
            .filter_by(close=False) \
            .order_by(QC_Check.prioritized.desc()) \
            .order_by(QC_Check.created) \
            .all()

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

        if request.form['button'] == 'download_button':
            file_name = "Queries_{}".format(current_user.abbrev)

            # get the requestesd file format
            file_type = request.form.get('download')

            # prepare the data to get read by pandas dataframe
            data_dict = [as_dict(r) for r in data]

            if file_type == 'pdf':
                try:
                    TransformData.DictToPdf(data_dict, file_name)
                    to_console.info("{} downloaded the query table as a pdf file".format(current_user.abbrev))
                except Exception as e:
                    print(e)
                    to_console.info(
                        "The query table for {} could not get transformed into a pdf file".format(current_user.abbrev))

            elif file_type == 'xlsx':
                try:
                    TransformData.DictToExcel(data_dict, file_name)
                    to_console.info("{} downloaded the query table as an excel file".format(current_user.abbrev))
                except Exception as e:
                    print(e)
                    to_console.info("The query table for {} could not get transformed into a excel file".format(
                        current_user.abbrev))

            # TEMP: sleep until new pdf / excel file is really created
            time.sleep(3)

            return send_file("controller/query_downloads/{}.{}".format(file_name, file_type), as_attachment=True)

            # # send the data with the working request to the message broker
            # request_amqp(data_dict, {"download_type": download_type})

            # return send_file("controller/amqp/query_DataFrame.{}".format(download_type), as_attachment=True, attachment_filename="My_Queries.{}".format(download_type))

        elif request.form['button'] == 'send_requery':
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

    return render_template('index.html', posts=data, user_requery=user_requery, Download_Type=file_type)


@qc_database_blueprint.route('/delete/<int:id>')
@login_required
def delete(id):
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
def requery_query(id):
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
def modal_data(query_id):
    """query the comment to the data finding

    Args:
        query_id ([type]): [description]

    Returns:
        [type]: [description]
    """

    data_comment = db.session.query(QC_Requery).filter_by(
        query_id=query_id).order_by(QC_Requery.id.desc()).first()

    return render_template('modal_data.html', post=data_comment)


@qc_database_blueprint.route('/info_modal/<int:query_id>')
@login_required
def info_modal(query_id):
    """the meta data of the data finding

    Args:
        query_id ([type]): [description]

    Returns:
        [type]: [description]
    """

    data_meta = QC_Check.query.filter_by(id=query_id).first()

    return render_template('modal_info.html', post=data_meta)


@qc_database_blueprint.route('/close/<int:id>')
@login_required
def close_query(id):
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

    data_id = request.args.get('id', None)

    data_old = QC_Check.query.filter_by(id=data_id).first().__dict__
    user_data = DB_User.query.filter_by(role="MedOps").all()

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

    return render_template('edit_data.html', data=data_old, Users=user_data)


def as_dict(self):
    """transform the data finding to a readable dict

    Returns:
        [type]: [description]
    """

    return {c.key: getattr(self, c.key)
            for c in inspect(self).mapper.column_attrs}
