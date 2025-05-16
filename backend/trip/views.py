from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Trip
import json
from django.views.decorators.csrf import csrf_exempt



@api_view(['POST'])
@csrf_exempt
def create_trip(request):
    data = request.data

    try:
        email = data.get('email')
        username = data.get('username')
        places = json.loads(data.get('places', '[]')) if isinstance(data.get('places'), str) else data.get('places', [])
        weather = json.loads(data.get('weather', '{}')) if isinstance(data.get('weather'), str) else data.get('weather', {})
        itinerary = json.loads(data.get('itinerary', '[]')) if isinstance(data.get('itinerary'), str) else data.get('itinerary', [])

        # אם יש שורת Trip קיימת עבור המשתמש – עדכן אותה
        trip, created = Trip.objects.update_or_create(
            email=email,
            defaults={
                'username': username,
                'destination': data['destination'],
                'start_date': data['startDate'],
                'end_date': data['endDate'],
                'preferences': data.get('preferences'), 
                'budget': data.get('budget'),
                'places': places,
                'weather': weather,
                'itinerary': itinerary,
            }
        )

        return Response({'id': trip.id, 'status': 'updated' if not created else 'created'}, status=status.HTTP_201_CREATED)

    except KeyError as e:
        return Response({'error': f'Missing field: {e}'}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_trip_by_username(request):
    username = request.query_params.get('username')
    if not username:
        return Response({"error": "Username is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        trip = Trip.objects.filter(username=username).order_by('-id').first()
        if not trip:
            return Response({"error": "No trip found for this user"}, status=status.HTTP_404_NOT_FOUND)

        trip_data = {
            "destination": trip.destination,
            "startDate": trip.start_date,
            "endDate": trip.end_date,
            "preferences": trip.preferences,  # ✅ נוספה השורה
            "budget": trip.budget,
            "places": trip.places,
            "weather": trip.weather,
            "tags": trip.tags if hasattr(trip, 'tags') else [],
            "itinerary": trip.itinerary if hasattr(trip, 'itinerary') else [],
            "success": True
        }
        return Response(trip_data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
