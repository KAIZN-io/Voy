from flask import redirect, url_for, request
from flask_admin import AdminIndexView
from flask_login import current_user


class ProtectedIndexView(AdminIndexView):

    def is_accessible(self):
        return current_user.is_authenticated

    def inaccessible_callback(self, name, **kwargs):
        return redirect(url_for('authentication_controller.login'))
