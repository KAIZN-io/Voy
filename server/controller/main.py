from flask import Blueprint, render_template, request, flash, redirect, url_for, session, send_file
from flask_login import login_required, current_user
from flask_breadcrumbs import Breadcrumbs, register_breadcrumb, default_breadcrumb_root

import csv
import os
import pandas as pd
import time

from server.model.models import QC_Check, DB_User, QC_Audit, QC_Requery
from server.controller.amqp.amqp_client import request_amqp
from server.controller.compliance import audit_trail, time_stamp
from server import db, logger
from sqlalchemy import inspect

import pdfkit
import sqlite3



main = Blueprint('main', __name__)

# set main blueprint as a root
default_breadcrumb_root(main, '.')

# transform the query results to a readable dict


def as_dict(self):
    return {c.key: getattr(self, c.key)
            for c in inspect(self).mapper.column_attrs}


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

        if request.form['button'] == 'download_button':

            # get the requestesd file format
            download_type = request.form.get('download')

            # prepare the data to get read by pandas dataframe
            query_as_dict = [as_dict(r) for r in posts_data]

            # send the data with the working request to the message broker
            request_amqp(query_as_dict, {"download_type": download_type})

            # TEMP: sleep until new pdf / excel file is really created
            time.sleep(3)

            return send_file("controller/amqp/query_DataFrame.{}".format(download_type), as_attachment=True, attachment_filename="My_Queries.{}".format(download_type))

        elif request.form['button'] == 'send_requery':
            comment = request.form['comment']
            query_id = request.form['query_id'] 

            new_comment = QC_Requery(abbrev=current_user.abbrev, date_time=time_stamp(), new_comment = comment, query_id=query_id)

            db.session.add(new_comment)
            db.session.commit()
            # id = db.Column(db.Integer, primary_key=True)
            # query_id = db.Column(db.Integer)
            # abbrev = db.Column(db.Text)
            # date_time = db.Column(db.Text)
            # new_comment = db.Column(db.Text)

            # NOTE: redirect after form submission to prevent duplicates.
            return redirect('/')

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

        # log into the console
        # logger.consoleHandler(created)
        # NOTE: should log into a log file with a json format
        logger(created)

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

@main.route('/modal_data/<int:query_id>')
@login_required
def modal_data(query_id):
    # # requery the row from the table of the QC Check model
    # QC_Check.query.filter_by(id=id).update({"corrected": 1})
    # db.session.commit()

    old_comment = db.session.query(QC_Requery).filter_by(query_id=query_id).order_by(QC_Requery.id.desc()).first()

    return render_template('modal_data.html', post=old_comment)


@main.route('/close/<int:id>')
@login_required
def close_query(id):
    # close the row from the table of the QC Check model
    QC_Check.query.filter_by(id=id).update({"close": 0})

    db.session.commit()

    return redirect('/')


@main.route('/edit_data', methods=('GET', 'POST'))
@register_breadcrumb(main, '.edit_data', '')
@login_required
def edit_data():
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
                audit_trail(current_user.abbrev, "edit", id, category,
                            old_data[category], new_value)

                # add new data to the data base
                QC_Check.query.filter_by(id=id).update({category: new_value})
                # set the query status to 'open'
                QC_Check.query.filter_by(id=id).update({"corrected": 1})

                db.session.commit()

        return redirect(url_for('main.index'))

    return render_template('edit_data.html', data=old_data, Users=User_data)
