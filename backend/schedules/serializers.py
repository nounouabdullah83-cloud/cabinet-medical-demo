from rest_framework import serializers
from .models import Schedule


class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = ['id', 'day', 'opening_time', 'closing_time', 'is_open']

    def validate(self, data):
        is_open = data.get('is_open', getattr(self.instance, 'is_open', None))
        opening_time = data.get('opening_time', getattr(self.instance, 'opening_time', None))
        closing_time = data.get('closing_time', getattr(self.instance, 'closing_time', None))

        if is_open:
            if not opening_time:
                raise serializers.ValidationError({'opening_time': 'Opening time is required when the day is open.'})
            if not closing_time:
                raise serializers.ValidationError({'closing_time': 'Closing time is required when the day is open.'})
            if opening_time >= closing_time:
                raise serializers.ValidationError({'closing_time': 'Closing time must be after opening time.'})
        return data
