from django.core.management.base import BaseCommand

from schedules.defaults import create_default_schedule


class Command(BaseCommand):
    help = 'Generate the default doctor schedule (idempotent, keeps customizations)'

    def handle(self, *args, **options):
        schedules = create_default_schedule()
        self.stdout.write(self.style.SUCCESS(
            f'Default schedule ready: {schedules.count()} day(s) configured.'
        ))
