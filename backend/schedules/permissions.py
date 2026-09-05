from rest_framework.permissions import BasePermission


class IsDoctor(BasePermission):
    message = 'Only the doctor can modify the schedule.'

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        return bool(user.is_staff or user.is_superuser)
