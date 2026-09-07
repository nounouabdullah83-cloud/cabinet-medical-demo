from decimal import Decimal
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase

from services.models import Service
from bookings.models import Booking
from .models import CabinetStatistic

UserModel = get_user_model()


class StatisticsTests(APITestCase):
    def setUp(self):
        self.admin = UserModel.objects.create_superuser(
            username='admin',
            email='admin@clinic.com',
            password='Password123!',
            is_active=True,
        )
        self.service = Service.objects.create(
            title='Pediatrics',
            description='Child health check',
            price=300.0,
        )

    def test_unauthenticated_access_is_forbidden(self):
        response = self.client.get('/api/states/')
        self.assertEqual(response.status_code, 401)

        response = self.client.patch('/api/states/', {'action': 'done', 'price': 300})
        self.assertEqual(response.status_code, 401)

    def test_doctor_can_record_done_and_cancel_stats(self):
        self.client.force_authenticate(user=self.admin)

        # Record Done
        response = self.client.patch('/api/states/', {'action': 'done', 'price': 300}, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['bookings_done'], 1)
        self.assertEqual(Decimal(str(response.data['total_revenue'])), Decimal('300.00'))

        # Record Cancel
        response = self.client.patch('/api/states/', {'action': 'cancel'}, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['bookings_cancled'], 1)

        # Verify Get Stats
        response = self.client.get('/api/states/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['bookings_done'], 1)
        self.assertEqual(response.data['bookings_cancled'], 1)
