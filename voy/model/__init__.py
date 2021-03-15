from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
migrate = Migrate()

from voy.model.db_user import DB_User
from voy.model.qc_audit import QC_Audit
from voy.model.qc_check import QC_Check
from voy.model.qc_requery import QC_Requery
from voy.model.user_management import User_Management
