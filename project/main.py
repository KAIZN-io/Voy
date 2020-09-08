from flask import Blueprint, render_template, request, flash, redirect
from flask_login import login_required, current_user

from .models import QC_Check
from .models import User
from . import db
from datetime import datetime
import csv



main = Blueprint('main', __name__)

@main.route('/')
@login_required
def index():
    # get the data in a dict structur
    # for the right person, if the query is not closed --> corrected=False (==1)
    posts_data = QC_Check.query.filter_by(responsible=current_user.name, corrected=1, close=1).all()

    return render_template('index.html', posts=posts_data)

@main.route('/about')
def about():
    return render_template('about.html')

# erstelle einen neuen Blog Eintrag --> db Eintrag
# erstellt eine /create-Route -> d.h. 'contact.kaizn.io/create'
@main.route('/create', methods=('GET', 'POST'))
@login_required
def create():

    User_data = User.query.all()

    if request.method == 'POST':

        todo_name = request.form['name']
        title = request.form['title']
        description = request.form['description']
        page = request.form['page']
        visit = request.form['visit']
        scr_no = request.form['scr_no']
        study_id = request.form['study_id']
        # type = request.form['type']
        # print(type)
        
        blog_entry = QC_Check(procedure=title, corrected=1, close=1, description=description, checker=current_user.name, created=datetime.utcnow(), visit=visit, page=page, scr_no=scr_no, study_id=study_id, responsible=todo_name)

        if not title:
            flash('Title is required!')
        else: 
            db.session.add(blog_entry)
            db.session.commit()

            return index()
    
            
    return render_template('create.html',Users=User_data)

# write the db changes to the audittrail file
# def audit_trail(id):

#     # transform the query results to a dict
#     queryDict = QC_Check.query.filter_by(id=id).first().__dict__

#     # utc time 
#     queryDict['time'] = datetime.utcnow()

#     #NOTE: semi good solution for the extra data from sql alchemy
#     queryDict.pop('_sa_instance_state', None)

#     # with open('audit_trail.csv', 'a', newline='') as csvfile:
#     #     fieldnames = ['id', 'created', 'time' , 'title', 'content']
        
#     #     writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    
#     #     writer.writeheader()
#     #     writer.writerow(queryDict)

#     return "added to audit trail"

@main.route('/delete/<int:id>')
@login_required
def delete(id):
    # delete the row from the table of the QC Check model
    QC_Check.query.filter_by(id=id).update({"corrected":0})  

    db.session.commit()

    return redirect('/')

@main.route('/close/<int:id>')
@login_required
def close_query(id):
    # close the row from the table of the QC Check model
    QC_Check.query.filter_by(id=id).update({"close":0})  

    db.session.commit()

    return redirect('/')

@main.route('/profile')
@login_required
def profile():
    return render_template('profile.html', name=current_user.name)

