from rest_framework import serializers


class StaticticsSerializer(serializers.Serializer):
    bookings_done = serializers.IntegerField()
    bookings_cancled = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=10, decimal_places=2)
    bookings_created = serializers.IntegerField(required=False)