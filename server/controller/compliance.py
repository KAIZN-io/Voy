# write the db changes to the audittrail file
import os
import csv
import arrow
import random
import string
from server.model.models import QC_Audit
from server import to_qc_file

# the time stamp in the requeried format


def time_stamp():
    return arrow.utcnow().format('DD-MMM-YYYY HH:mm:ss')


def audit_trail(user, todo, id, category, old_value, new_value):

    # the audit trail file
    path_to_file = os.getcwd()+'/server/.log_files/data_log_qc.csv'
    # '../../templates'
    # metadata
    # user = current_user.abbrev

    # the data in the model in form of a dict structure
    audit_data = QC_Audit(id=id, category=category, date_time=time_stamp(),
                          user=user, old_value=old_value, new_value=new_value).__dict__

    # NOTE: semi good solution for the extra data from sql alchemy
    audit_data.pop('_sa_instance_state', None)

    # !NOTE: extra logging message -> create a dict an pass it into the info() commit

    to_qc_file.info(audit_data['new_value'], extra=audit_data)

    if todo == "edit":
        # write to file
        with open(path_to_file, 'a', newline='') as csvfile:
            # csv file header
            fieldnames = ['id', 'category', 'date_time',
                          'user', 'old_value', 'new_value']

            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

            # initiate the file
            if os.path.getsize(path_to_file) == 0:
                writer.writeheader()

            writer.writerow(audit_data)

    return "added to audit trail"

# the password generator


def passwd_generator(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))
