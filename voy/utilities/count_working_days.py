from arrow import Arrow


NUMBER_OF_WORKING_DAYS = 5


def passed_working_days_in_week(date: Arrow):

    passed_working_days = date.weekday()

    return passed_working_days if passed_working_days < 4 else 4


def remaining_working_days_in_week(date: Arrow):

    remaning_working_days = NUMBER_OF_WORKING_DAYS - passed_working_days_in_week(date)

    return remaning_working_days if remaning_working_days > 1 else 1


def whole_weeks_in_range(start: Arrow, end: Arrow):

    start_week = start.ceil('week')
    end_week = end.floor('week')

    return ( end_week - start_week ).days / 7


def count_working_days(start: Arrow, end: Arrow):
    return int(
        remaining_working_days_in_week(start) + \
        whole_weeks_in_range(start, end) * 5 + \
        passed_working_days_in_week(end)
    )
