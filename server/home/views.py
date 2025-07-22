from django.shortcuts import render
import matplotlib.pyplot as plt
from io import BytesIO
from django.http import HttpResponse
from .models import Coaches
from django.contrib import admin
from django.http import JsonResponse

admin.site.register(Coaches)   
# Create your views here.
def home(request):
    coaches = Coaches.objects.all().values()

    return JsonResponse(list(coaches), safe=False)


