
from django.contrib import admin
from django.urls import path
from home import views
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    
    path('', views.home, name='home'),
    path('signups/', views.signup, name='signup'),
    path('logins/',views.login,name='login'),
    path('own-profile', views.ownProfile, name='own_profile'),
   
]

