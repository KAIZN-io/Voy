from flask import Blueprint, render_template, redirect, url_for, request, flash, current_app, session
from flask_login import login_user, logout_user, login_required, current_user
from flask_breadcrumbs import Breadcrumbs, register_breadcrumb, default_breadcrumb_root

from werkzeug.security import generate_password_hash, check_password_hash


from server import db, to_qc_file, to_console, to_user_file
from server.model.models import DB_User, User_Management
from server.controller.compliance import audit_trail, time_stamp, passwd_generator


users_module = Blueprint('users_module', __name__)
# set auth blueprint as a root
default_breadcrumb_root(users_module, '.')



@users_module.route('/user_management')
@login_required
@register_breadcrumb(users_module, '.user_management', '')
def user_management():
    # filter all user except for the admin
    User_data = DB_User.query.filter(DB_User.role != "Admin").all()

    return render_template('user_management.html', Users=User_data)


@users_module.route('/delete_user/<int:id>')
@login_required
def delete_user(id):
    # query the data from the user
    user_management = DB_User.query.filter_by(id=id).one().__dict__

    # delete the user from the db
    DB_User.query.filter_by(id=id).delete()
    db.session.commit()

    # document the deletion to the log file
    # delete unimportend data before that
    user_management.pop('date_time', None)
    user_management.pop('system_passwd', None)
    user_management.pop('password', None)
    user_management.pop('active', None)
    user_management.pop('id', None)
    user_management['change_by'] = current_user.abbrev
    user_management['action'] = 'deleted'

    to_user_file.info(user_management['change_by'], extra=user_management)

    return redirect(url_for('users_module.user_management'))


@users_module.route('/add_user')
@login_required
@register_breadcrumb(users_module, '.user_management.add_user', '')
def add_user():
    # define the job roles
    job_roles = ["MedOps", "Data Entry", "Data Manager"]  # ,"Dengeki Daisy"]
    return render_template('add_user.html', Roles=job_roles)


@users_module.route('/add_user', methods=['POST'])
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
    new_user = DB_User(email=email, abbrev=abbreviation, role=role,
                       system_passwd=generate_password_hash(password, method='sha256'), active=1)

    # add the new user to the database
    db.session.add(new_user)
    db.session.commit()

    # add the change to the user_management db
    user_management = User_Management(
        email=email, abbrev=abbreviation, role=role, change_by=current_user.abbrev, date_time=time_stamp(), action="added")

    audit_data = user_management.__dict__

    # NOTE: semi good solution for the extra data from sqlalchemy
    audit_data.pop('date_time', None)

    to_user_file.info(audit_data['change_by'], extra=audit_data)

    # add the new user to the database
    # db.session.add(user_management)
    # db.session.commit()

    return redirect(url_for('users_module.user_management'))

