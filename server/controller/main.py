from flask import Blueprint, render_template, request, flash, redirect, url_for, session, send_file
from flask_login import login_required, current_user
from flask_breadcrumbs import Breadcrumbs, register_breadcrumb, default_breadcrumb_root

import csv
import string
import os
import arrow
import pandas as pd
import time

from server.model.models import QC_Check, DB_User, QC_Audit
from server.controller.amqp.amqp_client import request_amqp
from server import db
from sqlalchemy import inspect

import pdfkit
import sqlite3
# import xlsxwriter


main = Blueprint('main', __name__)

# set main blueprint as a root
default_breadcrumb_root(main, '.')

# transform the query results to a readable dict
def as_dict(self):
    return {c.key: getattr(self, c.key)
            for c in inspect(self).mapper.column_attrs}

# the time stamp in the requeried format


def time_stamp():
    return arrow.utcnow().format('DD-MMM-YYYY HH:mm:ss')



@main.route('/', methods=('GET', 'POST'))
@register_breadcrumb(main, '.', 'QC-DB')
@login_required
def index():
    download_type = ['xlsx', 'pdf']

    # get the data in a dict structur
    # for the right person, if the query is not closed --> corrected=False (==1)
    if current_user.role == "MedOps":
        posts_data = QC_Check.query.filter_by(
            responsible=current_user.abbrev, corrected=1, close=1).all()
    else:
        # what DM / Admin sees
        posts_data = QC_Check.query.all()

    if request.method == 'POST':

        # get the requestesd file format
        download_type = request.form.get('download')

        # prepare the data to get read by pandas dataframe
        query_as_dict = [as_dict(r) for r in posts_data]

        # send the data with the working request to the message broker 
        request_amqp(query_as_dict, {"download_type":download_type})

        # TEMP: sleep until new pdf / excel file is really created
        time.sleep(3) 

        return send_file("controller/amqp/query_DataFrame.{}".format(download_type), as_attachment=True, attachment_filename="My_Queries.{}".format(download_type))

    return render_template('index.html', posts=posts_data, Download_Type=download_type)




@main.route('/data_entry', methods=('GET', 'POST'))
@register_breadcrumb(main, '.data_entry', '')
@login_required
def data_entry():
    Source_type = ["Source", "ICF"]
    User_data = DB_User.query.filter_by(role="MedOps").all()

    if request.method == 'POST':

        # header data form the form
        scr_no = request.form['scr_no']
        study_id = request.form['study_id']
        type = request.form['type']

        # data under the header data
        todo_name = request.form.getlist('row[][name]')
        title = request.form.getlist('row[][title]')
        description = request.form.getlist('row[][description]')
        page = request.form.getlist('row[][page]')
        visit = request.form.getlist('row[][visit]')
        created = time_stamp()

        for i in range(len(todo_name)):

            blog_entry = QC_Check(procedure=title[i], type=type, corrected=1, close=1, description=description[i], checker=current_user.abbrev,
                                  created=created, visit=visit[i], page=page[i], scr_no=scr_no, study_id=study_id, responsible=todo_name[i])

            db.session.add(blog_entry)
            db.session.commit()

        return redirect(url_for('main.data_entry'))

    return render_template('data_entry.html', Users=User_data, source_type=Source_type)


@main.route('/delete/<int:id>')
@login_required
def delete(id):
    # give your anwser to DM
    QC_Check.query.filter_by(id=id).update({"corrected": 0})

    db.session.commit()

    return redirect('/')


@main.route('/requery/<int:id>')
@login_required
def requery_query(id):
    # requery the row from the table of the QC Check model
    QC_Check.query.filter_by(id=id).update({"corrected": 1})

    db.session.commit()

    return redirect('/')


@main.route('/close/<int:id>')
@login_required
def close_query(id):
    # close the row from the table of the QC Check model
    QC_Check.query.filter_by(id=id).update({"close": 0})

    db.session.commit()

    return redirect('/')


# write the db changes to the audittrail file
def audit_trail(todo, id, category, old_value, new_value):

    # the audit trail file
    path_to_file = os.getcwd()+'/server/.log_files/data_log_qc.csv'
    # '../../templates'
    # metadata
    user = current_user.abbrev

    # the data in the model in form of a dict structure
    audit_data = QC_Audit(id=id, category=category, date_time=time_stamp(),
                          user=user, old_value=old_value, new_value=new_value).__dict__

    # NOTE: semi good solution for the extra data from sql alchemy
    audit_data.pop('_sa_instance_state', None)

    if todo == "edit":
        # write to file
        with open(path_to_file, 'a', newline='') as csvfile:
            # csv file header
            fieldnames = ['id', 'category', 'date_time',
                          'user', 'old_value', 'new_value']

            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

            # initiate the file
            if os.path.getsize(path_to_file) == 0:
                writer.writeheader()

            writer.writerow(audit_data)

    return "added to audit trail"


@main.route('/edit', methods=('GET', 'POST'))
@register_breadcrumb(main, '.edit_data', '')
@login_required
def edit():
    # get the id of the query you want to edit
    id = request.args.get('id', None)

    old_data = QC_Check.query.filter_by(id=id).first().__dict__
    User_data = DB_User.query.filter_by(role="MedOps").all()

    if request.method == 'POST':

        # get whole data as an dict
        new_data = request.form.to_dict()

        for category, new_value in new_data.items():

            # compare the data from the DB with the from the request.form
            if (old_data[category] != new_data[category]):

                # add the data to the audit trail
                audit_trail("edit", id, category,
                            old_data[category], new_value)

                # add new data to the data base
                QC_Check.query.filter_by(id=id).update({category: new_value})
                # set the query status to 'open' 
                QC_Check.query.filter_by(id=id).update({"corrected": 1})

                db.session.commit()

        return redirect(url_for('main.index'))

    return render_template('edit.html', data=old_data, Users=User_data)
