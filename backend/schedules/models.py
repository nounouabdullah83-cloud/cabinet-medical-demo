from django.core.exceptions import ValidationError
from django.db import models


class Schedule(models.Model):
    DAY_CHOICES = [
        ('monday', 'Monday'),
        ('tuesday', 'Tuesday'),
        ('wednesday', 'Wednesday'),
        ('thursday', 'Thursday'),
        ('friday', 'Friday'),
        ('saturday', 'Saturday'),
        ('sunday', 'Sunday'),
    ]

    day = models.CharField(max_length=10, choices=DAY_CHOICES, unique=True)
    opening_time = models.TimeField(null=True, blank=True)
    closing_time = models.TimeField(null=True, blank=True)
    is_open = models.BooleanField(default=True)

    class Meta:
        ordering = ['day']

    def __str__(self):
        status = 'Open' if self.is_open else 'Closed'
        return f'{self.get_day_display()} - {status}'

    def clean(self):
        if self.is_open:
            if not self.opening_time:
                raise ValidationError({'opening_time': 'Opening time is required when the day is open.'})
            if not self.closing_time:
                raise ValidationError({'closing_time': 'Closing time is required when the day is open.'})
            if self.opening_time >= self.closing_time:
                raise ValidationError({'closing_time': 'Closing time must be after opening time.'})
