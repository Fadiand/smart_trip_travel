from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from google.oauth2 import id_token
from google.auth.transport.requests import Request
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from trip.models import Trip
from decouple import config
import json
from datetime import date
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

User = get_user_model()


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    user = request.user
    return Response({
        'username': user.username,
        'email': user.email,
    })


def generate_jwt_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

@csrf_exempt
def google_auth(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    try:
        data = json.loads(request.body)
        token = data.get('token')
        print("🔐 Received token from React:", token[:30], "...")

        # טען את ה־CLIENT_ID עם הדפסה
        google_client_id = config('GOOGLE_CLIENT_ID')
        print("✅ Loaded GOOGLE_CLIENT_ID:", google_client_id)

        # אימות מול Google
        idinfo = id_token.verify_oauth2_token(token, Request(), google_client_id)

        email = idinfo.get('email')
        name = idinfo.get('name')
        print("👤 Google user info:", email, name)

        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'username': name,
                'is_active': True,
                'password': '',
            }
        )

        if not created:
            user.username = name
            user.save()

        tokens = generate_jwt_for_user(user)

        return JsonResponse({
            'message': 'Login successful',
            'email': user.email,
            'username': user.username,
            'access_token': tokens['access'],
            'refresh_token': tokens['refresh']
        })

    except ValueError:
        print("❌ Invalid Google token")
        return JsonResponse({'error': 'Invalid Google token'}, status=400)

    except Exception as e:
        print("❌ Unexpected error:", e)
        return JsonResponse({'error': str(e)}, status=500)
