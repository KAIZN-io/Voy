import logging
import time
from flask import Blueprint, render_template, request, flash, redirect, url_for, session, send_file
from flask_breadcrumbs import Breadcrumbs, register_breadcrumb, default_breadcrumb_root
from flask_login import login_required, current_user
from sqlalchemy import inspect

from voy.model import db
from voy.controller.Compliance_Computerized_Systems_EMA import audit_trail, time_stamp
from voy.controller.data_analysis import TransformData
from voy.model import Ticket, User, QC_Requery, Study

qc_database = Blueprint('qc_database', __name__)

# set qc_database blueprint as a root
default_breadcrumb_root(qc_database, '.')

"""
this file handles the qc data

"""
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
@qc_database.route('/add_study', methods=['POST'])
@register_breadcrumb(qc_database, '.qc_planning', '')
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

    return redirect(url_for('qc_database.qc_planning'))


@qc_database.route('/add_study', methods=['GET'])
@register_breadcrumb(qc_database, '.qc_planning', '')
@login_required
def form_qc_planning():
    """render the html form for qc planning

    Returns:
        [type]: [description]
    """
    return render_template('qc_planning.html.j2')


@qc_database.route('/data_entry', methods=['GET'])
@register_breadcrumb(qc_database, '.form_add_tickets', '')
@login_required
def form_add_tickets():
    source_type = ["Source", "ICF"]
    study_list = Study.query.all()
    staff_list_medops = User.query.filter_by(role="MedOps").all()

    return render_template('data_entry.html.j2', study_list=study_list, staff_list_medops=staff_list_medops, source_type=source_type)


@qc_database.route('/data_entry', methods=['POST'])
@register_breadcrumb(qc_database, '.form_add_tickets', '')
@login_required
def add_tickets():

    # header data form the form
    study_id = int(request.form['study_id'])
    study = Study.query.filter_by(id=study_id).scalar()
    type = request.form['type']
    scr_no = request.form['scr_no']

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
            type=type,
            scr_no=scr_no,

            visit=visits[i],
            page=pages[i],
            procedure=procedures[i],
            description=descriptions[i],

            assignee=assignee,
            reporter=current_user
        )

        db.session.add(ticket)

    db.session.commit()

    return redirect(url_for('qc_database.form_add_tickets'))


@qc_database.route('/', methods=('GET', 'POST'))
@register_breadcrumb(qc_database, '.', 'QC-DB')
@login_required
def index():
    download_type = ['xlsx', 'pdf']

    # get the data in a dict structur
    # for the right person, if the query is not closed --> is_corrected=False
    if current_user.role == "MedOps":
        posts_data = Ticket.query\
            .filter_by(
                assignee=current_user,
                is_corrected=False,
                is_closed=False
            )\
            .order_by(Ticket.created_at)\
            .all()
    else:
        # what DM / Admin sees
        posts_data = db.session.query(Ticket)\
            .filter_by(is_closed=False)\
            .order_by(Ticket.created_at)\
            .all()

    # query all user and the corresponding roles
    user_qc_requery = QC_Requery.query.with_entities(QC_Requery.query_id, QC_Requery.abbrev).all()
    user_data = User.query.with_entities(User.abbrev, User.role).all()
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
            download_type = request.form.get('download')

            # prepare the data to get read by pandas dataframe
            query_as_dict = [as_dict(r) for r in posts_data]

            if download_type == 'pdf':
                try:
                    TransformData.DictToPdf(query_as_dict, file_name)
                    to_console.info("{} downloaded the query table as a pdf file".format(current_user.abbrev))
                except Exception as e:
                    print(e)
                    to_console.info("The query table for {} could not get transformed into a pdf file".format(current_user.abbrev))

            elif download_type == 'xlsx':
                try:
                    TransformData.DictToExcel(query_as_dict, file_name)
                    to_console.info("{} downloaded the query table as an excel file".format(current_user.abbrev))
                except Exception as e:
                    print(e)
                    to_console.info("The query table for {} could not get transformed into a excel file".format(current_user.abbrev))

            # TEMP: sleep until new pdf / excel file is really created
            time.sleep(3)

            return send_file("controller/query_downloads/{}.{}".format(file_name, download_type), as_attachment=True)

            # # send the data with the working request to the message broker
            # request_amqp(query_as_dict, {"download_type": download_type})

            # return send_file("controller/amqp/query_DataFrame.{}".format(download_type), as_attachment=True, attachment_filename="My_Queries.{}".format(download_type))

        elif request.form['button'] == 'send_requery':
            comment = request.form['comment']
            query_id = request.form['query_id']

            new_comment = QC_Requery(
                abbrev=current_user.abbrev,
                new_comment=comment,
                query_id=query_id
            )

            db.session.add(new_comment)
            db.session.commit()
            # id = db.Column(db.Integer, primary_key=True)
            # query_id = db.Column(db.Integer)
            # abbrev = db.Column(db.Text)
            # date_time = db.Column(db.Text)
            # new_comment = db.Column(db.Text)

            # NOTE: redirect after form submission to prevent duplicates.
            return redirect('/')

    return render_template('index.html.j2', posts=posts_data, user_requery=user_requery, Download_Type=download_type)


