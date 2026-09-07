from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView

from .defaults import create_default_schedule
from .models import Schedule
from .permissions import IsDoctor
from .serializers import ScheduleSerializer


class ScheduleListView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsDoctor()]

    def get(self, request):
        # Generate the default schedule on first access so the doctor always
        # has a full weekly availability to work with. Customizations made by
        # the doctor are never overwritten (idempotent).
        if not Schedule.objects.exists():
            create_default_schedule()

        schedules = Schedule.objects.all()
        serializer = ScheduleSerializer(schedules, many=True)
        return Response(serializer.data)


class ScheduleDetailView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsDoctor()]

    def get_object(self, pk):
        try:
            return Schedule.objects.get(pk=pk)
        except Schedule.DoesNotExist:
            return None

    def get(self, request, pk):
        schedule = self.get_object(pk)
        if schedule is None:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ScheduleSerializer(schedule)
        return Response(serializer.data)

    def put(self, request, pk):
        schedule = self.get_object(pk)
        if schedule is None:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ScheduleSerializer(schedule, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        schedule = self.get_object(pk)
        if schedule is None:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ScheduleSerializer(schedule, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
