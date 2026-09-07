from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APITestCase

from .models import PasswordReset

UserModel = get_user_model()


class ResetPasswordFlowTests(APITestCase):
    def setUp(self):
        self.admin = UserModel.objects.create_superuser(
            username='admin',
            email='admin@clinic.com',
            password='OldPass123!',
            is_active=True,
        )

    def test_full_reset_flow_for_superuser(self):
        # 1. Request a reset code for the administrator.
        response = self.client.post(
            '/api/auth/reset-password/',
            {'email': 'admin@clinic.com'},
            format='json',
        )
        self.assertEqual(response.status_code, 200)

        code = PasswordReset.objects.get(email=self.admin.email).code
        self.assertEqual(len(code), 5)
        self.assertTrue(code.isdigit())

        # 2. Confirm a wrong code is rejected.
        response = self.client.post(
            '/api/auth/confirm-code/',
            {'email': 'admin@clinic.com', 'code': '00000'},
            format='json',
        )
        self.assertEqual(response.status_code, 400)

        # 3. Confirm the correct code.
        response = self.client.post(
            '/api/auth/confirm-code/',
            {'email': 'admin@clinic.com', 'code': code},
            format='json',
        )
        self.assertEqual(response.status_code, 200)

        # 4. Set a new password.
        response = self.client.post(
            '/api/auth/set-password/',
            {
                'email': 'admin@clinic.com',
                'code': code,
                'new_password': 'NewPass123!',
            },
            format='json',
        )
        self.assertEqual(response.status_code, 200)

        self.admin.refresh_from_db()
        self.assertTrue(self.admin.check_password('NewPass123!'))

        # 5. The code is single use — replaying it must fail.
        response = self.client.post(
            '/api/auth/set-password/',
            {
                'email': 'admin@clinic.com',
                'code': code,
                'new_password': 'Another123!',
            },
            format='json',
        )
        self.assertEqual(response.status_code, 400)

        # 6. The new password works for login.
        response = self.client.post(
            '/api/auth/login/',
            {'email': 'admin@clinic.com', 'password': 'NewPass123!'},
            format='json',
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn('access', response.data)

    def test_non_superuser_is_rejected_on_request(self):
        # A normal (non-admin) account must be rejected and no code generated.
        UserModel.objects.create_user(
            username='doctor',
            email='doctor@clinic.com',
            password='OldPass123!',
            is_active=True,
        )
        response = self.client.post(
            '/api/auth/reset-password/',
            {'email': 'doctor@clinic.com'},
            format='json',
        )
        self.assertEqual(response.status_code, 400)
        self.assertFalse(
            PasswordReset.objects.filter(email='doctor@clinic.com').exists()
        )

    def test_unregistered_email_is_rejected(self):
        response = self.client.post(
            '/api/auth/reset-password/',
            {'email': 'nobody@clinic.com'},
            format='json',
        )
        self.assertEqual(response.status_code, 400)
        self.assertFalse(
            PasswordReset.objects.filter(email='nobody@clinic.com').exists()
        )