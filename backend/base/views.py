from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404

from .models import Chat, Contact

User = get_user_model()


def get_last_20_messages(chat_id):
    chat = get_object_or_404(Chat, id=chat_id)
    chat_messages = chat.message_set.order_by('-timestamp').all()[:20]
    return chat_messages


def get_messages(chat_id, page, messages_per_page):
    chat = get_object_or_404(Chat, id=chat_id)
    offset = (page - 1) * messages_per_page
    limit = offset + messages_per_page
    chat_messages = chat.message_set.order_by('-timestamp')[offset:limit]
    return chat_messages


def get_user_contact(email):
    user = get_object_or_404(User, email=email)
    return get_object_or_404(Contact, user=user)


def get_current_chat(chatId):
    return get_object_or_404(Chat, id=chatId)
