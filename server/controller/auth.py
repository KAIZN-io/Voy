from flask import Blueprint, render_template, redirect, url_for, request, flash, current_app, session
from flask_login import login_user, logout_user, login_required, current_user
from flask_breadcrumbs import Breadcrumbs, register_breadcrumb, default_breadcrumb_root

from werkzeug.security import generate_password_hash, check_password_hash
import arrow


from server import db
from server.model.models import DB_User, User_Management


auth = Blueprint('auth', __name__)
# set main blueprint as a root
default_breadcrumb_root(auth, '.')

def time_stamp():
    return arrow.utcnow().format('DD-MMM-YYYY HH:mm:ss')


@auth.route('/login')
def login():
    return render_template('login.html')


@auth.route('/login', methods=('GET', 'POST'))
def login_post():

    abbrev = request.form.get('abbreviation')
    password = request.form.get('password')

    remember = True if request.form.get('remember') else False

    user = DB_User.query.filter_by(abbrev=abbrev).first()

    # check whether a user exits at all:
    if user == None:
        check_existing_user = DB_User.query.all()
        if len(check_existing_user) == 0:

            return redirect(url_for('auth.admin_signup'))

    # take the user supplied password, hash it, and compare it to the hashed password in database
    elif not user or not check_password_hash(user.password, password):
        flash('Please check your login details and try again.')
        # if user doesn't exist or password is wrong, reload the page
        return redirect(url_for('auth.login'))

    # if the above check passes, then we know the user has the right credentials
    login_user(user, remember=remember)

    current_app.logger.info('%s logged in successfully', abbrev)

    # After verify the validity of abbrev and password
    session.permanent = True

    return redirect(url_for('main.index'))


@auth.route('/user_management')
@register_breadcrumb(auth, '.user_management', '')
def user_management():
    # filter all user except for the admin
    User_data = DB_User.query.filter(DB_User.role != "Admin").all()

    return render_template('user_management.html', Users=User_data)


@auth.route('/delete_user/<int:id>')
@login_required
def delete_user(id):
    DB_User.query.filter_by(id=id).delete()
    db.session.commit()
    current_app.logger.warning('%s deleted a user', current_user.abbrev)

    return redirect(url_for('auth.user_management'))


@auth.route('/permissions', methods=('GET', 'POST'))
def permissions():
    # get the id of the query you want to edit
    id = request.args.get('id', None)

    return render_template('permissions.html')


@auth.route('/admin_signup')
def admin_signup():
    return render_template('admin_signup.html')


@auth.route('/admin_signup', methods=('GET', 'POST'))
def admin_signup_post():
    email = request.form.get('email')
    password = request.form.get('password')
    abbreviation = request.form.get('abbreviation')
    role = 'Admin'

    # if this returns a user, then the email already exists in database
    user = DB_User.query.filter_by(role=role).first()

    if user:
        flash('The Admin already exists')
        return redirect(url_for('auth.login'))

    # create new user with the form data. Hash the password so plaintext version isn't saved.
    new_user = DB_User(email=email, abbrev=abbreviation, role=role,
                       password=generate_password_hash(password, method='sha256'))

    # add the new user to the database
    db.session.add(new_user)
    db.session.commit()

    # add the change to the user_management db
    user_management = User_Management(
        email=email, abbrev=abbreviation, role=role, change_by="Initial Signup", date_time=time_stamp(), action="added")

    # add the new user to the database
    db.session.add(user_management)
    db.session.commit()

    return redirect(url_for('main.index'))


@auth.route('/add_user')
@register_breadcrumb(auth, '.user_management.add_user', '')
def add_user():
    # define the job roles
    job_roles = ["MedOps", "Data Entry", "Data Manager"]  # ,"Dengeki Daisy"]
    return render_template('add_user.html', Roles=job_roles)


@auth.route('/add_user', methods=['POST'])
def add_user_post():

    email = request.form.get('email')
    password = request.form.get('password')
    abbreviation = request.form.get('abbreviation')
    role = request.form.get('role')

    # if this returns a user, then the email already exists in database
    user = DB_User.query.filter_by(email=email).first()

    if user:
        flash('Email address already exists')
        return redirect(url_for('auth.add_user'))

    # create new user with the form data. Hash the password so plaintext version isn't saved.
    new_user = DB_User(email=email, abbrev=abbreviation, role=role,
                       password=generate_password_hash(password, method='sha256'))

    # add the new user to the database
    db.session.add(new_user)
    db.session.commit()

    # add the change to the user_management db
    user_management = User_Management(
        email=email, abbrev=abbreviation, role=role, change_by=current_user.abbrev, date_time=time_stamp(), action="added")

    # add the new user to the database
    db.session.add(user_management)
    db.session.commit()

    return redirect(url_for('auth.user_management'))


@auth.route('/logout')
@login_required
def logout():
    logout_user()

    return redirect(url_for('auth.login'))


@auth.route('/profile')
@register_breadcrumb(auth, '.profile', '')
@login_required
def profile():
    return render_template('profile.html', name=current_user.abbrev)


@auth.route('/profile', methods=['POST'])
def change_password():

    oldPassword = request.form.get('oldpassword')
    password1 = request.form.get('password1')
    password2 = request.form.get('password2')

    user = DB_User.query.filter_by(abbrev=current_user.abbrev).first()

    # take the user supplied password, hash it, and compare it to the hashed password in database
    if not check_password_hash(user.password, oldPassword):
        flash('You made a mistake with you old password')
        return redirect(url_for('auth.profile'))

    else:
        if password1 != password2:
            flash('Passwords are not the same')
            return redirect(url_for('auth.profile'))
        else:
            password = generate_password_hash(password1, method='sha256')

            DB_User.query.filter_by(abbrev=current_user.abbrev).update(
                {"password": password})
            db.session.commit()

    return redirect(url_for('main.index'))
