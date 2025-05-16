# trip/urls.py
from django.urls import path
from .views import create_trip,get_trip_by_username  

urlpatterns = [
    path('create/', create_trip, name='create_trip'),
    path('by-username/', get_trip_by_username, name='get_trip_by_username'),  
]


