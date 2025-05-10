from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('trip/', include('trip.urls')),
    path('auth/', include('connectgmail.urls')), 
    path('auth/registration/', include('dj_rest_auth.registration.urls')),
    path('social/', include('allauth.socialaccount.urls')),  
]
    