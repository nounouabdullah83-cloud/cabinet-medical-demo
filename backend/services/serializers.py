from rest_framework import serializers

from .models import Service


class ServiceSerializer(serializers.ModelSerializer):
    image = serializers.URLField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = Service
        fields = ['id', 'title', 'description', 'price', 'image', 'created_at_date', 'created_at_time']
        read_only_fields = ['id', 'created_at_date', 'created_at_time']
