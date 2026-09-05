from django.db import migrations


def seed_bookings(apps, schema_editor):
    Booking = apps.get_model('bookings', 'Booking')
    Service = apps.get_model('services', 'Service')

    services = list(Service.objects.all())
    if not services:
        return

    def svc(title):
        return next((s for s in services if s.title.lower() == title.lower()), None) or services[0]

    bookings = [
        {
            'full_name': 'Emily Carter',
            'age': 29,
            'service': svc('General practice'),
            'preferred_date': '2026-09-05',
            'preferred_time': '09:30:00',
            'email': 'emily.carter@example.com',
            'phone_number': '+1 555-0142',
        },
        {
            'full_name': 'James Whitfield',
            'age': 61,
            'service': svc('Cardiology'),
            'preferred_date': '2026-09-06',
            'preferred_time': '14:00:00',
            'email': 'j.whitfield@example.com',
            'phone_number': '+1 555-0177',
        },
        {
            'full_name': 'Sofia Mendes',
            'age': 8,
            'service': svc('Pediatrics'),
            'preferred_date': '2026-09-07',
            'preferred_time': '11:15:00',
            'email': 'sofia.mendes@example.com',
            'phone_number': '',
        },
        {
            'full_name': 'Omar Haddad',
            'age': 42,
            'service': svc('Laboratory'),
            'preferred_date': '2026-09-08',
            'preferred_time': '16:45:00',
            'email': 'omar.haddad@example.com',
            'phone_number': '+1 555-0193',
        },
        {
            'full_name': 'Priya Nair',
            'age': 35,
            'service': svc('General practice'),
            'preferred_date': '2026-09-09',
            'preferred_time': '10:00:00',
            'email': 'priya.nair@example.com',
            'phone_number': '+1 555-0118',
        },
    ]

    for booking in bookings:
        Booking.objects.create(**booking)


def remove_bookings(apps, schema_editor):
    Booking = apps.get_model('bookings', 'Booking')
    Booking.objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ('bookings', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(seed_bookings, remove_bookings),
    ]
