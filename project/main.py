# main.py

from flask import Blueprint, render_template, request, flash, redirect
from flask_login import login_required, current_user

from .models import Blog_Entry#, QC_Check
from .models import User
from . import db
from datetime import datetime
import csv



main = Blueprint('main', __name__)

@main.route('/')
def index():
    # get the data in a dict structur
    posts_data = Blog_Entry.query.all()

    return render_template('index.html', posts=posts_data)#, name=current_user.name)

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
        content = request.form['content']

        blog_entry = Blog_Entry(title=title, content=content, created=datetime.utcnow())
        # blog_entry = QC_Check(procedure=title, description=content, created=datetime.utcnow())

        if not title:
            flash('Title is required!')
        else: 
            db.session.add(blog_entry)
            db.session.commit()

            return index()
    
            
    return render_template('create.html',Users=User_data)

# write the db changes to the audittrail file
def audit_trail(id):

    # transform the query results to a dict
    queryDict = Blog_Entry.query.filter_by(id=id).first().__dict__

    # utc time 
    queryDict['time'] = datetime.utcnow()

    #NOTE: semi good solution for the extra data from sql alchemy
    queryDict.pop('_sa_instance_state', None)

    with open('audit_trail.csv', 'a', newline='') as csvfile:
        fieldnames = ['id', 'created', 'time' , 'title', 'content']
        
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    
        writer.writeheader()
        writer.writerow(queryDict)

    return "added to audit trail"

@main.route('/delete/<int:id>')
@login_required
def delete(id):
    # add the data to the audit trail
    audit_trail(id)


    # delete the row from the table of the Blog_Entry model
    Blog_Entry.query.filter_by(id=id).delete()  
    db.session.commit()

    return redirect('/')

@main.route('/profile')
@login_required
def profile():
    return render_template('profile.html', name=current_user.name)

