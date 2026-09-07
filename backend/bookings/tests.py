import datetime
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.test import APITestCase

from schedules.models import Schedule
from services.models import Service
from .models import Booking

UserModel = get_user_model()


class BookingTests(APITestCase):
    def setUp(self):
        self.admin = UserModel.objects.create_superuser(
            username='admin',
            email='admin@clinic.com',
            password='Password123!',
            is_active=True,
        )
        self.service = Service.objects.create(
            title='General Consultation',
            description='Standard doctor visit',
            price=250.0,
        )
        # Ensure schedule exists for all days
        for day in ['monday', 'tuesday', 'wednesday', 'thursday', 'saturday', 'sunday']:
            Schedule.objects.get_or_create(
                day=day,
                defaults={
                    'opening_time': datetime.time(8, 0),
                    'closing_time': datetime.time(17, 0),
                    'is_open': True,
                },
            )
        Schedule.objects.get_or_create(
            day='friday',
            defaults={
                'opening_time': None,
                'closing_time': None,
                'is_open': False,
            },
        )

    def get_upcoming_open_and_closed_dates(self):
        # Pick a date 100 days in future to avoid collisions with seeded fixture dates
        base_date = timezone.now().date() + datetime.timedelta(days=100)
        open_date = None
        closed_date = None
        for i in range(14):
            candidate = base_date + datetime.timedelta(days=i)
            if candidate.strftime('%A').lower() == 'friday':
                if closed_date is None:
                    closed_date = candidate
            else:
                if open_date is None:
                    open_date = candidate
            if open_date and closed_date:
                break
        return open_date, closed_date

    def test_create_valid_booking(self):
        open_date, _ = self.get_upcoming_open_and_closed_dates()
        payload = {
            'full_name': 'John Doe',
            'age': 30,
            'service': self.service.id,
            'preferred_date': open_date.isoformat(),
            'preferred_time': '10:00:00',
            'email': 'john@example.com',
            'phone_number': '0612345678',
        }
        response = self.client.post('/api/bookings/', payload, format='json')
        self.assertEqual(response.status_code, 201, msg=f"Errors: {response.data}")
        self.assertTrue(Booking.objects.filter(full_name='John Doe').exists())

    def test_reject_closed_day_booking(self):
        _, closed_date = self.get_upcoming_open_and_closed_dates()
        payload = {
            'full_name': 'Jane Doe',
            'age': 28,
            'service': self.service.id,
            'preferred_date': closed_date.isoformat(),
            'preferred_time': '10:00:00',
            'email': 'jane@example.com',
        }
        response = self.client.post('/api/bookings/', payload, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('preferred_date', response.data)

    def test_reject_out_of_hours_booking(self):
        open_date, _ = self.get_upcoming_open_and_closed_dates()
        payload = {
            'full_name': 'Late Bird',
            'age': 35,
            'service': self.service.id,
            'preferred_date': open_date.isoformat(),
            'preferred_time': '20:00:00',
            'email': 'late@example.com',
        }
        response = self.client.post('/api/bookings/', payload, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('preferred_time', response.data)

    def test_reject_duplicate_time_slot(self):
        open_date, _ = self.get_upcoming_open_and_closed_dates()
        Booking.objects.create(
            full_name='First Patient',
            age=25,
            service=self.service,
            preferred_date=open_date,
            preferred_time=datetime.time(11, 0),
            email='first@example.com',
        )
        payload = {
            'full_name': 'Second Patient',
            'age': 40,
            'service': self.service.id,
            'preferred_date': open_date.isoformat(),
            'preferred_time': '11:00:00',
            'email': 'second@example.com',
        }
        response = self.client.post('/api/bookings/', payload, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('preferred_time', response.data)