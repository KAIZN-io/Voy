import logging

from flask import Blueprint, render_template, redirect, url_for, request, flash
from flask_breadcrumbs import register_breadcrumb, default_breadcrumb_root
from flask_login import login_required, current_user
from werkzeug.security import generate_password_hash

from voy.controller.Compliance_Computerized_Systems_EMA import time_stamp
from voy.model import DB_User, User_Management
from voy.model import db

# Get loggers
to_user_file = logging.getLogger('to_user_file')

# Create the Blueprint
users_module_blueprint = Blueprint('users_module', __name__)
default_breadcrumb_root(users_module_blueprint, '.')


@users_module_blueprint.route('/user_management')
@login_required
@register_breadcrumb(users_module_blueprint, '.user_management', '')
def user_management():
    # filter all user except for the admin
    User_data = DB_User.query.filter(DB_User.role != "Admin").all()

    return render_template('user_management.html', Users=User_data)


@users_module_blueprint.route('/inactivate/<int:id>')
@login_required
def inactivate(id):
    # change the active state to "False"
    DB_User.query.filter_by(id=id).update({"is_active": False})
    db.session.commit()

    return redirect(url_for('users_module.user_management'))


@users_module_blueprint.route('/add_user')
@login_required
@register_breadcrumb(users_module_blueprint, '.user_management.add_user', '')
def add_user():
    # define the job roles
    job_roles = ["MedOps", "Data Entry", "Data Manager"]
    return render_template('add_user.html', Roles=job_roles)


@users_module_blueprint.route('/add_user', methods=['POST'])
@login_required
def add_user_post():
    email = request.form.get('email')
    password = request.form.get('password')
    abbreviation = request.form.get('abbreviation')
    role = request.form.get('role')

    # if this returns a user, then the email already exists in database
    user = DB_User.query.filter_by(email=email).first()

    if user:
        flash('Email address already exists')
        return redirect(url_for('users_module.add_user'))

    # create new user with the form data. Hash the password so plaintext version isn't saved.
    new_user = DB_User(
        email=email,
        abbrev=abbreviation,
        role=role,
        password=generate_password_hash(password, method='sha256'),
        is_system_passwd=True,
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
        change_by=current_user.abbrev,
        date_time=time_stamp(),
        action="added"
    )

    audit_data = user_management.__dict__

    # NOTE: semi good solution for the extra data from sqlalchemy
    audit_data.pop('date_time', None)

    to_user_file.info(audit_data['change_by'], extra=audit_data)

    # add the new user to the database
    # db.session.add(user_management)
    # db.session.commit()

    return redirect(url_for('users_module.user_management'))
