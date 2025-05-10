from django.contrib import admin
from .models import Trip

@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ('username','email','destination','preferences', 'start_date', 'end_date', 'budget' , 'places','weather' , 'itinerary')
