from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny, IsAuthenticated

from .serializers import CustomUserSerializer, CustomUserSerializerWithToken, MyTokenObtainPairSerializer

User = get_user_model()


@api_view(['GET'])
@permission_classes([AllowAny])
def get_user(request):
    user = request.user
    return CustomUserSerializer(user).data


@api_view(['POST'])
def register_user(request):
    data = request.data
    try:
        user = User.objects.create(
            email=data.get('email'),
            password=make_password(data.get('password')),
            first_name=data.get('firstName'),
            last_name=data.get('lastName')
        )
        serialized_data = CustomUserSerializerWithToken(user).data
        return Response(serialized_data)
    except Exception as _:
        return Response(status=status.HTTP_400_BAD_REQUEST)


class MyObtainTokenPairView(TokenObtainPairView):
    permission_classes = (AllowAny,)
    serializer_class = MyTokenObtainPairSerializer