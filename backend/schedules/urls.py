from django.urls import path

from . import views

urlpatterns = [
    path('', views.ScheduleListView.as_view(), name='schedule-list'),
    path('<int:pk>/', views.ScheduleDetailView.as_view(), name='schedule-detail'),
]
