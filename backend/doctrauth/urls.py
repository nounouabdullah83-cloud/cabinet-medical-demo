from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import EmailTokenObtainPairSerializer
from .views import MeView

urlpatterns = [
    path(
        'login/',
        TokenObtainPairView.as_view(serializer_class=EmailTokenObtainPairSerializer),
        name='auth-login',
    ),
    path('refresh/', TokenRefreshView.as_view(), name='auth-refresh'),
    path('me/', MeView.as_view(), name='auth-me'),
]