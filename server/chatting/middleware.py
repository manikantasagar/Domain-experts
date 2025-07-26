from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from home.models import Coaches
import jwt
from django.conf import settings
import django
import os

# Ensure Django is configured
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import AnonymousUser

@database_sync_to_async
def get_user(validated_token):
    try:
        return Coaches.objects.get(email=validated_token['email'])
    except Coaches.DoesNotExist:
        return None

class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        query_string = parse_qs(scope["query_string"].decode())
        token = query_string.get("token")

        if token:
            try:
                # Decode the custom JWT token
                validated_token = jwt.decode(token[0], settings.SECRET_KEY, algorithms=['HS256'])
                scope["user"] = await get_user(validated_token)
                if scope["user"] is None:
                    scope["user"] = AnonymousUser()
            except (jwt.InvalidTokenError, jwt.DecodeError, jwt.ExpiredSignatureError):
                scope["user"] = AnonymousUser()
        else:
            scope["user"] = AnonymousUser()

        return await super().__call__(scope, receive, send)
