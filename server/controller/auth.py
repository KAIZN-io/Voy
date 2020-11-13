from flask import Blueprint, render_template, redirect, url_for, request, flash, current_app, session
from flask_login import login_user, logout_user, login_required, current_user
from flask_breadcrumbs import Breadcrumbs, register_breadcrumb, default_breadcrumb_root

from werkzeug.security import generate_password_hash, check_password_hash


from server import db, to_qc_file, to_console, to_user_file
from server.model import DB_User, User_Management
from server.controller.Compliance_Computerized_Systems_EMA import audit_trail, time_stamp, passwd_generator

auth = Blueprint('auth', __name__)
# set auth blueprint as a root
default_breadcrumb_root(auth, '.')


@auth.route('/login')
def login():
    return render_template('login.html')


@auth.route('/login', methods=('GET', 'POST'))
def login_post():

    abbrev = request.form.get('abbreviation')
    password = request.form.get('password')

    user = DB_User.query.filter_by(abbrev=abbrev).first()

    # Case 1: check whether any user or this username exits at all
    if user == None:
        check_existing_user = DB_User.query.all()
        if len(check_existing_user) == 0:
            return redirect(url_for('auth.admin_signup'))

        else:
            flash('Please check your login details and try again.')
            return redirect(url_for('auth.login'))

    # Case 2: check if the user is already ativated
    if user.password == None or user.active == 1:
        flash('Please activate your account.')
        return redirect(url_for('auth.activate'))

    # Case 3: take the user supplied password, hash it, and compare it to the hashed password in database
    if not check_password_hash(user.password, password):
        flash('Please check your login details and try again.')
        # if user doesn't exist or password is wrong, reload the page
        return redirect(url_for('auth.login'))

    # if the above cases check passes, then we know the user has the right credentials
    login_user(user)

    to_console.info('logged in successfully')

    # After verify the validity of abbrev and password
    session.permanent = True

    return redirect(url_for('qc_database.index'))


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

    audit_data = user_management.__dict__

    # NOTE: semi good solution for the extra data from sqlalchemy
    audit_data.pop('date_time', None)

    to_user_file.info(audit_data['change_by'], extra=audit_data)

    return redirect(url_for('qc_database.index'))


@auth.route('/forgot_passwd')
def forgot_passwd():
    return render_template('forgot_passwd.html')


@auth.route('/forgot_passwd', methods=('GET', 'POST'))
def forgot_passwd_post():
    abbrev = request.form.get('abbrev')

    # filter the requested user
    user = DB_User.query.filter_by(abbrev=abbrev).first()

    if user:
        # generate a system password with the lenght of 10 and hash it
        new_passwd = passwd_generator(size=10)

        # TODO: send the new_passwd over mail to the user
        print(new_passwd)
        system_passwd = generate_password_hash(new_passwd, method='sha256')

        # commit the new system password to the database
        DB_User.query.filter_by(abbrev=abbrev).update(
            {"system_passwd": system_passwd, "active": 1})
        db.session.commit()

    return redirect(url_for('auth.activate'))


@auth.route('/activate')
def activate():
    return render_template('activate.html')


@auth.route('/activate', methods=('GET', 'POST'))
def activate_post():

    oldPassword = request.form.get('oldPassword')
    password1 = request.form.get('password1')
    password2 = request.form.get('password2')
    abbrev = request.form.get('abbreviation')

    # filter the requested user
    user = DB_User.query.filter_by(abbrev=abbrev).first()

    # take the user supplied password, hash it, and compare it to the hashed password in database
    if not check_password_hash(user.system_passwd, oldPassword):
        flash('You made a mistake with you old password')
        return redirect(url_for('auth.activate'))

    else:
        if password1 != password2:
            flash('Passwords are not the same')
            return redirect(url_for('auth.activate'))
        else:
            password = generate_password_hash(password1, method='sha256')

            # set the new password and activate the account
            DB_User.query.filter_by(abbrev=abbrev).update(
                {"password": password, "active": 0, "system_passwd": None})
            db.session.commit()

    return redirect(url_for('auth.login'))


@auth.route('/profile')
@register_breadcrumb(auth, '.profile', '')
@login_required
def profile():
    return render_template('profile.html', name=current_user.abbrev)


@auth.route('/profile', methods=['POST'])
@login_required
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

    return redirect(url_for('qc_database.index'))


@auth.route('/logout')
@login_required
def logout():
    logout_user()

    return redirect(url_for('auth.login'))

