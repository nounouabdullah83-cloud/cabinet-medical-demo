from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase

from .models import Service

UserModel = get_user_model()


class ServiceTests(APITestCase):
    def setUp(self):
        self.admin = UserModel.objects.create_superuser(
            username='admin',
            email='admin@clinic.com',
            password='Password123!',
            is_active=True,
        )
        self.service = Service.objects.create(
            title='Cardiology Test',
            description='Heart care',
            price=400.0,
        )

    def test_public_can_view_services(self):
        response = self.client.get('/api/services/')
        self.assertEqual(response.status_code, 200)

        response = self.client.get('/api/services/all/')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.data) >= 1)

    def test_unauthenticated_cannot_create_service(self):
        response = self.client.post('/api/services/all/', {
            'title': 'Dermatology',
            'description': 'Skin care',
            'price': 200.0,
        })
        self.assertEqual(response.status_code, 401)

    def test_admin_can_create_and_delete_service(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post('/api/services/all/', {
            'title': 'Dermatology Special',
            'description': 'Skin care description',
            'price': 200.0,
        }, format='json')
        self.assertEqual(response.status_code, 201)
        new_id = response.data['id']

        # Delete
        delete_resp = self.client.delete(f'/api/services/{new_id}/')
        self.assertEqual(delete_resp.status_code, 204)
