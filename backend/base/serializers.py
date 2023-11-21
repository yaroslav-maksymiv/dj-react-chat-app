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


class MessageBaseSerializer(serializers.ModelSerializer):
    sender = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    file = serializers.SerializerMethodField()
    audio = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ('id', 'chat', 'sender', 'content_type', 'timestamp', 'text', 'image', 'file', 'audio')

    def get_sender(self, obj):
        return obj.sender.user.email

    @staticmethod
    def get_file_data(file_field):
        file_data = {
            'url': file_field.url if file_field else None,
            'filename': file_field.name.split('/')[-1] if file_field else None,
            'size': file_field.size if file_field else None
        }
        return file_data

    def get_image(self, obj):
        return self.get_file_data(obj.photo)

    def get_file(self, obj):
        return self.get_file_data(obj.file)

    def get_audio(self, obj):
        return self.get_file_data(obj.audio)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['timestamp'] = str(data['timestamp'])
        return data
