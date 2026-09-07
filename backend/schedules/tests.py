import datetime
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase

from .models import Schedule

UserModel = get_user_model()


class ScheduleTests(APITestCase):
    def setUp(self):
        self.admin = UserModel.objects.create_superuser(
            username='admin',
            email='admin@clinic.com',
            password='Password123!',
            is_active=True,
        )

    def test_schedule_seeds_on_first_get(self):
        self.assertEqual(Schedule.objects.count(), 0)
        response = self.client.get('/api/schedule/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Schedule.objects.count(), 7)

    def test_only_doctor_can_modify_schedule(self):
        # Trigger seeding
        self.client.get('/api/schedule/')
        monday = Schedule.objects.get(day='monday')

        # Unauthenticated edit fails
        response = self.client.put(f'/api/schedule/{monday.id}/', {
            'day': 'monday',
            'opening_time': '09:00:00',
            'closing_time': '18:00:00',
            'is_open': True,
        })
        self.assertEqual(response.status_code, 401)

        # Authenticated edit succeeds
        self.client.force_authenticate(user=self.admin)
        response = self.client.put(f'/api/schedule/{monday.id}/', {
            'day': 'monday',
            'opening_time': '09:00:00',
            'closing_time': '18:00:00',
            'is_open': True,
        }, format='json')
        self.assertEqual(response.status_code, 200)
        monday.refresh_from_db()
        self.assertEqual(monday.opening_time, datetime.time(9, 0))
