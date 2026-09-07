from django.utils import timezone
from rest_framework import serializers

from schedules.defaults import create_default_schedule
from schedules.models import Schedule
from services.models import Service

from .models import Booking


class BookingSerializer(serializers.ModelSerializer):
    service = serializers.PrimaryKeyRelatedField(queryset=Service.objects.all())
    service_title = serializers.CharField(source='service.title', read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id',
            'full_name',
            'age',
            'service',
            'service_title',
            'preferred_date',
            'preferred_time',
            'email',
            'phone_number',
            'created_at',
        ]

    def validate(self, data):
        preferred_date = data.get('preferred_date', getattr(self.instance, 'preferred_date', None))
        preferred_time = data.get('preferred_time', getattr(self.instance, 'preferred_time', None))

        if preferred_date:
            today = timezone.now().date()
            if preferred_date < today:
                raise serializers.ValidationError(
                    {'preferred_date': 'Cannot book an appointment for a past date.'}
                )

            # Ensure schedules are seeded
            if not Schedule.objects.exists():
                create_default_schedule()

            weekday_name = preferred_date.strftime('%A').lower()
            schedule = Schedule.objects.filter(day=weekday_name).first()

            if schedule and not schedule.is_open:
                raise serializers.ValidationError(
                    {'preferred_date': f'The clinic is closed on {preferred_date.strftime("%A")}s.'}
                )

            if schedule and preferred_time and schedule.opening_time and schedule.closing_time:
                if preferred_time < schedule.opening_time or preferred_time > schedule.closing_time:
                    raise serializers.ValidationError(
                        {
                            'preferred_time': (
                                f'Appointments on {preferred_date.strftime("%A")} must be between '
                                f'{schedule.opening_time.strftime("%H:%M")} and {schedule.closing_time.strftime("%H:%M")}.'
                            )
                        }
                    )

        # Check for slot conflicts
        if preferred_date and preferred_time:
            conflict_query = Booking.objects.filter(
                preferred_date=preferred_date,
                preferred_time=preferred_time,
            )
            if self.instance:
                conflict_query = conflict_query.exclude(pk=self.instance.pk)

            if conflict_query.exists():
                raise serializers.ValidationError(
                    {'preferred_time': 'This time slot is already booked. Please select another time.'}
                )

        return data