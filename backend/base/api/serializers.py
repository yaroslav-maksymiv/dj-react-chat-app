from rest_framework import serializers

from users.serializers import CustomUserSerializer
from ..models import Chat, Contact, Message
from ..serializers import MessageBaseSerializer


class ContactBaseSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()

    class Meta:
        model = Contact
        fields = ('id', 'user')


class MessageSerializer(serializers.ModelSerializer):
    sender = ContactBaseSerializer()

    class Meta:
        model = Message
        fields = ('id', 'chat', 'sender', 'content_type', 'text', 'photo', 'file', 'audio', 'timestamp')


class ChatSerializer(serializers.ModelSerializer):
    participants = ContactBaseSerializer(many=True)
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = Chat
        fields = ('id', 'last_message', 'participants', 'is_group_chat', 'title', 'created_at')
        read_only = ('id', 'created_at')

    def get_last_message(self, obj):
        current_user_email = self.context['request'].user.email
        try:
            message = obj.message_set.all().latest('timestamp')
            # message = obj.message_set.exclude(sender__user__email=current_user_email).latest('timestamp')
            serialized_message = MessageBaseSerializer(message).data
        except Message.DoesNotExist:
            serialized_message = {'content_type': 'Text', 'text': 'No messages from user yet ;('}
        return serialized_message
    
    def to_representation(self, instance):
        current_user_email = self.context['request'].user.email

        participants = instance.participants.exclude(user__email=current_user_email)
        participants_data = ContactBaseSerializer(participants, many=True).data

        chat_data = super().to_representation(instance)
        chat_data['participants'] = participants_data

        return chat_data
    

