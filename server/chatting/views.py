from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from home.models import Coaches
from django.contrib.auth.models import AnonymousUser
import jwt
from django.conf import settings
from functools import wraps

def get_user_from_token(request):
    """Extract user from custom JWT token"""
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        print("No Authorization header or invalid format")
        return None
    
    token = auth_header.split(' ')[1]
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        print(f"Token payload: {payload}")
        user = Coaches.objects.get(email=payload['email'])
        print(f"Found user: {user.email}")
        return user
    except (jwt.InvalidTokenError, jwt.DecodeError, jwt.ExpiredSignatureError) as e:
        print(f"JWT error: {e}")
        return None
    except Coaches.DoesNotExist as e:
        print(f"User not found: {e}")
        return None

def custom_auth_required(view_func):
    """Custom decorator for JWT authentication"""
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        user = get_user_from_token(request)
        if user is None:
            print("Authentication failed")
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        request.user = user
        print(f"Authentication successful for user: {user.email}")
        return view_func(request, *args, **kwargs)
    return wrapper

@api_view(['GET'])
@custom_auth_required
def get_users(request):
    """
    Get list of all users for chat
    """
    try:
        users = Coaches.objects.exclude(id=request.user.id)
        user_list = []
        for user in users:
            user_list.append({
                'id': user.id,
                'email': user.email,
                'name': user.name,
            })
        
        return Response({'users': user_list})
        
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
