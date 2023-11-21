from django.contrib.auth import get_user_model
from django.db.models import Max
from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    DestroyAPIView,
    UpdateAPIView
)
from rest_framework.views import APIView

from ..models import Chat, Message, Contact
from ..views import get_user_contact, get_current_chat
from .serializers import ChatSerializer

User = get_user_model()


class MediaMessageViewSet(viewsets.ViewSet):

    @action(detail=False, methods=['post'], url_path='image')
    def upload_photo(self, request):
        uploading_image = request.FILES['image']

        contact = get_user_contact(request.user.email)
        current_chat = get_current_chat(request.data.get('chatId'))

        message = Message.objects.create(
            sender=contact,
            chat=current_chat,
            content_type='Image',
            photo=uploading_image
        )

        return Response({'messageId': message.id})

    @action(detail=False, methods=['post'], url_path='file')
    def upload_file(self, request):
        uploading_file = request.FILES['file']

        contact = get_user_contact(request.user.email)
        current_chat = get_current_chat(request.data.get('chatId'))

        message = Message.objects.create(
            sender=contact,
            chat=current_chat,
            content_type='File',
            file=uploading_file
        )

        return Response({'messageId': message.id})

    @action(detail=False, methods=['post'], url_path='audio')
    def upload_audio(self, request):
        uploading_audio = request.FILES['audio']

        contact = get_user_contact(request.user.email)
        current_chat = get_current_chat(request.data.get('chatId'))

        message = Message.objects.create(
            sender=contact,
            chat=current_chat,
            content_type='Audio',
            audio=uploading_audio
        )

        return Response({'messageId': message.id})


class ChatListView(ListAPIView):
    serializer_class = ChatSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        queryset = Chat.objects.all()
        user_email = self.request.user.email
        if user_email is not None:
            contact = get_user_contact(user_email)
            queryset = contact.chats.all()
        queryset = queryset.annotate(
            latest_timestamp=Max('message__timestamp')
        )
        queryset = queryset.order_by('-latest_timestamp')
        return queryset


class ChatDetailView(RetrieveAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        chat = self.get_object()
        user = request.user
        contact = Contact.objects.get(user=user)
        if contact not in chat.participants.all():
            return Response({
                'detail': 'You are not a participant in this chat.'
            }, status=status.HTTP_403_FORBIDDEN)
        serializer = ChatSerializer(chat, context={'request': request})
        return Response(serializer.data)


class ChatCreateView(APIView):

    def post(self, request):
        data = request.data
        title = data.get('title')
        is_group_chat = data.get('is_group_chat')
        participants = data.get('participants', [])

        if len(participants) < 2:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        if not is_group_chat:
            existing_chat = Chat.objects.filter(
                is_group_chat=False,
                participants__user__email=participants[0]
            ).filter(participants__user__email=participants[1])

            if existing_chat.exists():
                response_data = {'detail': 'Chat already exists!'}
                return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        chat = Chat()
        if is_group_chat:
            chat.is_group_chat = True
            chat.title = title
        else:
            chat.title = f'{participants[0]} - {participants[1]}'
        chat.save()

        for email in participants:
            contact = get_user_contact(email)
            chat.participants.add(contact)
        chat.save()

        return Response(ChatSerializer(chat, context={'request': request}).data, status=status.HTTP_201_CREATED)


class ChatUpdateView(UpdateAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = (permissions.IsAuthenticated,)


class ChatDeleteView(DestroyAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = (permissions.IsAuthenticated,)
