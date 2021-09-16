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

# TODO: implement Python Cerberus instead
def is_password_compliant(password: str) -> bool:
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

def is_list_empty(list: list) -> bool:
    """check if the provided list is empty

    Args:
        list (list): [description]

    Returns:
        bool: True or False
    """
    return len(list)==0

def try_password_reset(user_abbrev: str, password_old: str, password_new: str, password_new_repeat: str) -> list:
    """Process the supplied old and new password from the user

    Args:
        password_old (str): [description]
        password1 (str): [description]
        password2 (str): [description]

    Returns:
        redirect: redirect to a page corresponding to the password
    """

    errors = []

    # filter the requested user
    user_query = DB_User.query.filter_by(abbrev=user_abbrev)
    user = user_query.scalar()

    # check if user exists
    if not user:
        errors.append('Your account was not created yet. Please contact the admin for this issue.')
        # guard conditions
        return errors

    # take the user supplied password, hash it, and compare it to the hashed password in database
    if not check_password_hash(user.password, password_old):
        errors.append('You made a mistake with your old password')

    # check if the the new entered password are the same
    if password_new != password_new_repeat:
        errors.append('Passwords are not the same')

    # check whether the new password conforms to the password policy
    if not is_password_compliant(password_new):
        # TODO: Validation errors with Python Cerberus or soemthing alike
        errors.append('Your new password does not meet the requirements.')

    if not is_list_empty(errors):
        return errors

    # Generate new password hash and save it to the user
    password_hash = generate_password_hash(password_new, method='sha256')

    user_query.update({
        "password": password_hash,
        "is_system_passwd": False
    })

    # Persist changes
    db.session.commit()

    return errors


@auth.route('/login', methods=['GET'])
def login():
    return render_template('pages/login.html.j2')


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
        return redirect(url_for('auth.forgot_password_new_password'))

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
def forgot_password():
    return render_template('forgot_passwd.html.j2')


@auth.route('/forgot_passwd', methods=['POST'])
def forgot_password_post():
    abbrev = request.form.get('abbrev')

    # filter the requested user
    user_query = DB_User.query.filter_by(abbrev=abbrev)
    user = user_query.scalar()

    if user:
        # generate a system password with the lenght of 10 and hash it
        password_new = passwd_generator(size=10)

        # ToDo: Remove hard-coded sender
        msg = Message('Hello', sender='no-reply@kaizn.io', recipients=[user.email])
        msg.body = "Your new password is: {password}".format(password=password_new)
        mail.send(msg)

        password_hash = generate_password_hash(password_new, method='sha256')

        # commit the new system password to the database
        user_query.update({
            "password": password_hash,
            "is_system_passwd": True
        })


        db.session.commit()

    return redirect(url_for('auth.forgot_password_new_password'))


@auth.route('/new_password', methods=['GET'])
def forgot_password_new_password():
    return render_template('new_password.html.j2')


@auth.route('/new_password', methods=['POST'])
def forgot_password_new_password_post():
    """[summary]

    Returns:
        [type]: [description]
    """

    errors = try_password_reset(
        user_abbrev=request.form.get('abbreviation'),
        password_old=request.form.get('oldPassword'),
        password_new=request.form.get('password1'),
        password_new_repeat=request.form.get('password2')
    )

    if not is_list_empty(errors):
        return render_template('new_password.html.j2', errors=errors)

    flash('Password reset successful. Please log in with your new password.')

    return redirect(url_for('auth.login'))


@auth.route('/profile', methods=['GET'])
@register_breadcrumb(auth, '.profile', '')
@login_required
def profile():
    return render_template('profile.html.j2', name=current_user.abbrev)


@auth.route('/profile', methods=['POST'])
@login_required
def change_password():
    """The user changes it's password

    Returns:
        redirect: either redirect to the index page or to the page, where the user comes from
    """

    errors = try_password_reset(
        user_abbrev=current_user.abbrev,
        password_old=request.form.get('oldpassword'),
        password_new=request.form.get('password1'),
        password_new_repeat=request.form.get('password2')
    )

    if is_list_empty(errors):
        flash('Password reset successful.')

    return render_template('profile.html.j2', errors=errors)


@auth.route('/logout')
@login_required
def logout():
    """Logout the user

    Returns:
        redirect: redirects to the login page
    """
    logout_user()

    return redirect(url_for('auth.login'))
