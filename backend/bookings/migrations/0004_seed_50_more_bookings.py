from django.db import migrations


def seed_50_more_bookings(apps, schema_editor):
    Booking = apps.get_model('bookings', 'Booking')
    Service = apps.get_model('services', 'Service')

    services = list(Service.objects.all())
    if not services:
        return

    def svc(title):
        return next((s for s in services if s.title.lower() == title.lower()), None) or services[0]

    data = [
        {'full_name': 'Adam Nowak', 'age': 39, 'service': svc('General practice'), 'preferred_date': '2026-09-10', 'preferred_time': '08:00:00', 'email': 'adam.n@example.com', 'phone_number': '+48 600 123 456'},
        {'full_name': 'Sofia Costa', 'age': 26, 'service': svc('Dermatology'), 'preferred_date': '2026-09-10', 'preferred_time': '09:30:00', 'email': 'sofia.c@example.com', 'phone_number': '+351 911 222 333'},
        {'full_name': 'Omar Haddad', 'age': 61, 'service': svc('Cardiology'), 'preferred_date': '2026-09-11', 'preferred_time': '10:00:00', 'email': 'omar.h@example.com', 'phone_number': '+213 555-0501'},
        {'full_name': 'Emily Wright', 'age': 8, 'service': svc('Pediatrics'), 'preferred_date': '2026-09-11', 'preferred_time': '12:00:00', 'email': 'emily.w@example.com', 'phone_number': '+44 7700 900111'},
        {'full_name': 'Hassan Berkani', 'age': 47, 'service': svc('Dentistry'), 'preferred_date': '2026-09-11', 'preferred_time': '14:15:00', 'email': 'hassan.b@example.com', 'phone_number': '+213 555-0522'},
        {'full_name': 'Chloe Dubois', 'age': 34, 'service': svc('Ophthalmology'), 'preferred_date': '2026-09-12', 'preferred_time': '08:45:00', 'email': 'chloe.d@example.com', 'phone_number': '+33 6 12 34 56 78'},
        {'full_name': 'Mehdi Ziani', 'age': 53, 'service': svc('Orthopedics'), 'preferred_date': '2026-09-12', 'preferred_time': '11:30:00', 'email': 'mehdi.z@example.com', 'phone_number': '+213 555-0544'},
        {'full_name': 'Lily Anderson', 'age': 22, 'service': svc('Nutrition & Dietetics'), 'preferred_date': '2026-09-12', 'preferred_time': '15:00:00', 'email': 'lily.a@example.com', 'phone_number': '+1 555-0566'},
        {'full_name': 'Tarek Brahimi', 'age': 70, 'service': svc('Urology'), 'preferred_date': '2026-09-13', 'preferred_time': '09:00:00', 'email': 'tarek.b@example.com', 'phone_number': '+213 555-0588'},
        {'full_name': 'Noah Carter', 'age': 17, 'service': svc('Psychology'), 'preferred_date': '2026-09-13', 'preferred_time': '10:30:00', 'email': 'noah.c@example.com', 'phone_number': '+61 400 123 456'},
        {'full_name': 'Yasmin Guerroudj', 'age': 29, 'service': svc('Physiotherapy'), 'preferred_date': '2026-09-13', 'preferred_time': '14:00:00', 'email': 'yasmin.g@example.com', 'phone_number': '+213 555-0610'},
        {'full_name': 'Mateo Alvarez', 'age': 43, 'service': svc('Radiology'), 'preferred_date': '2026-09-14', 'preferred_time': '08:30:00', 'email': 'mateo.a@example.com', 'phone_number': '+34 600 111 222'},
        {'full_name': 'Amira Cherif', 'age': 36, 'service': svc('Gynecology'), 'preferred_date': '2026-09-14', 'preferred_time': '12:30:00', 'email': 'amira.c@example.com', 'phone_number': '+213 555-0633'},
        {'full_name': 'James Wilson', 'age': 64, 'service': svc('Emergency Medicine'), 'preferred_date': '2026-09-14', 'preferred_time': '07:30:00', 'email': 'james.w@example.com', 'phone_number': '+61 411 222 333'},
        {'full_name': 'Samia Belkacem', 'age': 25, 'service': svc('Vaccination'), 'preferred_date': '2026-09-15', 'preferred_time': '09:15:00', 'email': 'samia.b@example.com', 'phone_number': '+213 555-0655'},
        {'full_name': 'Ethan Brown', 'age': 11, 'service': svc('ENT'), 'preferred_date': '2026-09-15', 'preferred_time': '11:00:00', 'email': 'ethan.b@example.com', 'phone_number': '+44 7788 123456'},
        {'full_name': 'Salim Mekki', 'age': 58, 'service': svc('Dermatosurgery'), 'preferred_date': '2026-09-15', 'preferred_time': '15:30:00', 'email': 'salim.m@example.com', 'phone_number': '+213 555-0677'},
        {'full_name': 'Ava Martinez', 'age': 31, 'service': svc('Health Checkup Package'), 'preferred_date': '2026-09-16', 'preferred_time': '08:00:00', 'email': 'ava.m@example.com', 'phone_number': '+52 55 1234 5678'},
        {'full_name': 'Rachid Ouasmani', 'age': 49, 'service': svc('General practice'), 'preferred_date': '2026-09-16', 'preferred_time': '13:00:00', 'email': 'rachid.o@example.com', 'phone_number': '+213 555-0699'},
        {'full_name': 'Zoe Lambert', 'age': 40, 'service': svc('Laboratory'), 'preferred_date': '2026-09-16', 'preferred_time': '16:00:00', 'email': 'zoe.l@example.com', 'phone_number': '+33 6 22 33 44 55'},
        {'full_name': 'Karim Felahi', 'age': 66, 'service': svc('Cardiology'), 'preferred_date': '2026-09-17', 'preferred_time': '09:30:00', 'email': 'karim.f@example.com', 'phone_number': '+213 555-0721'},
        {'full_name': 'Mila Novak', 'age': 5, 'service': svc('Pediatrics'), 'preferred_date': '2026-09-17', 'preferred_time': '10:00:00', 'email': 'mila.n@example.com', 'phone_number': '+420 601 123 456'},
        {'full_name': 'Abdellah Semir', 'age': 73, 'service': svc('Ophthalmology'), 'preferred_date': '2026-09-17', 'preferred_time': '14:30:00', 'email': 'abdellah.s@example.com', 'phone_number': '+213 555-0744'},
        {'full_name': 'Grace Lee', 'age': 28, 'service': svc('Dermatology'), 'preferred_date': '2026-09-18', 'preferred_time': '08:15:00', 'email': 'grace.l@example.com', 'phone_number': '+82 10-2222-3333'},
        {'full_name': 'Nabil Kerrouche', 'age': 54, 'service': svc('Dentistry'), 'preferred_date': '2026-09-18', 'preferred_time': '11:45:00', 'email': 'nabil.k@example.com', 'phone_number': '+213 555-0766'},
        {'full_name': 'Isabelle Moreau', 'age': 37, 'service': svc('Physiotherapy'), 'preferred_date': '2026-09-18', 'preferred_time': '15:00:00', 'email': 'isabelle.m@example.com', 'phone_number': '+33 7 55 44 33 22'},
        {'full_name': 'Yacine Boudiaf', 'age': 21, 'service': svc('Vaccination'), 'preferred_date': '2026-09-19', 'preferred_time': '09:00:00', 'email': 'yacine.b@example.com', 'phone_number': '+213 555-0788'},
        {'full_name': 'Oliver Smith', 'age': 46, 'service': svc('Orthopedics'), 'preferred_date': '2026-09-19', 'preferred_time': '12:00:00', 'email': 'oliver.s@example.com', 'phone_number': '+44 7911 123456'},
        {'full_name': 'Souad Mahrez', 'age': 68, 'service': svc('Urology'), 'preferred_date': '2026-09-19', 'preferred_time': '13:30:00', 'email': 'souad.m@example.com', 'phone_number': '+213 555-0810'},
        {'full_name': 'Lucas Pereira', 'age': 32, 'service': svc('Psychology'), 'preferred_date': '2026-09-20', 'preferred_time': '10:30:00', 'email': 'lucas.p@example.com', 'phone_number': '+351 922 333 444'},
        {'full_name': 'Fouad Benali', 'age': 59, 'service': svc('Radiology'), 'preferred_date': '2026-09-20', 'preferred_time': '14:00:00', 'email': 'fouad.b@example.com', 'phone_number': '+213 555-0833'},
        {'full_name': 'Emma Stone', 'age': 14, 'service': svc('ENT'), 'preferred_date': '2026-09-20', 'preferred_time': '16:30:00', 'email': 'emma.s@example.com', 'phone_number': '+1 555-0855'},
        {'full_name': 'Anis Cherradi', 'age': 42, 'service': svc('General practice'), 'preferred_date': '2026-09-21', 'preferred_time': '08:00:00', 'email': 'anis.c@example.com', 'phone_number': '+213 555-0877'},
        {'full_name': 'Hannah Kim', 'age': 33, 'service': svc('Ultrasound & Imaging'), 'preferred_date': '2026-09-21', 'preferred_time': '11:15:00', 'email': 'hannah.k@example.com', 'phone_number': '+82 10-4444-5555'},
        {'full_name': 'Rami Bensaïd', 'age': 50, 'service': svc('Cardiology'), 'preferred_date': '2026-09-21', 'preferred_time': '13:45:00', 'email': 'rami.b@example.com', 'phone_number': '+213 555-0899'},
        {'full_name': 'Charlotte Nguyen', 'age': 30, 'service': svc('Nutrition & Dietetics'), 'preferred_date': '2026-09-22', 'preferred_time': '09:30:00', 'email': 'charlotte.n@example.com', 'phone_number': '+84 90 123 4567'},
        {'full_name': 'Djamel Merbah', 'age': 62, 'service': svc('Dermatosurgery'), 'preferred_date': '2026-09-22', 'preferred_time': '12:30:00', 'email': 'djamel.m@example.com', 'phone_number': '+213 555-0911'},
        {'full_name': 'Isabella Garcia', 'age': 27, 'service': svc('Laboratory'), 'preferred_date': '2026-09-22', 'preferred_time': '15:30:00', 'email': 'isabella.g@example.com', 'phone_number': '+34 611 222 333'},
        {'full_name': 'Hichem Farouk', 'age': 71, 'service': svc('Ophthalmology'), 'preferred_date': '2026-09-23', 'preferred_time': '10:00:00', 'email': 'hichem.f@example.com', 'phone_number': '+213 555-0933'},
        {'full_name': 'Maya Rossi', 'age': 9, 'service': svc('Pediatrics'), 'preferred_date': '2026-09-23', 'preferred_time': '11:30:00', 'email': 'maya.r@example.com', 'phone_number': '+39 333 111 2222'},
        {'full_name': 'Sami Belkadi', 'age': 45, 'service': svc('Dentistry'), 'preferred_date': '2026-09-23', 'preferred_time': '14:15:00', 'email': 'sami.b@example.com', 'phone_number': '+213 555-0955'},
        {'full_name': 'Olivia Brown', 'age': 38, 'service': svc('Gynecology'), 'preferred_date': '2026-09-24', 'preferred_time': '09:00:00', 'email': 'olivia.b@example.com', 'phone_number': '+44 7811 234567'},
        {'full_name': 'Mohamed Zerifi', 'age': 56, 'service': svc('Physiotherapy'), 'preferred_date': '2026-09-24', 'preferred_time': '13:00:00', 'email': 'mohamed.z@example.com', 'phone_number': '+213 555-0977'},
        {'full_name': 'Aria Thompson', 'age': 24, 'service': svc('Vaccination'), 'preferred_date': '2026-09-24', 'preferred_time': '16:00:00', 'email': 'aria.t@example.com', 'phone_number': '+1 555-0999'},
        {'full_name': 'Kamel Sidhoum', 'age': 63, 'service': svc('Emergency Medicine'), 'preferred_date': '2026-09-25', 'preferred_time': '07:45:00', 'email': 'kamel.s@example.com', 'phone_number': '+213 555-1010'},
        {'full_name': 'Nora Elmahdi', 'age': 35, 'service': svc('Dermatology'), 'preferred_date': '2026-09-25', 'preferred_time': '10:30:00', 'email': 'nora.e@example.com', 'phone_number': '+212 600 123 456'},
        {'full_name': 'Leo Fischer', 'age': 12, 'service': svc('ENT'), 'preferred_date': '2026-09-25', 'preferred_time': '12:45:00', 'email': 'leo.f@example.com', 'phone_number': '+49 151 12345678'},
        {'full_name': 'Fares Boulmerka', 'age': 51, 'service': svc('General practice'), 'preferred_date': '2026-09-26', 'preferred_time': '08:30:00', 'email': 'fares.b@example.com', 'phone_number': '+213 555-1033'},
        {'full_name': 'Zara Ahmed', 'age': 29, 'service': svc('Psychology'), 'preferred_date': '2026-09-26', 'preferred_time': '11:00:00', 'email': 'zara.a@example.com', 'phone_number': '+1 555-1055'},
        {'full_name': 'Rayan Achour', 'age': 48, 'service': svc('Health Checkup Package'), 'preferred_date': '2026-09-26', 'preferred_time': '15:00:00', 'email': 'rayan.a@example.com', 'phone_number': '+213 555-1077'},
    ]

    for booking in data:
        Booking.objects.create(**booking)


