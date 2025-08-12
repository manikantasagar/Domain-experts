from django.db import models
from cloudinary.models import CloudinaryField

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

    image = CloudinaryField('image', folder='coaches/')

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
    following = models.IntegerField(default=0)
    
    def __str__(self):
        return self.name

class Payment(models.Model):
    coach = models.ForeignKey(Coaches, on_delete=models.CASCADE, related_name='payments')
    user = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    months_paid = models.IntegerField(default=1)
    payment_date = models.DateTimeField(auto_now_add=True)
    payment_method = models.CharField(max_length=50, default='card')
    
    def __str__(self):
        return f"{self.user.name} paid {self.amount} for {self.coach.name}"
    
    class Meta:
        ordering = ['-payment_date']
    
    
    
    