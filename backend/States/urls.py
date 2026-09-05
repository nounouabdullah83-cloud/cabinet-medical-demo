from django.urls import path

from .views import ServicePriceView, StaticticsView

urlpatterns = [
    path('', StaticticsView.as_view(), name='statictics'),
    path('price/<int:pk>/', ServicePriceView.as_view(), name='service-price'),
]