from flask import Blueprint, render_template, redirect, url_for, request, flash, session
from flask_breadcrumbs import default_breadcrumb_root
from flask_login import login_user, login_required, logout_user, current_user
from werkzeug.security import check_password_hash

from voy.constants import FLASH_TYPE_DANGER, FLASH_TYPE_WARNING, FLASH_TYPE_SUCCESS
from voy.model import User


# Create the Blueprint
authentication_blueprint = Blueprint('authentication_controller', __name__)
default_breadcrumb_root(authentication_blueprint, '.')


@authentication_blueprint.route('/login', methods=['GET'])
def login():
    # If the user is already logged in, we don't need any of this.
    if current_user.is_authenticated:
        return redirect(url_for('dashboard_controller.index'))

    return render_template('controller/authentication/login.html.j2')


@authentication_blueprint.route('/login', methods=['POST'])
def login_post():
    user_abbreviation = request.form.get('user_abbreviation')
    user_password = request.form.get('user_password')

    user = User.query.filter_by(abbreviation=user_abbreviation).scalar()

    # Check whether any user or this username exits at all
    if not user:
        flash('Please check your login details and try again.', FLASH_TYPE_DANGER)
        return redirect(url_for('authentication_controller.login'))

    # Validate the password
    # We need to do this here, as we do not want to display any other error messages that might expose user information
    # when the users authentication is not valid.
    if not check_password_hash(user.password, user_password):
        flash('Please check your login details and try again.', FLASH_TYPE_DANGER)
        return redirect(url_for('authentication_controller.login'))

    # Check if the user got inactivated
    if not user.is_active:
        flash('Your account got inactivated. Please contact your Admin for this issue.', FLASH_TYPE_WARNING)
        return redirect(url_for('authentication_controller.login'))

    # Case 3: the user is active but his user_password is a system user_password
    if user.is_password_reset_required:
        return redirect(url_for('profile_controller.reset_password'))

    # If all the checks pass, then we can login the user.
    login_user(user)

    session.permanent = True

    return redirect(url_for('home_controller.index'))


@authentication_blueprint.route('/logout')
@login_required
def logout():
    """Logout the user

    Returns:
        redirect: redirects to the login page
    """
    logout_user()

    flash('You logged out successfully. See you!', FLASH_TYPE_SUCCESS)

    return redirect(url_for('authentication_controller.login'))
