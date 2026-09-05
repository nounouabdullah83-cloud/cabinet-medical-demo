from django.db import migrations


def seed_more_bookings(apps, schema_editor):
    Booking = apps.get_model('bookings', 'Booking')
    Service = apps.get_model('services', 'Service')

    services = list(Service.objects.all())
    if not services:
        return

    def svc(title):
        return next((s for s in services if s.title.lower() == title.lower()), None) or services[0]

    bookings = [
        {'full_name': 'Amina Benali', 'age': 34, 'service': svc('Dermatology'), 'preferred_date': '2026-09-10', 'preferred_time': '09:00:00', 'email': 'amina.benali@example.com', 'phone_number': '+213 555-0201'},
        {'full_name': 'Lucas Fernandes', 'age': 52, 'service': svc('Cardiology'), 'preferred_date': '2026-09-10', 'preferred_time': '10:30:00', 'email': 'lucas.f@example.com', 'phone_number': '+55 11-99876-4321'},
        {'full_name': 'Fatima Zahra', 'age': 27, 'service': svc('Gynecology'), 'preferred_date': '2026-09-10', 'preferred_time': '14:00:00', 'email': 'fatima.z@example.com', 'phone_number': '+213 555-0222'},
        {'full_name': 'Chen Wei', 'age': 45, 'service': svc('Ophthalmology'), 'preferred_date': '2026-09-11', 'preferred_time': '08:30:00', 'email': 'chen.wei@example.com', 'phone_number': '+86 138-0001-2345'},
        {'full_name': 'Sarah Mitchell', 'age': 19, 'service': svc('Psychology'), 'preferred_date': '2026-09-11', 'preferred_time': '11:00:00', 'email': 'sarah.m@example.com', 'phone_number': '+1 555-0255'},
        {'full_name': 'Youssef El Idrissi', 'age': 67, 'service': svc('Orthopedics'), 'preferred_date': '2026-09-11', 'preferred_time': '15:30:00', 'email': 'youssef.e@example.com', 'phone_number': '+213 555-0278'},
        {'full_name': 'Isabella Rossi', 'age': 38, 'service': svc('Nutrition & Dietetics'), 'preferred_date': '2026-09-12', 'preferred_time': '09:15:00', 'email': 'isabella.r@example.com', 'phone_number': '+39 320-1234567'},
        {'full_name': 'Ahmed Khalil', 'age': 55, 'service': svc('ENT'), 'preferred_date': '2026-09-12', 'preferred_time': '13:00:00', 'email': 'ahmed.k@example.com', 'phone_number': '+213 555-0300'},
        {'full_name': 'Emma Johansson', 'age': 31, 'service': svc('Dentistry'), 'preferred_date': '2026-09-12', 'preferred_time': '16:00:00', 'email': 'emma.j@example.com', 'phone_number': '+46 70-123 45 67'},
        {'full_name': 'Karim Benziane', 'age': 72, 'service': svc('Urology'), 'preferred_date': '2026-09-13', 'preferred_time': '10:00:00', 'email': 'karim.b@example.com', 'phone_number': '+213 555-0333'},
        {'full_name': 'Mia Thompson', 'age': 6, 'service': svc('Pediatrics'), 'preferred_date': '2026-09-13', 'preferred_time': '11:30:00', 'email': 'mia.t@example.com', 'phone_number': '+1 555-0344'},
        {'full_name': 'Rania Bencheikh', 'age': 41, 'service': svc('Physiotherapy'), 'preferred_date': '2026-09-13', 'preferred_time': '14:45:00', 'email': 'rania.b@example.com', 'phone_number': '+213 555-0355'},
        {'full_name': 'David Park', 'age': 29, 'service': svc('Dermatosurgery'), 'preferred_date': '2026-09-14', 'preferred_time': '09:00:00', 'email': 'david.p@example.com', 'phone_number': '+82 10-1234-5678'},
        {'full_name': 'Leila Mansour', 'age': 58, 'service': svc('Radiology'), 'preferred_date': '2026-09-14', 'preferred_time': '11:00:00', 'email': 'leila.m@example.com', 'phone_number': '+213 555-0377'},
        {'full_name': 'Oscar Nielsen', 'age': 44, 'service': svc('Health Checkup Package'), 'preferred_date': '2026-09-14', 'preferred_time': '08:00:00', 'email': 'oscar.n@example.com', 'phone_number': '+45 20-12 34 56'},
        {'full_name': 'Nadia Tahiri', 'age': 23, 'service': svc('Vaccination'), 'preferred_date': '2026-09-15', 'preferred_time': '10:30:00', 'email': 'nadia.t@example.com', 'phone_number': '+213 555-0399'},
        {'full_name': 'Marco Silva', 'age': 76, 'service': svc('Emergency Medicine'), 'preferred_date': '2026-09-15', 'preferred_time': '07:00:00', 'email': 'marco.s@example.com', 'phone_number': '+55 21-98765-4321'},
        {'full_name': 'Hana Kim', 'age': 33, 'service': svc('Ultrasound & Imaging'), 'preferred_date': '2026-09-15', 'preferred_time': '15:00:00', 'email': 'hana.k@example.com', 'phone_number': '+82 10-9876-5432'},
        {'full_name': 'Rachid Ait Ali', 'age': 48, 'service': svc('General practice'), 'preferred_date': '2026-09-16', 'preferred_time': '09:30:00', 'email': 'rachid.a@example.com', 'phone_number': '+213 555-0411'},
        {'full_name': 'Julia Becker', 'age': 15, 'service': svc('Laboratory'), 'preferred_date': '2026-09-16', 'preferred_time': '13:30:00', 'email': 'julia.b@example.com', 'phone_number': '+49 170-1234567'},
    ]

    for booking in bookings:
        Booking.objects.create(**booking)


def remove_more_bookings(apps, schema_editor):
    Booking = apps.get_model('bookings', 'Booking')
    names = [
        'Amina Benali', 'Lucas Fernandes', 'Fatima Zahra', 'Chen Wei', 'Sarah Mitchell',
        'Youssef El Idrissi', 'Isabella Rossi', 'Ahmed Khalil', 'Emma Johansson', 'Karim Benziane',
        'Mia Thompson', 'Rania Bencheikh', 'David Park', 'Leila Mansour', 'Oscar Nielsen',
        'Nadia Tahiri', 'Marco Silva', 'Hana Kim', 'Rachid Ait Ali', 'Julia Becker',
    ]
    Booking.objects.filter(full_name__in=names).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('bookings', '0002_seed_bookings'),
    ]

    operations = [
        migrations.RunPython(seed_more_bookings, remove_more_bookings),
    ]
