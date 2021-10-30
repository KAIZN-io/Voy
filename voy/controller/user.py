from flask import Blueprint, render_template, redirect, url_for, request, flash
from flask_breadcrumbs import register_breadcrumb, default_breadcrumb_root
from flask_login import login_required, current_user
from flask_mail import Message
from werkzeug.security import generate_password_hash

from voy.controller.Compliance_Computerized_Systems_EMA import passwd_generator
from voy.mail import mail
from voy.model import User, db
from voy.services.user import try_password_reset
from voy.utilities import is_list_empty


# Create the Blueprint
user_blueprint = Blueprint('user_controller', __name__)
default_breadcrumb_root(user_blueprint, '.')


@user_blueprint.route('/profile', methods=['GET'])
@register_breadcrumb(user_blueprint, '.profile', '')
@login_required
def profile():
    return render_template('user/profile.html.j2', user_abbreviation=current_user.abbrev)


@user_blueprint.route('/profile', methods=['POST'])
@login_required
def profile_post():
    errors = try_password_reset(
        user_abbreviation=current_user.abbrev,
        password_old=request.form.get('password_old'),
        password_new=request.form.get('password_new'),
        password_new_repetition=request.form.get('password_new_repetition')
    )

    if is_list_empty(errors):
        flash('Password reset successful.')

    return render_template('user/profile.html.j2', errors=errors)


@user_blueprint.route('/request-password-reset', methods=['GET'])
def request_password_reset():
    return render_template('user/request-password-reset.html.j2')


# TODO: instead of generating a new password and sending it via email, use hmac.
@user_blueprint.route('/request-password-reset', methods=['POST'])
def request_password_reset_post():
    user_abbreviation = request.form.get('user_abbreviation')

    # filter the requested user
    user_query = User.query.filter_by(abbrev=user_abbreviation)
    user = user_query.scalar()

    if user:
        # Generate a system password with the length of 10 and hash it
        password_new = passwd_generator(size=10)

        # TODO: Remove hard-coded sender
        msg = Message('Hello', sender='no-reply@kaizn.io', recipients=[user.email])
        msg.body = "Your new password is: {password}".format(password=password_new)
        mail.send(msg)

        password_new_hash = generate_password_hash(password_new, method='sha256')

        # commit the new system password to the database
        user_query.update({
            "password": password_new_hash,
            "is_system_passwd": True
        })

        db.session.commit()

    # In any case, flash a success message. This way one can not find valid user abbreviations by brute force.
    flash('Success! An email with a new password is on it\'s way to you.')

    return render_template('user/request-password-reset.html.j2')


@user_blueprint.route('/reset-password', methods=['GET'])
def reset_password():
    return render_template('user/reset-password.html.j2')


@user_blueprint.route('/reset-password', methods=['POST'])
def reset_password_post():
    errors = try_password_reset(
        user_abbreviation=request.form.get('user_abbreviation'),
        password_old=request.form.get('password_old'),
        password_new=request.form.get('password_new'),
        password_new_repetition=request.form.get('password_new_repetition')
    )

    if not is_list_empty(errors):
        return render_template('user/reset-password.html.j2', errors=errors)

    flash('Password reset successful. Please log in with your new password.')

    return redirect(url_for('authentication_controller.login'))
