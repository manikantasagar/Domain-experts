from django.shortcuts import render
import matplotlib.pyplot as plt
from io import BytesIO
from django.http import HttpResponse
from .models import Coaches, Users, Payment
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
            'image': coach.image.url if coach.image else None,
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
def signup_user(request):
    try:
        print("Received signup_user request")
        data = json.loads(request.body)
        print("Request data:", data)
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        
        print(f"Parsed data - name: {name}, email: {email}")
        
        if not all([name, email, password]):
            print("Missing required fields")
            return JsonResponse({'error': 'Name, email and password are required.'}, status=400)
        
        # Check if email already exists
        if Users.objects.filter(email=email).exists():
            print("Email already exists")
            return JsonResponse({'error': 'Email already registered.'}, status=400)
        
        user = Users(
            name=name,
            email=email,
            password=make_password(password)
        )
        user.save()
        print(f"User saved successfully with ID: {user.id}")
        return JsonResponse({'success': True, 'id': user.id})
    except Exception as e:
        print(f"Error in signup_user: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def login(request):
    try:
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        print(f"Login attempt for email: {email}")
        
        if not all([email, password]):
            return JsonResponse({'error': 'Email and password required.'}, status=400)
        
        # First try to find a coach
        try:
            coach = Coaches.objects.get(email=email)
            if check_password(password, coach.password):
                payload = {
                    'id': coach.id,
                    'email': coach.email,
                    'name': coach.name,
                    'user_type': 'coach'
                }
                token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
                print(f"Coach login successful: {coach.name}")
                return JsonResponse({'token': token, 'user_type': 'coach'})
            else:
                return JsonResponse({'error': 'Invalid credentials.'}, status=401)
        except Coaches.DoesNotExist:
            # If not a coach, try to find a user
            try:
                user = Users.objects.get(email=email)
                if check_password(password, user.password):
                    payload = {
                        'id': user.id,
                        'email': user.email,
                        'name': user.name,
                        'user_type': 'user'
                    }
                    token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
                    print(f"User login successful: {user.name}")
                    return JsonResponse({'token': token, 'user_type': 'user'})
                else:
                    return JsonResponse({'error': 'Invalid credentials.'}, status=401)
            except Users.DoesNotExist:
                return JsonResponse({'error': 'Invalid credentials.'}, status=401)
    except Exception as e:
        print(f"Login error: {str(e)}")
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
            'image': coach.image.url  if coach.image else None ,
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
            print("Received update data:", body)  # Debug print
            
            # Validate required fields
            allowed_fields = ['name', 'phone', 'address', 'city', 'state', 'zip', 
                            'country', 'domain', 'experience', 'location', 'price', 
                            'availability', 'availability_days', 'description']
            
            update_data = {k: v for k, v in body.items() if k in allowed_fields}
            
            # Update only provided fields
            for field, value in update_data.items():
                setattr(coach, field, value)
            
            coach.save()
            return JsonResponse({
                'success': True,
                'message': 'Profile updated successfully',
                'updated_fields': list(update_data.keys())
            })
            
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
        except Exception as e:
            print(f"Profile update error: {str(e)}")  # Debug print
            return JsonResponse({
                'error': 'Failed to update profile',
                'detail': str(e)
            }, status=500)

    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
def userProfile(request):
    email = request.GET.get('email')
    if not email:
        return JsonResponse({'error': 'Email is required'}, status=400)

    try:
        user = Users.objects.get(email=email)
    except Users.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)

    if request.method == 'GET':
        data = {
            'name': user.name,
            'email': user.email,
            'created_at': user.created_at,
        }
        return JsonResponse(data)

    elif request.method == 'POST':
        try:
            body = json.loads(request.body)
        except Exception:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        # Update fields if present
        for field in ['name']:
            if field in body:
                setattr(user, field, body[field])

        user.save()
        return JsonResponse({'success': True})

    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
