from flask_admin.contrib.sqla import ModelView
from flask_login import current_user


class ProtectedModelView(ModelView):

    def is_accessible(self):
        return current_user.is_authenticated

    def inaccessible_callback(self, name, **kwargs):
        return redirect(url_for('login', next=request.url))
