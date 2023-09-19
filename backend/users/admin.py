from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ['id', 'email', 'first_name', 'last_name', 'is_active', 'is_staff', 'is_superuser']
    ordering = ['id']


admin.site.register(User, CustomUserAdmin)