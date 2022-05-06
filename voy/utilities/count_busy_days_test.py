import arrow
from voy.utilities.count_busy_days import count_busy_days, remaining_busy_days_in_week, passed_busy_days_in_week, whole_weeks_in_range


MONDAY    = arrow.get(2022, 5, 2)
TUESDAY   = arrow.get(2022, 5, 3)
WEDNESDAY = arrow.get(2022, 5, 4)
THURSDAY  = arrow.get(2022, 5, 5)
FRIDAY    = arrow.get(2022, 5, 6)
SATURDAY  = arrow.get(2022, 5, 7)
SUNDAY    = arrow.get(2022, 5, 8)

NEXT_MONDAY    = arrow.get(2022, 5,  9)
NEXT_TUESDAY   = arrow.get(2022, 5, 10)
NEXT_WEDNESDAY = arrow.get(2022, 5, 11)
NEXT_THURSDAY  = arrow.get(2022, 5, 12)
NEXT_FRIDAY    = arrow.get(2022, 5, 13)
NEXT_SATURDAY  = arrow.get(2022, 5, 14)
NEXT_SUNDAY    = arrow.get(2022, 5, 15)

OVER_NEXT_MONDAY    = arrow.get(2022, 5, 16)
OVER_NEXT_TUESDAY   = arrow.get(2022, 5, 17)
OVER_NEXT_WEDNESDAY = arrow.get(2022, 5, 18)
OVER_NEXT_THURSDAY  = arrow.get(2022, 5, 19)
OVER_NEXT_FRIDAY    = arrow.get(2022, 5, 20)
OVER_NEXT_SATURDAY  = arrow.get(2022, 5, 21)
OVER_NEXT_SUNDAY    = arrow.get(2022, 5, 22)

class TestCountBusyDays:


    def test_passed_busy_days_in_week(self):
        assert passed_busy_days_in_week(MONDAY)    == 0
        assert passed_busy_days_in_week(TUESDAY)   == 1
        assert passed_busy_days_in_week(WEDNESDAY) == 2
        assert passed_busy_days_in_week(THURSDAY)  == 3
        assert passed_busy_days_in_week(FRIDAY)    == 4
        assert passed_busy_days_in_week(SATURDAY)  == 4
        assert passed_busy_days_in_week(SUNDAY)    == 4


    def test_remaining_busy_days_in_week(self):
        assert remaining_busy_days_in_week(MONDAY)    == 5
        assert remaining_busy_days_in_week(TUESDAY)   == 4
        assert remaining_busy_days_in_week(WEDNESDAY) == 3
        assert remaining_busy_days_in_week(THURSDAY)  == 2
        assert remaining_busy_days_in_week(FRIDAY)    == 1
        assert remaining_busy_days_in_week(SATURDAY)  == 1
        assert remaining_busy_days_in_week(SUNDAY)    == 1


    def test_whole_weeks_in_range(self):

        # Same start and end date. Obviously no week in bwetween.
        assert whole_weeks_in_range(MONDAY, MONDAY) == -1

        # Start Monday, end Sunday. Thats a whole week in theory, but we are
        # testing for whole weeks where the start or end date is not in them.
        assert whole_weeks_in_range(MONDAY, SUNDAY) == -1

        # Start Firday, end Friday in one week, no whole week in between.
        assert whole_weeks_in_range(FRIDAY, NEXT_FRIDAY) == 0

        # Start and end are two weeks apart. There's a whole week in between.
        assert whole_weeks_in_range(FRIDAY, OVER_NEXT_FRIDAY) == 1


    def test_count_busy_days(self):

        # Intra week testing
        assert count_busy_days(MONDAY, MONDAY)    == 0
        assert count_busy_days(MONDAY, TUESDAY)   == 1
        assert count_busy_days(MONDAY, WEDNESDAY) == 2
        assert count_busy_days(MONDAY, THURSDAY)  == 3
        assert count_busy_days(MONDAY, FRIDAY)    == 4
        assert count_busy_days(MONDAY, SATURDAY)  == 4
        assert count_busy_days(MONDAY, SUNDAY)    == 4

        # Inter week testing
        assert count_busy_days(MONDAY, NEXT_MONDAY)    == 5
        assert count_busy_days(MONDAY, NEXT_TUESDAY)   == 6
        assert count_busy_days(MONDAY, NEXT_WEDNESDAY) == 7
        assert count_busy_days(MONDAY, NEXT_THURSDAY)  == 8
        assert count_busy_days(MONDAY, NEXT_FRIDAY)    == 9
        assert count_busy_days(MONDAY, NEXT_SATURDAY)  == 9
        assert count_busy_days(MONDAY, NEXT_SUNDAY)    == 9

        # Test over three weeks
        assert count_busy_days(MONDAY, OVER_NEXT_MONDAY)    == 10
        assert count_busy_days(MONDAY, OVER_NEXT_TUESDAY)   == 11
        assert count_busy_days(MONDAY, OVER_NEXT_WEDNESDAY) == 12
        assert count_busy_days(MONDAY, OVER_NEXT_THURSDAY)  == 13
        assert count_busy_days(MONDAY, OVER_NEXT_FRIDAY)    == 14
        assert count_busy_days(MONDAY, OVER_NEXT_SATURDAY)  == 14
        assert count_busy_days(MONDAY, OVER_NEXT_SUNDAY)    == 14

        # Some more diverse cases that don't start on Monday
        assert count_busy_days(TUESDAY, FRIDAY) == 3
        assert count_busy_days(TUESDAY, NEXT_TUESDAY) == 5
        assert count_busy_days(FRIDAY, NEXT_MONDAY) == 1

        # Special cases where start date is on the weekend
        assert count_busy_days(SATURDAY, SUNDAY) == 0
        assert count_busy_days(SATURDAY, NEXT_MONDAY) == 1

        # Testing edge cases with date and time
        assert count_busy_days(
            arrow.get(2022, 5, 2, 23, 59),
            arrow.get(2022, 5, 3, 0, 1)
        ) == 1
        assert count_busy_days(
            arrow.get(2022, 5, 2, 0, 0),
            arrow.get(2022, 5, 2, 23, 59)
        ) == 0
