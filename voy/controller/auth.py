import logging
from flask import Blueprint, render_template, redirect, url_for, request, flash, session
from flask_breadcrumbs import register_breadcrumb, default_breadcrumb_root
from flask_login import login_user, logout_user, login_required, current_user
from flask_mail import Message
from werkzeug.security import generate_password_hash, check_password_hash

from voy.mail import mail
from voy.model import db
from voy.controller.Compliance_Computerized_Systems_EMA import audit_trail, time_stamp, passwd_generator
from voy.model import DB_User, User_Management

# Get loggers
to_console = logging.getLogger('to_console')
to_user_file = logging.getLogger('to_user_file')

auth = Blueprint('auth', __name__)
# set auth blueprint as a root
default_breadcrumb_root(auth, '.')


@auth.route('/login', methods=['GET'])
def login():
    return render_template('login.html')


@auth.route('/login', methods=['POST'])
def login_post():
    abbrev = request.form.get('abbreviation')
    password = request.form.get('password')

    user = DB_User.query.filter_by(abbrev=abbrev).first()

    # Case 1: check whether any user or this username exits at all
    if not user:
        flash('Please check your login details and try again.')
        return redirect(url_for('auth.login'))

    # Case 2: check if the user got inactivated
    if not user.is_active:
        flash('Your account got inactivated. Please contact your Admin for this issue.')
        return redirect(url_for('auth.login'))

    # Case 3: the user is active but his password is a system password
    if user.is_system_passwd:
        return redirect(url_for('auth.new_password'))

    # Case 4: take the user supplied password, hash it, and compare it to the hashed password in database
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


@auth.route('/forgot_passwd', methods=['GET'])
def forgot_passwd():
    return render_template('forgot_passwd.html')


@auth.route('/forgot_passwd', methods=['POST'])
def forgot_passwd_post():
    abbrev = request.form.get('abbrev')

    # filter the requested user
    user = DB_User.query.filter_by(abbrev=abbrev).first()

    if user:
        # generate a system password with the lenght of 10 and hash it
        new_passwd = passwd_generator(size=10)

        # ToDo: Remove hard-coded sender
        msg = Message('Hello', sender='no-reply@kaizn.io', recipients=[user.email])
        msg.body = "Your new password is: {password}".format(password=new_passwd)
        mail.send(msg)

        password = generate_password_hash(new_passwd, method='sha256')

        # commit the new system password to the database
        DB_User.query.filter_by(abbrev=abbrev).update(
            {"password": password, "is_system_passwd": True})
        db.session.commit()

    return redirect(url_for('auth.new_password'))


@auth.route('/new_password', methods=['GET'])
def new_password():
    return render_template('new_password.html')


@auth.route('/new_password', methods=['POST'])
def new_password_post():
    oldPassword = request.form.get('oldPassword')
    password1 = request.form.get('password1')
    password2 = request.form.get('password2')
    abbrev = request.form.get('abbreviation')

    # filter the requested user
    user = DB_User.query.filter_by(abbrev=abbrev).first()
    if user:
        # take the user supplied password, hash it, and compare it to the hashed password in database
        if not check_password_hash(user.password, oldPassword):
            flash('You made a mistake with your old password')
            return redirect(url_for('auth.new_password'))

        else:
            if password1 != password2:
                flash('Passwords are not the same')
                return redirect(url_for('auth.new_password'))
            else:
                password = generate_password_hash(password1, method='sha256')

                # set the new password and activate the account
                DB_User.query.filter_by(abbrev=abbrev).update(
                    {"password": password, "is_system_passwd": False})
                db.session.commit()

        return redirect(url_for('auth.login'))

    else:
        flash('Your account was not created yet. Please contact the admin for this issue.')
        return redirect(url_for('auth.new_password'))

@auth.route('/profile', methods=['GET'])
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
