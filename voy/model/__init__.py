from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
migrate = Migrate()

from voy.model.user import User
from voy.model.study import Study
from voy.model.ticket import Ticket
from voy.model.ticket_tag import TicketTag
from voy.model.ticket_tag_color import TicketTagColor
from voy.model.ticket_comment import TicketComment
