from django.urls import re_path, path
from . import models, views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

websocket_urlpatterns = [
 path("ws/chat/<str:other_user_email>/", models.ChatConsumer.as_asgi()),
]

urlpatterns = [
    path('chat/users/', views.get_users, name='get_users'),
]
