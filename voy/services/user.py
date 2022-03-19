from werkzeug.security import generate_password_hash, check_password_hash

from voy.model import User, db
from voy.utilities import is_list_empty


# TODO: Shouldn't this be in the compliance package?
# TODO: Validation with Python Cerberus
def is_password_compliant(password: str) -> bool:
    """Check a password against a set of minimal requirements.

    Args:
        password (str): The password to validate.

    Returns:
        bool: Whether the password meets the requirements
    """

    has_length: bool = len(password) >= 12
    has_upper_case: bool = any(_.isupper() for _ in password)
    has_lower_case: bool = any(_.islower() for _ in password)
    has_number: bool = any(_.isdigit() for _ in password)

    return has_length and has_upper_case and has_lower_case and has_number


def try_password_reset(user_abbreviation: str, password_old: str, password_new: str, password_new_repetition: str) -> list:
    errors = []

    # Filter the requested user
    user_query = User.query.filter_by(abbreviation=user_abbreviation)
    user = user_query.scalar()

    # Check if user exists
    if not user:
        errors.append('Your account was not created yet. Please contact the admin for this issue.')
        # Return early, as we do not need to check any further.
        return errors

    # Take the user supplied password, hash it, and compare it to the hashed password in database
    if not check_password_hash(user.password, password_old):
        errors.append('You made a mistake with your old password')

    # Check if the the new entered password are the same
    # TODO: Implement secure password comparison that can not be timed.
    if password_new != password_new_repetition:
        errors.append('Passwords are not the same')

    # Check whether the new password conforms to the password policy
    if not is_password_compliant(password_new):
        # TODO: Validation errors with Python Cerberus or soemthing alike
        errors.append('Your new password does not meet the requirements.')

    if not is_list_empty(errors):
        return errors

    # Generate new password hash and save it to the user
    password_hash = generate_password_hash(password_new, method='sha256')

    user_query.update({
        "password": password_hash,
        "is_password_reset_required": False
    })

    # Persist changes
    db.session.commit()

    return errors
