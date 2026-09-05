from django.urls import path

from . import views

urlpatterns = [
    path('', views.TopServicesView.as_view(), name='top-services'),
    path('all/', views.ServiceListView.as_view(), name='service-list'),
    path('<int:pk>/', views.ServiceDetailView.as_view(), name='service-detail'),
]