
from django.contrib import admin
from django.urls import path
from home import views
from django.urls import include
from django.conf.urls.static import static
from django.conf import settings
# import chatting.urls
# import ai.urls
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

urlpatterns = [
    
    path('admin/', admin.site.urls),
    path('home/', include('home.urls')),
    path('chatting/', include('chatting.urls')),
    path('aichat', include('ai.urls')),
    
]




if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
