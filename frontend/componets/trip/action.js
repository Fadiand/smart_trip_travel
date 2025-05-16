'use server';

import { analyzeTripIntent } from "@/componets/trip/analyzetrip";
import { searchPlacesByTags } from '@/componets/trip/searchplaces';
import { getWeather } from '@/componets/trip/getweather';
import generateDailyItinerary from '@/componets/result/generateDailyItinerary';

export async function createTrip(formData) {
  const tripData = {
    destination: formData.get('destination'),
    startDate: formData.get('startDate'),
    endDate: formData.get('endDate'),
    preferences: formData.get('preferences'),
    budget: formData.get('budget'),
    username: formData.get('username'),
    email: formData.get('email'),
  };

  const weather = await getWeather(tripData.destination);
  if (!weather) {
    throw new Error("Failed to get the weather");
  }
  const tags = await analyzeTripIntent(tripData.destination, tripData.preferences, weather, tripData.startDate , tripData.endDate);
  const tagsWithPlaces = await searchPlacesByTags(tags, tripData.destination);

  const flatPlaces = tagsWithPlaces.flatMap(tag => tag.places);

  const itinerary = generateDailyItinerary(flatPlaces, tripData.startDate, tripData.endDate, weather);

  const response = await fetch('http://localhost:8000/trip/create/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...tripData,
      tags,
      places: flatPlaces,
      weather,
      itinerary
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Server error:", errorText);
    throw new Error("Failed to save trip");
  }

  const data = await response.json();
  console.log(data);

  return {
    ...tripData,
    tags,
    places: flatPlaces,
    weather,
    itinerary,
    success: true
  };
}
