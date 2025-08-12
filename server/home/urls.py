
from django.contrib import admin
from django.urls import path
from home import views
from django.http import JsonResponse
from django.contrib.auth.models import User
# from django.conf.urls import include
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    
    path('', views.home, name='home'),
    path('signups/', views.signup, name='signup'),
    path('signups_user/', views.signup_user, name='signup_user'),
    path('logins/',views.login,name='login'),
    path('own-profile', views.ownProfile, name='own_profile'),
    path('user-profile', views.userProfile, name='user_profile'),
    path('make-payment/', views.make_payment, name='make_payment'),
    path('payment-stats/', views.get_payment_stats, name='get_payment_stats'),
    path('connect-coach/', views.connect_coach, name='connect_coach'),
    path('follow-user/', views.follow_user, name='follow_user'),
    path('test-cloudinary/', views.test_cloudinary_upload, name='test_cloudinary_upload'),
    path('admin/', admin.site.urls),
    # path('chart',views.chart,name='chart')
] 

