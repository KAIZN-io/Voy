import logging

from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask_breadcrumbs import register_breadcrumb, default_breadcrumb_root
from flask_login import login_required

from voy.constants import FLASH_TYPE_SUCCESS
from voy.model import Study
from voy.model import db


# Get loggers
to_console = logging.getLogger('to_console')


# Create the Blueprint
study_blueprint = Blueprint('study_controller', __name__)
default_breadcrumb_root(study_blueprint, '.')


@study_blueprint.route('/studies/new', methods=['GET'])
@register_breadcrumb(study_blueprint, '.new', '')
@login_required
def new():
    return render_template('study/new.html.j2')


# TODO: implement the tag system
@study_blueprint.route('/studies/new', methods=['POST'])
@register_breadcrumb(study_blueprint, '.new', '')
@login_required
def new_post():
    """save the new study id to the database
    """

    # TODO: Form validation
    internal_id = int(request.form.get('internal_id'))

    study = Study(
        internal_id=internal_id,
        is_active=True)

    db.session.add(study)
    db.session.commit()

    flash('A new study was created.', FLASH_TYPE_SUCCESS)

    return redirect(url_for('study_controller.new'))
