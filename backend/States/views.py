from decimal import Decimal
from django.db import transaction
from django.db.models import F, Sum
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from bookings.models import Booking
from schedules.permissions import IsDoctor

from .models import CabinetStatistic
from .serializers import StaticticsSerializer


def get_or_create_current_stat():
    now = timezone.now()
    stat, _ = CabinetStatistic.objects.get_or_create(
        year=now.year,
        month=now.month,
        defaults={
            'bookings_created': 0,
            'bookings_done': 0,
            'bookings_cancled': 0,
            'total_revenue': Decimal('0.00'),
        },
    )
    return stat


class StaticticsView(APIView):
    """Secure statistics view protected for Doctor/Admin only."""
    permission_classes = [IsAuthenticated, IsDoctor]

    def get(self, request):
        period = request.query_params.get('period', 'month')
        now = timezone.now()

        # Aggregate from MonthlyStatistic table
        if period == 'day':
            # Current month stats as baseline for daily snapshot
            stat = get_or_create_current_stat()
            done = stat.bookings_done
            cancled = stat.bookings_cancled
            revenue = stat.total_revenue
        elif period == 'week':
            stat = get_or_create_current_stat()
            done = stat.bookings_done
            cancled = stat.bookings_cancled
            revenue = stat.total_revenue
        else:  # month / all-time
            stat = get_or_create_current_stat()
            done = stat.bookings_done
            cancled = stat.bookings_cancled
            revenue = stat.total_revenue

        active_created = Booking.objects.count()

        data = {
            'bookings_created': stat.bookings_created + active_created,
            'bookings_done': done,
            'bookings_cancled': cancled,
            'total_revenue': revenue,
        }

        serializer = StaticticsSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data)

    def patch(self, request):
        action = request.data.get('action')
        stat = get_or_create_current_stat()

        with transaction.atomic():
            if action == 'done':
                try:
                    price = Decimal(str(request.data.get('price', 0)))
                except (TypeError, ValueError):
                    return Response(
                        {'detail': 'A valid price is required for action "done".'},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                CabinetStatistic.objects.filter(pk=stat.pk).update(
                    bookings_done=F('bookings_done') + 1,
                    total_revenue=F('total_revenue') + price,
                )
            elif action == 'cancel':
                CabinetStatistic.objects.filter(pk=stat.pk).update(
                    bookings_cancled=F('bookings_cancled') + 1,
                )
            else:
                return Response(
                    {'detail': "Action must be 'done' or 'cancel'."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        stat.refresh_from_db()
        active_created = Booking.objects.count()

        data = {
            'bookings_created': stat.bookings_created + active_created,
            'bookings_done': stat.bookings_done,
            'bookings_cancled': stat.bookings_cancled,
            'total_revenue': stat.total_revenue,
        }
        serializer = StaticticsSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data)


class ServicePriceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            booking = Booking.objects.select_related('service').get(pk=pk)
        except Booking.DoesNotExist:
            return Response(
                {'detail': 'Not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        price = booking.service.price if booking.service else 0.0
        return Response({'booking_id': booking.id, 'service_price': price})