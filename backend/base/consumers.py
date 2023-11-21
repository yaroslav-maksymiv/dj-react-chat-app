import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

from .views import get_user_contact, get_current_chat, get_messages
from .models import Message
from .api.serializers import ContactBaseSerializer
from .serializers import MessageBaseSerializer


class ChatConsumer(WebsocketConsumer):

    # handle fetching messages to user
    def fetch_messages(self, data):
        messages = get_messages(data['chatId'], data['page'], data['messagesPerPage'])
        content = {
            'command': 'messages',
            'messages': MessageBaseSerializer(messages, many=True).data
        }
        self.send_message(content)

    # send new message to group
    def new_message(self, data):
        user_contact = get_user_contact(data['from'])
        current_chat = get_current_chat(data['chatId'])

        self.room_group_name = f'chat_{current_chat.id}'

        message = Message.objects.create(
            sender=user_contact,
            content_type=data['contentType'],
            text=data['text'],
            chat=current_chat
        )

        content = {
            'command': 'new_message',
            'message': MessageBaseSerializer(message).data
        }
        return self.send_chat_message(content)

    def new_file_message(self, data):
        message_id = data['messageId']
        message = Message.objects.get(id=message_id)
        current_chat = get_current_chat(data['chatId'])

        self.room_group_name = f'chat_{current_chat.id}'

        content = {
            'command': 'new_message',
            'message': MessageBaseSerializer(message).data
        }
        return self.send_chat_message(content)

    def user_typing(self, data):
        user_contact = get_user_contact(data['from'])
        status = bool(data['status'])
        user_contact_data = ContactBaseSerializer(user_contact).data
        current_chat = get_current_chat(data['chatId'])

        self.room_group_name = f'chat_{current_chat.id}'

        content = {
            'command': 'user_typing',
            'data': {
                'from': user_contact_data,
                'status': status,
                'chatId': current_chat.id
            }
        }
        return self.send_chat_message(content)

    commands = {
        'fetch_messages': fetch_messages,
        'new_message': new_message,
        'new_file_message': new_file_message,
        'user_typing': user_typing,
    }

    def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f'chat_{self.room_name}'

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name)
        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name)

    def receive(self, text_data):
        data = json.loads(text_data)
        self.commands[data['command']](self, data)

    # sends message only to current user
    def send_message(self, message):
        self.send(text_data=json.dumps(message))

    # sends message withing a whole group
    def send_chat_message(self, message):
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name, {
                'type': 'chat_message',
                'message': message
            }
        )

    def chat_message(self, event):
        message = event['message']
        self.send(text_data=json.dumps(message))
