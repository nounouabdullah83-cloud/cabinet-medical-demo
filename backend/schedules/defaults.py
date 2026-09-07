import datetime

from .models import Schedule


# Default weekly availability for the doctor (Monday–Sunday).
# Friday is closed by default; the rest are open 08:00–17:00.
DEFAULT_SCHEDULE = [
    {'day': 'monday', 'opening_time': datetime.time(8, 0), 'closing_time': datetime.time(17, 0), 'is_open': True},
    {'day': 'tuesday', 'opening_time': datetime.time(8, 0), 'closing_time': datetime.time(17, 0), 'is_open': True},
    {'day': 'wednesday', 'opening_time': datetime.time(8, 0), 'closing_time': datetime.time(17, 0), 'is_open': True},
    {'day': 'thursday', 'opening_time': datetime.time(8, 0), 'closing_time': datetime.time(17, 0), 'is_open': True},
    {'day': 'friday', 'opening_time': None, 'closing_time': None, 'is_open': False},
    {'day': 'saturday', 'opening_time': datetime.time(8, 0), 'closing_time': datetime.time(17, 0), 'is_open': True},
    {'day': 'sunday', 'opening_time': datetime.time(8, 0), 'closing_time': datetime.time(17, 0), 'is_open': True},
]


def create_default_schedule():
    """Create the default schedule in the database (idempotent).

    Existing days are left untouched so the doctor's customizations are never
    overwritten. Returns the queryset of all schedules ordered by day.
    """
    for entry in DEFAULT_SCHEDULE:
        Schedule.objects.get_or_create(
            day=entry['day'],
            defaults={
                'opening_time': entry['opening_time'],
                'closing_time': entry['closing_time'],
                'is_open': entry['is_open'],
            },
        )
    return Schedule.objects.all()