from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Trip
import json

@api_view(['POST'])
def create_trip(request):
    data = request.data

    printf(data);

    try:
        places = json.loads(data.get('places', '[]')) if isinstance(data.get('places'), str) else data.get('places', [])
        weather = json.loads(data.get('weather', '{}')) if isinstance(data.get('weather'), str) else data.get('weather', {})
        itinerary = json.loads(data.get('itinerary', '[]')) if isinstance(data.get('itinerary'), str) else data.get('itinerary', [])

        trip = Trip.objects.create(
            destination=data['destination'],
            start_date=data['startDate'],
            end_date=data['endDate'],
            preferences=data['preferences'],
            budget=data.get('budget'),
            places=places,
            weather=weather,
            itinerary=itinerary
        )

        printf(trip);

        return Response({'id': trip.id, 'status': 'saved'}, status=status.HTTP_201_CREATED)

    except KeyError as e:
        return Response({'error': f'Missing field: {e}'}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
