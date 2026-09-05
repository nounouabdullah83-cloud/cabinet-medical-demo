import datetime

from django.core.management.base import BaseCommand

from schedules.models import Schedule


DEFAULT_SCHEDULE = [
    {'day': 'monday', 'opening_time': datetime.time(8, 0), 'closing_time': datetime.time(17, 0), 'is_open': True},
    {'day': 'tuesday', 'opening_time': datetime.time(8, 0), 'closing_time': datetime.time(17, 0), 'is_open': True},
    {'day': 'wednesday', 'opening_time': datetime.time(8, 0), 'closing_time': datetime.time(17, 0), 'is_open': True},
    {'day': 'thursday', 'opening_time': datetime.time(8, 0), 'closing_time': datetime.time(17, 0), 'is_open': True},
    {'day': 'friday', 'opening_time': None, 'closing_time': None, 'is_open': False},
    {'day': 'saturday', 'opening_time': datetime.time(8, 0), 'closing_time': datetime.time(17, 0), 'is_open': True},
    {'day': 'sunday', 'opening_time': datetime.time(8, 0), 'closing_time': datetime.time(17, 0), 'is_open': True},
]


class Command(BaseCommand):
    help = 'Generate the default doctor schedule (idempotent)'

    def handle(self, *args, **options):
        created_count = 0
        updated_count = 0

        for entry in DEFAULT_SCHEDULE:
            obj, created = Schedule.objects.get_or_create(
                day=entry['day'],
                defaults={
                    'opening_time': entry['opening_time'],
                    'closing_time': entry['closing_time'],
                    'is_open': entry['is_open'],
                },
            )
            if created:
                created_count += 1
            else:
                changed = False
                if obj.is_open != entry['is_open']:
                    obj.is_open = entry['is_open']
                    changed = True
                if entry['is_open']:
                    if obj.opening_time != entry['opening_time']:
                        obj.opening_time = entry['opening_time']
                        changed = True
                    if obj.closing_time != entry['closing_time']:
                        obj.closing_time = entry['closing_time']
                        changed = True
                if changed:
                    obj.save()
                    updated_count += 1

        self.stdout.write(self.style.SUCCESS(
            f'Default schedule generated: {created_count} created, {updated_count} updated.'
        ))
