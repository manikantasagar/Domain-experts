import json
from channels.generic.websocket import AsyncWebsocketConsumer
from home.models import Coaches
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        self.other_user_email = self.scope["url_route"]["kwargs"]["other_user_email"]

        # Check if user is authenticated (not AnonymousUser)
        if isinstance(self.user, AnonymousUser):
            print("WebSocket connection rejected: Anonymous user")
            await self.close()
            return

        # Get the other user by email
        self.other_user = await self.get_user_by_email(self.other_user_email)
        if not self.other_user:
            print(f"WebSocket connection rejected: Other user {self.other_user_email} not found")
            await self.close()
            return

        # Deterministic room ID (sorted)
        ids = sorted([str(self.user.id), str(self.other_user.id)])
        self.room_group_name = f"chat_{ids[0]}_{ids[1]}"

        print(f"WebSocket connection accepted: {self.user.email} -> {self.other_user_email}")
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    @database_sync_to_async
    def get_user_by_email(self, email):
        try:
            return Coaches.objects.get(email=email)
        except Coaches.DoesNotExist:
            return None

    async def disconnect(self, close_code):
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_content = data["message"]
        
        print(f"Received message from {self.user.email}: {message_content}")
        
        # No database storage - just broadcast the message
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message_content,
                "sender": str(self.user.id),
                "sender_email": self.user.email,
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "sender": event["sender"],
            "sender_email": event["sender_email"],
        }))
