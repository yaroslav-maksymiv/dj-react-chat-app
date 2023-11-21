from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.core.files.base import ContentFile
import base64

from base.models import Contact

from .serializers import CustomUserSerializer, CustomUserSerializerWithToken, MyTokenObtainPairSerializer

User = get_user_model()


@api_view(['POST'])
def update_user(request):
    data = request.data
    avatar_data = data.get('avatar')

    try:
        user = User.objects.get(email=request.user.email)
        if 'first_name' in data:
            user.first_name = data['first_name']
        if 'last_name' in data:
            user.last_name = data['last_name']
        if avatar_data:
            format, imgstr = avatar_data.split(';base64,')
            ext = format.split('/')[-1]
            avatar = ContentFile(base64.b64decode(imgstr), name=f"avatar.{ext}")
            user.profile_picture = avatar
        user.save()
        return Response(CustomUserSerializer(user).data)
    except Exception as e:
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_user(request):
    current_user = request.user
    print(current_user)
    user_email = request.query_params.get('email')
    users = User.objects.filter(email__icontains=user_email).exclude(email=current_user.email)
    return Response(CustomUserSerializer(users, many=True).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_user(request):
    user_email = request.query_params.get('email')
    if user_email:
        user = get_object_or_404(User, email=user_email)
        print(user)
    else:
        user = request.user
    return Response(CustomUserSerializer(user).data)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    data = request.data

    required_fields = ('email', 'password', 'firstName', 'lastName')
    for req_field in required_fields:
        if req_field not in data or not data[req_field]:
            return Response({'detail': f'{req_field} is required'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=data.get('email')).exists():
        return Response({'detail': 'User with this email already exists'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.create(
            email=data.get('email'),
            password=make_password(data.get('password')),
            first_name=data.get('firstName'),
            last_name=data.get('lastName')
        )
        Contact.objects.create(user=user)
        serialized_data = CustomUserSerializerWithToken(user).data
        return Response(serialized_data)
    except Exception as _:
        return Response(status=status.HTTP_400_BAD_REQUEST)


class MyObtainTokenPairView(TokenObtainPairView):
    permission_classes = (AllowAny,)
    serializer_class = MyTokenObtainPairSerializer
