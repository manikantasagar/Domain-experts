from django.shortcuts import render
import matplotlib.pyplot as plt
from io import BytesIO
from django.http import HttpResponse
from .models import Coaches
from django.contrib import admin
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from django.contrib.auth.hashers import make_password
import jwt
from django.conf import settings
from django.contrib.auth.hashers import check_password

# admin.site.register(Coaches)   
# Create your views here.
def home(request):
    coaches = Coaches.objects.all()
    coaches_data = []
    for coach in coaches:
        coach_data = {
            'id': coach.id,
            'name': coach.name,
            'email': coach.email,
            'phone': coach.phone,
            'image': coach.image.url,
            'address': coach.address,
            'city': coach.city,
            'state': coach.state,
            'zip': coach.zip,
            'country': coach.country,
            'domain': coach.domain,
            'experience': coach.experience,
            'location': coach.location,
            'price': coach.price,
            'rating': coach.rating,
            'reviews': coach.reviews,
            'availability': coach.availability,
            'availability_days': coach.availability_days,
            'connections': coach.connections,
            'followers': coach.followers,
            'following': coach.following,
            'description': coach.description,
        }
        coaches_data.append(coach_data)

    return JsonResponse(coaches_data, safe=False)


@csrf_exempt
@require_http_methods(["POST"])
def signup(request):
    try:
        data = json.loads(request.body)
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        domain = data.get('domain')
        if not all([name, email, password, domain]):
            return JsonResponse({'error': 'All fields are required.'}, status=400)
        # Check if email already exists
        if Coaches.objects.filter(email=email).exists():
            return JsonResponse({'error': 'Email already registered.'}, status=400)
        coach = Coaches(
            name=name,
            email=email,
            password=make_password(password),
            domain=domain,
            phone='', address='', city='', state='', zip='', country='', experience=0, location='', price=0, rating=0.0, reviews=0, availability=True, availability_days='', image=None, connections=0, followers=0, following=0, description=''
        )
        coach.save()
        return JsonResponse({'success': True, 'id': coach.id})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def login(request):
    try:
        data = json.loads(request.body)
        email = data.get('email')
        # print("maniiiii")
        password = data.get('password')
        if not all([email, password]):
            return JsonResponse({'error': 'Email and password required.'}, status=400)
        try:
            coach = Coaches.objects.get(email=email)
        except Coaches.DoesNotExist:
            return JsonResponse({'error': 'Invalid credentials.'}, status=401)
        if not check_password(password, coach.password):
            return JsonResponse({'error': 'Invalid credentials.'}, status=401)
        payload = {
            'id': coach.id,
            'email': coach.email,
            'name': coach.name
        }
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
        return JsonResponse({'token': token})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    



@csrf_exempt

def ownProfile(request):
    email = request.GET.get('email')
    if not email:
        return JsonResponse({'error': 'Email is required'}, status=400)

    try:
        coach = Coaches.objects.get(email=email)
    except Coaches.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)

    if request.method == 'GET':
        data = {
            'name': coach.name,
            'email': coach.email,
            'phone': coach.phone,
            'image': coach.image.url ,
            'address': coach.address,
            'city': coach.city,
            'state': coach.state,
            'zip': coach.zip,
            'country': coach.country,
            'domain': coach.domain,
            'experience': coach.experience,
            'location': coach.location,
            'price': coach.price,
            'rating': coach.rating,
            'reviews': coach.reviews,
            'availability': coach.availability,
            'availability_days': coach.availability_days,
            'connections': coach.connections,
            'followers': coach.followers,
            'following': coach.following,
            'description': coach.description,
        }
        return JsonResponse(data)

    elif request.method == 'POST':
        try:
            body = json.loads(request.body)
        except Exception:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        # Update fields if present
        for field in ['name', 'phone', 'address', 'city', 'state', 'zip', 'country',
                      'domain', 'experience', 'location', 'price', 'rating', 'reviews',
                      'availability', 'availability_days', 'connections',
                      'followers', 'following', 'description']:
            if field in body:
                setattr(coach, field, body[field])

        # Optional: handle image update (if using base64 or file upload, you must adjust this)
        # For JSON body, image upload won't work unless it's a URL or base64

        coach.save()
        return JsonResponse({'success': True})

    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
