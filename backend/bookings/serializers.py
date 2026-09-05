from rest_framework import serializers

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