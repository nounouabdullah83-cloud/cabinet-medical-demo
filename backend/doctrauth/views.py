from django.contrib.auth import get_user_model, password_validation
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import PASSWORD_RESET_TTL, PasswordReset
from .serializers import (
    ConfirmResetCodeSerializer,
    RequestPasswordResetSerializer,
    SetPasswordSerializer,
    UserSerializer,
)

UserModel = get_user_model()

ADMIN_ONLY_ERROR = 'Password reset is only available for the administrator account.'


def is_superuser_email(email):
    """Return True only if ``email`` matches an active superuser account."""
    from django.db.models import Q
    superuser = UserModel._default_manager.filter(
        Q(is_superuser=True) & Q(email__iexact=email) & Q(is_active=True)
    ).first()
    return superuser is not None


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class RequestPasswordResetView(APIView):
    """Generate a 5-digit code for the administrator, email it, and store it.

    Only the superuser (administrator) account is allowed to reset its
    password. Any other email is rejected without generating or sending a code.
    """

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RequestPasswordResetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        # Reject the request outright if this is not the administrator email.
        # No code is generated and nothing is emailed.
        if not is_superuser_email(email):
            return Response(
                {'detail': ADMIN_ONLY_ERROR},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = UserModel._default_manager.filter(email__iexact=email).first()
        record = PasswordReset.generate(email)
        send_mail(
            subject='Your Cabinet Medical password reset code',
            message=(
                f'Hello {user.username or user.email},\n\n'
                'You requested to reset your password. Use this 5-digit '
                f'code to confirm your request:\n\n{record.code}\n\n'
                f'The code expires in {PASSWORD_RESET_TTL.seconds // 60} '
                'minutes. If you did not request this, you can ignore this email.'
            ),
            from_email=getattr(
                settings,
                'DEFAULT_FROM_EMAIL',
                'webmaster@localhost',
            ),
            recipient_list=[email],
        )

        return Response(
            {'detail': 'A reset code has been sent to the administrator email.'},
            status=status.HTTP_200_OK,
        )


class ConfirmResetCodeView(APIView):
    """Validate a 5-digit code against the stored reset request."""

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ConfirmResetCodeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        code = serializer.validated_data['code']

        if not is_superuser_email(email):
            return Response(
                {'detail': ADMIN_ONLY_ERROR},
                status=status.HTTP_400_BAD_REQUEST,
            )

        record = PasswordReset.objects.filter(
            email__iexact=email, code=code, is_used=False
        ).first()

        if record is None or record.is_expired:
            return Response(
                {'detail': 'Invalid, already used, or expired code.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response({'detail': 'Code confirmed.'}, status=status.HTTP_200_OK)


class SetPasswordView(APIView):
    """Set a new password once the 5-digit code has been validated."""

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        code = serializer.validated_data['code']
        new_password = serializer.validated_data['new_password']

        if not is_superuser_email(email):
            return Response(
                {'detail': ADMIN_ONLY_ERROR},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = UserModel._default_manager.filter(
            email__iexact=email, is_active=True
        ).first()
        if user is None:
            return Response(
                {'detail': 'No active account found for that email.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # A reset code is single-use, so consuming it here also guards the
        # password change against replays.
        record = PasswordReset.consume(email, code)
        if record is None:
            return Response(
                {'detail': 'Invalid, already used, or expired code.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            password_validation.validate_password(new_password, user=user)
        except Exception as exc:
            return Response(
                {'detail': ' '.join(exc.messages)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(new_password)
        user.save(update_fields=['password'])
        return Response(
            {'detail': 'Password updated successfully.'},
            status=status.HTTP_200_OK,
        )