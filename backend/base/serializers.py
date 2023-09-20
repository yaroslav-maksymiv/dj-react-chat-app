from rest_framework import serializers

from .models import Contact, Chat, Message
from users.serializers import CustomUserSerializer


class ContactSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()
    
    class Meta:
        model = Contact
        fields = ('id', 'user', 'friends', 'blocked')


class ChatSerializer(serializers.ModelSerializer):
    participants = ContactSerializer(many=True)

    class Meta:
        model = Chat
        fields = ('id', 'participants', 'created_at', 'title', 'is_group_chat')


class MessageSerializer(serializers.ModelSerializer):
    chat = ChatSerializer()
    sender = ContactSerializer()

    class Meta:
        model = Message
        fields = ('id', 'chat', 'sender', 'content_type', 'text', 'photo', 'file', 'audio', 'timestamp')