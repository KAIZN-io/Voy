import random
import string

import logging

from voy.model import QC_Audit

# Get loggers
to_qc_file = logging.getLogger('to_qc_file')


def add_to_audit_trail(user, todo, id, category, old_value, new_value):
    # user = current_user.abbreviation

    # the data in the model in form of a dict structure
    audit_data = QC_Audit(
        id=id,
        category=category,
        user=user,
        old_value=old_value,
        new_value=new_value
    ).__dict__

    # NOTE: semi good solution for the extra data from sql alchemy
    audit_data.pop('_sa_instance_state', None)

    # !NOTE: extra logging message -> create a dict an pass it into the info() commit

    if todo == "edit":
        audit_data.pop('date_time', None)
        to_qc_file.info(audit_data['new_value'], extra=audit_data)

    return "added to audit trail"


def generate_password(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))
