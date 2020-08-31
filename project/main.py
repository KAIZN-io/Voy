# main.py

from flask import Blueprint, render_template, request, flash
from flask_login import login_required, current_user

from .models import Blog_Entry
from . import db
from datetime import datetime



main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/about')
def about():
    return render_template('about.html')

# erstelle einen neuen Blog Eintrag --> db Eintrag
# erstellt eine /create-Route -> d.h. 'contact.kaizn.io/create'
@main.route('/create', methods=('GET', 'POST'))
def create():
    
    if request.method == 'POST':

        title = request.form['title']
        content = request.form['content']

        blog_entry = Blog_Entry(title=title, content=content, created=datetime.utcnow())

        if not title:
            flash('Title is required!')
        else: 
            db.session.add(blog_entry)
            db.session.commit()

            return index()

            
    return render_template('create.html')

@main.route('/profile')
@login_required
def profile():
    return render_template('profile.html', name=current_user.name)

