from arrow import Arrow


NUMBER_OF_BUSY_DAYS = 5


def passed_busy_days_in_week(date: Arrow):

    passed_busy_days = date.weekday()

    return passed_busy_days if passed_busy_days < 4 else 4


def remaining_busy_days_in_week(date: Arrow):

    remaning_busy_days = NUMBER_OF_BUSY_DAYS - passed_busy_days_in_week(date)

    return remaning_busy_days if remaning_busy_days > 1 else 1


def whole_weeks_in_range(start: Arrow, end: Arrow):

    start_week = start.ceil('week')
    end_week = end.floor('week')

    return ( end_week - start_week ).days / 7


def count_busy_days(start: Arrow, end: Arrow):
    return remaining_busy_days_in_week(start) + \
        whole_weeks_in_range(start, end) * 5 + \
        passed_busy_days_in_week(end)
