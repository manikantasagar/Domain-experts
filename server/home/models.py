from django.db import models

# Create your models here.
class Coaches(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    password = models.CharField(max_length=128)
    phone = models.CharField(max_length=100)
    address = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    domain = models.CharField(max_length=100)
    experience = models.IntegerField()
    location = models.CharField(max_length=100)
    price = models.IntegerField()
    rating = models.FloatField()
    reviews = models.IntegerField()
    availability = models.BooleanField()
    availability_days = models.CharField(max_length=100)

    image = models.ImageField(upload_to='coaches/')

    connections=models.IntegerField()
    followers=models.IntegerField()
    following=models.IntegerField()
    

    description = models.TextField()
    def __str__(self):
        return self.name

class Users(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100, unique=True)
    password = models.CharField(max_length=128)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
    
    
    
    