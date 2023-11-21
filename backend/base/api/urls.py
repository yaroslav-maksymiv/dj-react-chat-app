from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    ChatListView,
    ChatDetailView,
    ChatCreateView,
    ChatUpdateView,
    ChatDeleteView,
    MediaMessageViewSet
)

urlpatterns = [
    path('', ChatListView.as_view()),
    path('create/', ChatCreateView.as_view()),
    path('<pk>/', ChatDetailView.as_view()),
    path('<pk>/update/', ChatUpdateView.as_view()),
    path('<pk>/delete/', ChatDeleteView.as_view())
]

router = DefaultRouter()
router.register(r'upload-message', MediaMessageViewSet, basename='upload-message')

urlpatterns += router.urls
