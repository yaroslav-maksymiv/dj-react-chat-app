from django.contrib import admin
from .models import Contact, Chat, Message


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('user',) 


@admin.register(Chat)
class ChatAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_group_chat', 'created_at')  


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('chat', 'sender', 'content_type', 'timestamp') 