def remove_50_more_bookings(apps, schema_editor):
    Booking = apps.get_model('bookings', 'Booking')
    names = [row['full_name'] for row in [
        {'full_name': 'Adam Nowak'}, {'full_name': 'Sofia Costa'}, {'full_name': 'Omar Haddad'},
        {'full_name': 'Emily Wright'}, {'full_name': 'Hassan Berkani'}, {'full_name': 'Chloe Dubois'},
        {'full_name': 'Mehdi Ziani'}, {'full_name': 'Lily Anderson'}, {'full_name': 'Tarek Brahimi'},
        {'full_name': 'Noah Carter'}, {'full_name': 'Yasmin Guerroudj'}, {'full_name': 'Mateo Alvarez'},
        {'full_name': 'Amira Cherif'}, {'full_name': 'James Wilson'}, {'full_name': 'Samia Belkacem'},
        {'full_name': 'Ethan Brown'}, {'full_name': 'Salim Mekki'}, {'full_name': 'Ava Martinez'},
        {'full_name': 'Rachid Ouasmani'}, {'full_name': 'Zoe Lambert'}, {'full_name': 'Karim Felahi'},
        {'full_name': 'Mila Novak'}, {'full_name': 'Abdellah Semir'}, {'full_name': 'Grace Lee'},
        {'full_name': 'Nabil Kerrouche'}, {'full_name': 'Isabelle Moreau'}, {'full_name': 'Yacine Boudiaf'},
        {'full_name': 'Oliver Smith'}, {'full_name': 'Souad Mahrez'}, {'full_name': 'Lucas Pereira'},
        {'full_name': 'Fouad Benali'}, {'full_name': 'Emma Stone'}, {'full_name': 'Anis Cherradi'},
        {'full_name': 'Hannah Kim'}, {'full_name': 'Rami Bensaïd'}, {'full_name': 'Charlotte Nguyen'},
        {'full_name': 'Djamel Merbah'}, {'full_name': 'Isabella Garcia'}, {'full_name': 'Hichem Farouk'},
        {'full_name': 'Maya Rossi'}, {'full_name': 'Sami Belkadi'}, {'full_name': 'Olivia Brown'},
        {'full_name': 'Mohamed Zerifi'}, {'full_name': 'Aria Thompson'}, {'full_name': 'Kamel Sidhoum'},
        {'full_name': 'Nora Elmahdi'}, {'full_name': 'Leo Fischer'}, {'full_name': 'Fares Boulmerka'},
        {'full_name': 'Zara Ahmed'}, {'full_name': 'Rayan Achour'},
    ]]
    Booking.objects.filter(full_name__in=names).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('bookings', '0003_seed_more_bookings'),
    ]

    operations = [
        migrations.RunPython(seed_50_more_bookings, remove_50_more_bookings),
    ]