@require_http_methods(["POST"])
def make_payment(request):
    try:
        data = json.loads(request.body)
        coach_id = data.get('coach_id')
        user_id = data.get('user_id')
        amount = data.get('amount')
        payment_method = data.get('payment_method', 'card')
        
        if not all([coach_id, user_id, amount]):
            return JsonResponse({'error': 'Coach ID, user ID, and amount are required.'}, status=400)
        
        try:
            coach = Coaches.objects.get(id=coach_id)
            user = Users.objects.get(id=user_id)
        except (Coaches.DoesNotExist, Users.DoesNotExist):
            return JsonResponse({'error': 'Coach or user not found.'}, status=404)
        
        # Calculate months based on amount and coach price
        if coach.price == 0:
            months_paid = 1  # Free coaching for 1 month
        else:
            months_paid = int(amount / coach.price)
        
        payment = Payment.objects.create(
            coach=coach,
            user=user,
            amount=amount,
            months_paid=months_paid,
            payment_method=payment_method
        )
        
        return JsonResponse({
            'success': True,
            'payment_id': payment.id,
            'months_paid': months_paid,
            'message': f'Payment successful! {months_paid} month(s) of coaching purchased.'
        })
        
    except Exception as e:
        print(f"Payment error: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
def get_payment_stats(request):
    coach_id = request.GET.get('coach_id')
    if not coach_id:
        return JsonResponse({'error': 'Coach ID is required'}, status=400)
    
    try:
        coach = Coaches.objects.get(id=coach_id)
    except Coaches.DoesNotExist:
        return JsonResponse({'error': 'Coach not found'}, status=404)
    
    # Get monthly payment data for the last 12 months
    from datetime import datetime, timedelta
    from django.db.models import Sum
    from django.utils import timezone
    
    current_date = timezone.now()
    monthly_data = []
    
    for i in range(12):
        month_start = current_date.replace(day=1) - timedelta(days=30*i)
        month_end = month_start.replace(day=28) + timedelta(days=4)
        month_end = month_end.replace(day=1) - timedelta(days=1)
        
        monthly_payments = Payment.objects.filter(
            coach=coach,
            payment_date__gte=month_start,
            payment_date__lte=month_end
        ).aggregate(total_amount=Sum('amount'), total_months=Sum('months_paid'))
        
        monthly_data.append({
            'month': month_start.strftime('%Y-%m'),
            'amount': float(monthly_payments['total_amount'] or 0),
            'months_paid': int(monthly_payments['total_months'] or 0)
        })
    
    # Calculate coach stability metrics
    total_payments = Payment.objects.filter(coach=coach).count()
    total_revenue = Payment.objects.filter(coach=coach).aggregate(Sum('amount'))['amount__sum'] or 0
    avg_monthly_revenue = total_revenue / 12 if total_revenue > 0 else 0
    
    return JsonResponse({
        'monthly_data': monthly_data,
        'total_payments': total_payments,
        'total_revenue': float(total_revenue),
        'avg_monthly_revenue': float(avg_monthly_revenue),
        'coach_price': float(coach.price)
    })


@csrf_exempt
@require_http_methods(["POST"])
def connect_coach(request):
    try:
        data = json.loads(request.body)
        coach_id = data.get('coach_id')
        user_email = data.get('user_email')
        
        if not all([coach_id, user_email]):
            return JsonResponse({'error': 'Coach ID and user email are required.'}, status=400)
        
        try:
            coach = Coaches.objects.get(id=coach_id)
            user = Coaches.objects.get(email=user_email)  # Only coaches can connect
        except Coaches.DoesNotExist:
            return JsonResponse({'error': 'Coach or user not found.'}, status=404)
        
        # Update connections for both coaches
        coach.connections += 1
        user.connections += 1
        coach.save()
        user.save()
        
        return JsonResponse({
            'success': True,
            'message': f'Connected with {coach.name}',
            'connections': coach.connections
        })
        
    except Exception as e:
        print(f"Connect error: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def follow_user(request):
    try:
        data = json.loads(request.body)
        coach_id = data.get('coach_id')
        user_email = data.get('user_email')
        
        if not all([coach_id, user_email]):
            return JsonResponse({'error': 'Coach ID and user email are required.'}, status=400)
        
        try:
            coach = Coaches.objects.get(id=coach_id)
            user = Users.objects.get(email=user_email)  # Users can follow coaches
        except (Coaches.DoesNotExist, Users.DoesNotExist):
            return JsonResponse({'error': 'Coach or user not found.'}, status=404)
        
        # Update followers for coach and following for user
        coach.followers += 1
        user.following += 1
        coach.save()
        user.save()
        
        return JsonResponse({
            'success': True,
            'message': f'Now following {coach.name}',
            'followers': coach.followers
        })
        
    except Exception as e:
        print(f"Follow error: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)


# @csrf_exempt
# def chart(request):
    
