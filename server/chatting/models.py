import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass  # No group to discard

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get('message', '')
        username = data.get('username', 'Anonymous')

        # Just echo the message back to the same socket
        await self.send(text_data=json.dumps({
            'message': message,
            'username': username,
        }))
