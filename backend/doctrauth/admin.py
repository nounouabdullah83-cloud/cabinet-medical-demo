from django.contrib import admin

from .models import PasswordReset


@admin.register(PasswordReset)
class PasswordResetAdmin(admin.ModelAdmin):
    list_display = ('email', 'code', 'is_used', 'created_at', 'expires_at')
    list_filter = ('is_used', 'created_at')
    search_fields = ('email', 'code')
    readonly_fields = ('email', 'code', 'is_used', 'created_at', 'expires_at')