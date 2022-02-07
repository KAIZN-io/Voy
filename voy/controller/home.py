from flask import Blueprint, render_template
from flask_login import login_required


# Create the Blueprint
home_blueprint = Blueprint('home_controller', __name__)


@home_blueprint.route('/', methods=['GET'])
@login_required
def index():
    return render_template('controller/home/index.html.j2')
