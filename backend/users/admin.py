from django.contrib import admin
from django.utils.html import format_html


from .models import User


class CustomUserAdmin(admin.ModelAdmin):
    model = User
    list_display = [
        'id', 'email', 'first_name', 'last_name',
        'is_active', 'is_staff', 'is_superuser', 'display_profile_picture'
    ]
    list_display_links = ['id', 'email']
    fields = ['email', 'first_name', 'last_name', 'profile_picture', 'display_profile_picture']
    readonly_fields = ['display_profile_picture']
    ordering = ['id']

    def display_profile_picture(self, obj):
        if obj.profile_picture:
            return format_html('<img src="{}" style="width: 30px; height: 30px;"/>'.format(obj.profile_picture.url)) 
        return '(No picture)'

    display_profile_picture.short_description = 'Profile Picture'

admin.site.register(User, CustomUserAdmin)
