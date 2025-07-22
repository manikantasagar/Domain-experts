"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
import os
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack
import chatting.urls 

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# application1 = get_asgi_application()

# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chatting.settings')

application = ProtocolTypeRouter({
    'http': get_asgi_application(),  # 2️⃣ Standard HTTP requests
    'websocket': AuthMiddlewareStack(  # 3️⃣ WebSocket handler is defined here
        URLRouter(                    # 4️⃣ WebSocket URLs handled via routing
            chatting.urls .websocket_urlpatterns  # 5️⃣ WebSocket URL patterns come from here
        )
    ),
})
