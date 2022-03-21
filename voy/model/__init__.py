from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
migrate = Migrate()

from voy.model.user import User, UserView
from voy.model.study import Study, StudyView
from voy.model.ticket import Ticket
from voy.model.ticket_tag import TicketTag, TicketTagView
from voy.model.ticket_tag_color_scheme import TicketTagColorScheme, TicketTagColorSchemeView
from voy.model.ticket_comment import TicketComment
