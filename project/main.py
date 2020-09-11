from flask import Blueprint, render_template, request, flash, redirect
from flask_login import login_required, current_user

from .models import QC_Check
from .models import User, DB_User, QC_Audit
from . import db
from datetime import datetime
import csv
import string
import os

main = Blueprint('main', __name__)

@main.route('/')
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

    return render_template('index.html', posts=posts_data)


@main.route('/about')
def about():
    return render_template('about.html')

# erstelle einen neuen Blog Eintrag --> db Eintrag
# erstellt eine /create-Route -> d.h. 'contact.kaizn.io/create'


@main.route('/create', methods=('GET', 'POST'))
@login_required
def create():
    Source_type = ["Source", "ICF"]
    User_data = DB_User.query.filter_by(role="MedOps").all()

    if request.method == 'POST':

        todo_name = request.form['name']
        title = request.form['title']
        description = request.form['description']
        page = request.form['page']
        visit = request.form['visit']
        scr_no = request.form['scr_no']
        study_id = request.form['study_id']
        type = request.form['type']

        blog_entry = QC_Check(procedure=title, type=type, corrected=1, close=1, description=description, checker=current_user.abbrev,
                              created=datetime.utcnow(), visit=visit, page=page, scr_no=scr_no, study_id=study_id, responsible=todo_name)

        if not title:
            flash('Title is required!')
        else:
            db.session.add(blog_entry)
            db.session.commit()

            return index()

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
    path_to_file = os.getcwd()+'/project/.log_files/data_log_qc.csv'

    # metadata
    user = current_user.abbrev

    # the data in the model in form of a dict structure
    audit_data = QC_Audit(id=id, category=category, date_time=datetime.strptime(
        str(datetime.now()), '%Y-%m-%d %H:%M:%S.%f'),
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
    id = 46
    old_data = QC_Check.query.filter_by(id=id).first().__dict__
    User_data = DB_User.query.filter_by(role="MedOps").all()

    if request.method == 'POST':

        # get whole data as an dict
        new_data = request.form.to_dict()

        for key, new_value in new_data.items():
      
            # compare the data from the DB with the from the request.form
            if (old_data[key] != new_data[key]):

                # add the data to the audit trail
                audit_trail("edit", id, key, old_data[key], new_value)

        # if not title:
        #     flash('Title is required!')
        # else:
        #     db.session.add(blog_entry)
        #     db.session.commit()

        return index()

    return render_template('edit.html', data=old_data, Users=User_data)
