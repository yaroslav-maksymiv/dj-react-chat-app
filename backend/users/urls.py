from django.urls import path

from .views import register_user, MyObtainTokenPairView, get_user, update_user

urlpatterns = [
    path('login/', MyObtainTokenPairView.as_view(), name='user-login'),
    path('register/', register_user, name='user-register'),
    path('me/', get_user, name='get-user'),
    path('update/', update_user, name='update'),
]