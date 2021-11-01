from voy.constants import ROLE_MEDOPS
from voy.model import Ticket, User


def get_tickets_for_user(user: User, as_dict: bool = False) -> list:
    """gets a list of queries for the user filtered depending on their role.

    Args:
        user (User): The user to get the queries for.

    Returns:
        [type]: A list of queries for the user.
    """

    query = Ticket.query \
        .order_by(Ticket.created_at)

    if user.role == ROLE_MEDOPS:
        query.filter_by(
            assignee=user,
            is_corrected=False,
            is_closed=False)

    # TODO: why can I see closed Queries ?
    else:
        query.filter_by(
            is_closed=False)

    tickets = Ticket.query.all()

    if as_dict:
        return [ticket.to_export_dict() for ticket in tickets]

    return tickets
