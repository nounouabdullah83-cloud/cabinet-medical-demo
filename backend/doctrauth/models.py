import secrets

from django.contrib.auth import get_user_model
from django.db import models
from django.utils import timezone

UserModel = get_user_model()

PASSWORD_RESET_TTL = timezone.timedelta(minutes=15)


def generate_reset_code():
    """Return a random 5-digit code as a zero-padded string."""
    return f'{secrets.randbelow(100000):05d}'


class PasswordReset(models.Model):
    """A one-time 5-digit code used to confirm a password reset request."""

    email = models.EmailField(db_index=True)
    code = models.CharField(max_length=5)
    is_used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.email} / {self.code}'

    @property
    def is_expired(self):
        return timezone.now() > self.expires_at

    @classmethod
    def generate(cls, email):
        """Create and persist a fresh, non-expired reset code for an email."""
        code = generate_reset_code()
        return cls.objects.create(
            email=email.lower(),
            code=code,
            expires_at=timezone.now() + PASSWORD_RESET_TTL,
        )

    @classmethod
    def consume(cls, email, code):
        """Return a valid, unused, non-expired matching code or None.

        Marks the code as used when it is consumed.
        """
        record = (
            cls.objects
            .filter(email__iexact=email, code=code, is_used=False)
            .first()
        )
        if record is None or record.is_expired:
            return None
        record.is_used = True
        record.save(update_fields=['is_used'])
        return record