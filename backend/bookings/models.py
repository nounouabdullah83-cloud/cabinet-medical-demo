from django.db import models

from services.models import Service


class Booking(models.Model):
    full_name = models.CharField(max_length=100)
    age = models.PositiveIntegerField()
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='bookings')
    preferred_date = models.DateField()
    preferred_time = models.TimeField()
    email = models.EmailField(blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.full_name} - {self.service.title}'