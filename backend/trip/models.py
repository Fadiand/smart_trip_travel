from django.db import models
from django.contrib.postgres.fields import JSONField  

class Trip(models.Model):
    username = models.CharField(max_length=100, null = True)
    email = models.CharField(max_length=100 , null = True)
    destination = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()
    preferences = models.TextField()
    budget = models.IntegerField(null=True, blank=True)

    places = models.JSONField(null=True)     
    weather = models.JSONField()   
    itinerary = models.JSONField(null=True) 

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.destination} ({self.start_date} - {self.end_date})"

    class Meta:
        db_table = 'Trips'    
