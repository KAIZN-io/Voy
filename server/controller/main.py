from flask import Blueprint, render_template, request, flash, redirect, url_for, session, send_file
from flask_login import login_required, current_user
import csv
import string
import os
import arrow
import pandas as pd

from server.database.models import QC_Check, DB_User, QC_Audit
from server import db
from sqlalchemy import inspect

import pdfkit
import sqlite3


main = Blueprint('main', __name__)


# transform the query results to a readable dict
def as_dict(self):
    return {c.key: getattr(self, c.key)
            for c in inspect(self).mapper.column_attrs}

# the time stamp in the requeried format
def time_stamp():
    return arrow.utcnow().format('DD-MMM-YYYY HH:mm:ss')

@main.route('/', methods=('GET', 'POST'))
@login_required
def index():
    # get the data in a dict structur
    # for the right person, if the query is not closed --> corrected=False (==1)
    if current_user.role == "MedOps":
        posts_data = QC_Check.query.filter_by(
            responsible=current_user.abbrev, corrected=1, close=1).all()
    else:
        # what DM / Admin sees
        posts_data = QC_Check.query.filter_by(close=1).all()

    # TODO: download your queries as an csv
    if request.method == 'POST':
        # prepare the data to get read by pandas dataframe
        query_as_dict = [as_dict(r) for r in posts_data]
        # read the query data to the dataframe
        query_DataFrame = pd.DataFrame(query_as_dict)
        query_DataFrame.to_excel("output.xlsx")

        query_DataFrame.to_html("query_DataFrame.html")

        # convert the html file into pdf with wkhtmltopdf
        pdfkit.from_file('query_DataFrame.html', 'query_DataFrame.pdf')

        # pdfkit.from_url('http://localhost:5000', 'index_page.pdf')

        print(query_DataFrame)
        return send_file("query_DataFrame.pdf", as_attachment=True, attachment_filename="My_Queries.pdf")

        # return redirect('/')

    return render_template('index.html', posts=posts_data)


# from flask import make_response

# @main.route('/download')
# def post(data):
#     csvList = ["ich", "bin", "Berliners"]
#     si = StringIO()
#     cw = csv.writer(si)
#     cw.writerows(csvList)

#     # 'output' type: <class 'flask.wrappers.Response'>
#     output = make_response(si.getvalue())
#     output.headers["Content-Disposition"] = "attachment; filename=export.csv"
#     output.headers["Content-type"] = "text/csv"

#     return output


@main.route('/about')
def about():
    return render_template('about.html')


# erstelle einen neuen Blog Eintrag --> db Eintrag
# erstellt eine /create-Route -> d.h. 'kaizn.io/create'

@main.route('/create', methods=('GET', 'POST'))
@login_required
def create():
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

        return redirect(url_for('main.create'))

    return render_template('create.html', Users=User_data, source_type=Source_type)


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


@main.route('/profile')
@login_required
def profile():
    return render_template('profile.html', name=current_user.abbrev)


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
                db.session.commit()

        return index()

    return render_template('edit.html', data=old_data, Users=User_data)
