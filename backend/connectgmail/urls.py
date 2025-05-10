from django.urls import path
from . import views

urlpatterns = [
    path('google_auth/', views.google_auth, name='google-auth'), 
    path('user_info/', views.get_user_info),

]
