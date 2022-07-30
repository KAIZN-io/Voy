from flask import redirect, url_for, request
from flask_admin.contrib.sqla import ModelView
from flask_login import current_user

from voy.constants import ROLE_ADMIN


class ProtectedModelView(ModelView):

    def is_accessible(self):
        return current_user.is_authenticated and \
            current_user.role == ROLE_ADMIN

    def inaccessible_callback(self, name, **kwargs):
        return redirect(url_for('authentication_controller.login'))
