import re

from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

UserModel = get_user_model()

CODE_PATTERN = re.compile(r'^\d{5}$')


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    def validate(self, attrs):
        email = attrs.get('email', '').strip()
        password = attrs.get('password', '')

        user = UserModel._default_manager.filter(email__iexact=email, is_active=True).first()
        if user is None or not user.check_password(password):
            raise serializers.ValidationError(
                'No active account found with the given credentials',
                code='no_active_account',
            )

        self.user = user
        refresh = self.get_token(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'email': user.email,
                'username': user.username,
            },
        }


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ['id', 'username', 'email']


class RequestPasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        return value.strip().lower()


class ConfirmResetCodeSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=5)

    def validate_email(self, value):
        return value.strip().lower()

    def validate_code(self, value):
        value = value.strip()
        if not CODE_PATTERN.fullmatch(value):
            raise serializers.ValidationError('The code must be 5 digits.')
        return value


class SetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=5)
    new_password = serializers.CharField(write_only=True)

    def validate_email(self, value):
        return value.strip().lower()

    def validate_code(self, value):
        value = value.strip()
        if not CODE_PATTERN.fullmatch(value):
            raise serializers.ValidationError('The code must be 5 digits.')
        return value

    def validate_new_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError(
                'Password must be at least 8 characters long.'
            )
        return value