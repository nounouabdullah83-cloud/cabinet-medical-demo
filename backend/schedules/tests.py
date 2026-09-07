from rest_framework.test import APITestCase

from .models import Schedule


class ScheduleListViewTests(APITestCase):
    def setUp(self):
        # Make sure every test starts from an empty schedule table.
        Schedule.objects.all().delete()

    def test_get_generates_default_schedule_when_empty(self):
        self.assertFalse(Schedule.objects.exists())

        response = self.client.get('/api/schedule/')

        self.assertEqual(response.status_code, 200)
        days = [item['day'] for item in response.data]
        self.assertEqual(len(days), 7)
        self.assertIn('monday', days)
        self.assertIn('sunday', days)

        # Monday should be open 08:00–17:00 by default.
        monday = next(item for item in response.data if item['day'] == 'monday')
        self.assertTrue(monday['is_open'])
        self.assertEqual(monday['opening_time'], '08:00:00')
        self.assertEqual(monday['closing_time'], '17:00:00')

        # Friday should be closed by default.
        friday = next(item for item in response.data if item['day'] == 'friday')
        self.assertFalse(friday['is_open'])
        self.assertIsNone(friday['opening_time'])
        self.assertIsNone(friday['closing_time'])

        # The defaults are persisted so the doctor can customize them.
        self.assertEqual(Schedule.objects.count(), 7)

    def test_get_does_not_overwrite_customized_schedule(self):
        create_default = self.client.get('/api/schedule/')
        self.assertEqual(create_default.status_code, 200)

        # Customize Monday.
        import datetime
        monday = Schedule.objects.get(day='monday')
        custom_open = datetime.time(9, 0)
        custom_close = datetime.time(18, 0)
        monday.opening_time = custom_open
        monday.closing_time = custom_close
        monday.save()

        # A second GET must not reset the customization.
        response = self.client.get('/api/schedule/')
        self.assertEqual(response.status_code, 200)
        monday_after = Schedule.objects.get(day='monday')
        self.assertEqual(monday_after.opening_time, custom_open)
        self.assertEqual(monday_after.closing_time, custom_close)
