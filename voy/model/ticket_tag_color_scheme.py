from flask_admin.contrib.sqla import ModelView

from voy.model import db
from voy.model.mixins import TimeStampMixin, UuidPrimaryKeyMixin


class TicketTagColorScheme(UuidPrimaryKeyMixin, TimeStampMixin, db.Model):
    """Modelling color to be used for coloring TicketTags."""

    __tablename__ = 'ticket_tag_color_scheme'

    name = db.Column(db.String(30), unique=True)
    text_color = db.Column(db.String(9))
    background_color = db.Column(db.String(9))

    tags = db.relationship('TicketTag', back_populates='color_scheme')

    def __repr__(self):
        return '<Color: %s>' % self.name


class TicketTagColorSchemeView(ModelView):
    form_excluded_columns = ('tags')
