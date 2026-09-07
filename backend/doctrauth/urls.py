from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import EmailTokenObtainPairSerializer
from .views import (
    ConfirmResetCodeView,
    MeView,
    RequestPasswordResetView,
    SetPasswordView,
)

urlpatterns = [
    path(
        'login/',
        TokenObtainPairView.as_view(serializer_class=EmailTokenObtainPairSerializer),
        name='auth-login',
    ),
    path('refresh/', TokenRefreshView.as_view(), name='auth-refresh'),
    path('me/', MeView.as_view(), name='auth-me'),
    path(
        'reset-password/',
        RequestPasswordResetView.as_view(),
        name='auth-reset-password',
    ),
    path(
        'confirm-code/',
        ConfirmResetCodeView.as_view(),
        name='auth-confirm-code',
    ),
    path(
        'set-password/',
        SetPasswordView.as_view(),
        name='auth-set-password',
    ),
]