from django.urls import re_path
from . import models

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<room_name>\w+)/$', models.ChatConsumer.as_asgi()),
]
