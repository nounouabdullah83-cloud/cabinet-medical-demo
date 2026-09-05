import json
import os
from datetime import timedelta

from django.http import Http404
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from bookings.models import Booking

from .serializers import StaticticsSerializer

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATS_FILE = os.path.join(BASE_DIR, 'stats_data.json')


def read_stats():
    try:
        with open(STATS_FILE, encoding='utf-8') as f:
            return json.load(f)
    except (IOError, OSError):
        raise Http404('Statistics data not found.')


def write_stats(data):
    tmp_file = STATS_FILE + '.tmp'
    with open(tmp_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    os.replace(tmp_file, STATS_FILE)


class StaticticsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        period = request.query_params.get('period', 'month')
        days = {'day': 1, 'week': 7, 'month': 30}
        if period not in days:
            return Response(
                {'detail': "Period must be 'day', 'week' or 'month'."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        since = timezone.now() - timedelta(days=days[period])
        data = read_stats()
        data['bookings_created'] = Booking.objects.filter(created_at__gte=since).count()
        serializer = StaticticsSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data)

    def patch(self, request):
        action = request.data.get('action')
        data = read_stats()

        if action == 'done':
            data['bookings_done'] = int(data.get('bookings_done', 0)) + 1
            try:
                data['total_revenue'] = float(data.get('total_revenue', 0)) + float(request.data.get('price', 0))
            except (TypeError, ValueError):
                return Response(
                    {'detail': 'A valid price is required for action "done".'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        elif action == 'cancel':
            data['bookings_cancled'] = int(data.get('bookings_cancled', 0)) + 1
        else:
            return Response(
                {'detail': "Action must be 'done' or 'cancel'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = StaticticsSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        cleaned = serializer.validated_data
        cleaned['total_revenue'] = f"{cleaned['total_revenue']:.2f}"
        write_stats(cleaned)
        return Response(cleaned)


class ServicePriceView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            booking = Booking.objects.get(pk=pk)
        except Booking.DoesNotExist:
            return Response(
                {'detail': 'Not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response({'booking_id': booking.id, 'service_price': booking.service.price}) 