import logging

from flask import Blueprint, render_template, redirect, url_for, request, flash
from flask_breadcrumbs import register_breadcrumb, default_breadcrumb_root
from flask_login import login_required, current_user
from werkzeug.security import generate_password_hash

from voy.model import db
from voy.model import User, User_Management
from voy.constants import ROLE_ADMIN, ROLE_MEDOPS, ROLE_DATA_MANAGER, ROLE_DATA_ENTRY, FLASH_TYPE_DANGER

# Get loggers
to_user_file = logging.getLogger('to_user_file')


# Create the Blueprint
user_blueprint = Blueprint('user_controller', __name__)
default_breadcrumb_root(user_blueprint, '.')


@user_blueprint.route('/users', methods=['GET'])
@login_required
@register_breadcrumb(user_blueprint, '.index', '')
def index():

    # filter all user except for the admin
    user_list = User.query \
        .filter(User.role != ROLE_ADMIN) \
        .order_by(User.abbreviation.desc()) \
        .all()

    return render_template('controller/user/index.html.j2', user_list=user_list)


# TODO: Make this a POST request; With a GET request it is too easy to just close tickets by their id. Also in terms of
# HTTP lingo, a GET request is only meant to get something. A POST is to modify.
@user_blueprint.route('/users/<string:user_uuid>/deactivate', methods=['GET'])
@login_required
def deactivate(user_uuid: str):
    User.query.get(user_uuid).is_active = False

    db.session.commit()

    return redirect(url_for('user_controller.index'))


# TODO: Make this a POST request; With a GET request it is too easy to just close tickets by their id. Also in terms of
# HTTP lingo, a GET request is only meant to get something. A POST is to modify.
@user_blueprint.route('/users/<string:user_uuid>/activate', methods=['GET'])
@login_required
def activate(user_uuid: str):
    User.query.get(user_uuid).is_active = True

    db.session.commit()

    return redirect(url_for('user_controller.index'))


@user_blueprint.route('/users/new', methods=['GET'])
@login_required
@register_breadcrumb(user_blueprint, '.new', '')
def new():
    # define the job roles
    roles = [ROLE_MEDOPS, ROLE_DATA_MANAGER, ROLE_DATA_ENTRY]
    return render_template('controller/user/new.html.j2', Roles=roles)


@user_blueprint.route('/users/new', methods=['POST'])
@login_required
def new_post():

    email = request.form.get('email')
    password = request.form.get('password')
    abbreviation = request.form.get('abbreviation')
    role = request.form.get('role')

    # if this returns a user, then the email already exists in database
    user = User.query.filter_by(email=email).scalar()

    if user:
        flash('A User with that email address already exists', FLASH_TYPE_DANGER)
        return redirect(url_for('user_controller.new'))

    # create new user with the form data. Hash the password so plaintext version isn't saved.
    new_user = User(
        email=email,
        abbreviation=abbreviation,
        role=role,
        password=generate_password_hash(password, method='sha256'),
        is_system_password=True,
        is_active=True
    )

    # add the new user to the database
    db.session.add(new_user)
    db.session.commit()

    # add the change to the user_management db
    user_management = User_Management(
        email=email,
        abbreviation=abbreviation,
        role=role,
        change_by=current_user.abbreviation,
        action="added"
    )

    audit_data = user_management.__dict__

    # NOTE: semi good solution for the extra data from sqlalchemy
    audit_data.pop('created_at', None)

    to_user_file.info(audit_data['change_by'], extra=audit_data)

    return redirect(url_for('user_controller.index'))