@qc_database.route('/delete/<int:id>')
@login_required
def delete(id):
    # give your anwser to DM
    Ticket.query.filter_by(id=id).update({"is_corrected": True})

    db.session.commit()

    return redirect('/')


@qc_database.route('/requery/<int:id>')
@login_required
def requery_query(id):
    # requery the row from the table of the QC Check model
    Ticket.query.filter_by(id=id).update({"is_corrected": False})

    db.session.commit()

    return redirect('/')


@qc_database.route('/modal_data/<int:query_id>')
@login_required
def modal_data(query_id):
    old_comment = db.session.query(QC_Requery).filter_by(
        query_id=query_id).order_by(QC_Requery.id.desc()).first()

    return render_template('modal_data.html.j2', post=old_comment)


@qc_database.route('/info_modal/<int:query_id>')
@login_required
def info_modal(query_id):
    data_about_query = Ticket.query.filter_by(id=query_id).first()

    return render_template('modal_info.html.j2', post=data_about_query)


@qc_database.route('/close/<int:id>')
@login_required
def close_query(id):
    # close the row from the table of the QC Check model
    Ticket.query.filter_by(id=id).update({"is_closed": True})

    db.session.commit()

    return redirect('/')


@qc_database.route('/edit_data', methods=('GET', 'POST'))
@register_breadcrumb(qc_database, '.edit_data', '')
@login_required
def edit_data():
    # get the id of the query you want to edit
    id = request.args.get('id', None)
    study_list = Study.query.all()
    old_data = Ticket.query.filter_by(id=id).first().__dict__
    User_data = User.query.filter_by(role="MedOps").all()

    old_data["assignee"] = User.query.filter_by(id=old_data["assignee_id"]).scalar().abbrev

    if request.method == 'POST':

        # get whole data as an dict
        new_data = request.form.to_dict()

        # !TEMP: Bug fix for the "scr_no"
        try:
            new_data['scr_no'] = int(new_data['scr_no'])
        except:
            to_console.info("{} could not get transformed into an integer".format(new_data['scr_no']))

        for category, new_value in new_data.items():
            # TODO: Temporary solution
            if category == "assignee":
                # compare the data from the DB with the from the request.form
                new_value = User.query.filter_by(abbrev=new_value).scalar().id

            if (old_data[category] != new_data[category]):
                # add the data to the audit trail
                audit_trail(current_user.abbrev, "edit", id, category,
                            old_data[category], new_value)

                # add new data to the data base
                Ticket.query.filter_by(id=id).update({category: new_value})
                # set the query status to 'open'
                db.session.commit()

        Ticket.query.filter_by(id=id).update({"is_corrected": False})

        db.session.commit()

        return redirect(url_for('qc_database.index'))

    return render_template('edit_data.html.j2', data=old_data, Users=User_data, study_list=study_list)
