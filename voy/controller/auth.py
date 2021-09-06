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

def assess_password(password: str) -> bool:
    """Check a password against a set of minimal requirements.

    Args:
        password (str): [description]

    Returns:
        bool: Whether the password meets the requirements
    """

    has_length: bool = len(password) >= 12
    has_upper_case: bool = any(_.isupper() for _ in password)
    has_lower_case: bool = any(_.islower() for _ in password)
    has_number: bool = any(_.isdigit() for _ in password)

    return has_length and has_upper_case and has_lower_case and has_number

def process_password(user_abbrev: str, password_old: str, password1: str, password2: str,
                    path_origin: str, path_goal: str):
    """Process the supplied old and new password from the user

    Args:
        password_old (str): [description]
        password1 (str): [description]
        password2 (str): [description]
        path_origin (str): [description]

    Returns:
        redirect: redirect to a page corresponding to the password
    """

    # filter the requested user
    user = DB_User.query.filter_by(abbrev=user_abbrev).first()

    if not user:
        flash('Your account was not created yet. Please contact the admin for this issue.')
        return redirect(url_for(path_origin))

    else:
        # take the user supplied password, hash it, and compare it to the hashed password in database
        if not check_password_hash(user.password, password_old):
            flash('You made a mistake with your old password')
            return redirect(url_for(path_origin))

        else:
            if password1 != password2:
                flash('Passwords are not the same')
                return redirect(url_for(path_origin))
            else:
                # check whether the new password conforms to the password policy
                if assess_password(password1):

                    password = generate_password_hash(password1, method='sha256')

                    if path_origin == "auth.new_password":
                        # set the new password and activate the account
                        DB_User.query.filter_by(abbrev=user_abbrev).update(
                            {"password": password, "is_system_passwd": False})

                    else:
                        DB_User.query.filter_by(abbrev=user_abbrev).update(
                            {"password": password})
                    db.session.commit()

                else:
                    flash('Password does not meet the requirements!')
                    return redirect(url_for(path_origin))

            return redirect(url_for(path_goal))

@auth.route('/login', methods=['GET'])
def login():
    return render_template('login.html')


@auth.route('/login', methods=['POST'])
def login_post():
    abbrev = request.form.get('abbreviation')
    password = request.form.get('password')

    user = DB_User.query.filter_by(abbrev=abbrev).first()

    # Case 1: check whether any user or this username exits at all
    if user is None:
        check_existing_user = DB_User.query.all()
        if len(check_existing_user) == 0:
            return redirect(url_for('auth.admin_signup'))

        else:
            flash('Please check your login details and try again.')
            return redirect(url_for('auth.login'))

    # Case 2: check if the user got inactivated
    if not user.is_active:
        flash('Your account got inactivated. Please contact your Admin for this issue.')
        return redirect(url_for('auth.login'))

    # Case 3: the user is active but his password is a system password
    if user.is_active and user.is_system_passwd:
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


@auth.route('/admin_signup', methods=['GET'])
def admin_signup():
    return render_template('admin_signup.html')


@auth.route('/admin_signup', methods=['POST'])
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
    new_user = DB_User(
        email=email,
        abbrev=abbreviation,
        role=role,
        password=generate_password_hash(password, method='sha256'),
        is_system_passwd=False,
        is_active=True
    )

    # add the new user to the database
    db.session.add(new_user)
    db.session.commit()

    # add the change to the user_management db
    user_management = User_Management(
        email=email,
        abbrev=abbreviation,
        role=role,
        change_by="Initial Signup",
        date_time=time_stamp(),
        action="added"
    )

    audit_data = user_management.__dict__

    # NOTE: semi good solution for the extra data from sqlalchemy
    audit_data.pop('date_time', None)

    to_user_file.info(audit_data['change_by'], extra=audit_data)

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
        password_new = passwd_generator(size=10)

        # ToDo: Remove hard-coded sender
        msg = Message('Hello', sender='no-reply@kaizn.io', recipients=[user.email])
        msg.body = "Your new password is: {password}".format(password=password_new)
        mail.send(msg)

        password = generate_password_hash(password_new, method='sha256')

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
    password_old = request.form.get('oldPassword')
    password1 = request.form.get('password1')
    password2 = request.form.get('password2')
    abbrev = request.form.get('abbreviation')

    return process_password(user_abbrev=abbrev, password_old=password_old, password1=password1, password2=password2,
                    path_origin="auth.new_password", path_goal='auth.login')


@auth.route('/profile', methods=['GET'])
@register_breadcrumb(auth, '.profile', '')
@login_required
def profile():
    return render_template('profile.html', name=current_user.abbrev)


@auth.route('/profile', methods=['POST'])
@login_required
def change_password():
    """The user changes it's password

    Returns:
        redirect: either redirect to the index page or to the page, where the user comes from
    """

    password_old = request.form.get('oldpassword')
    password1 = request.form.get('password1')
    password2 = request.form.get('password2')
    user_abbrev = current_user.abbrev

    return process_password(user_abbrev=user_abbrev, password_old=password_old, password1=password1, password2=password2,
                    path_origin="auth.profile", path_goal='qc_database.index')



@auth.route('/logout')
@login_required
def logout():
    """Logout the user

    Returns:
        redirect: redirects to the login page
    """
    logout_user()

    return redirect(url_for('auth.login'))
