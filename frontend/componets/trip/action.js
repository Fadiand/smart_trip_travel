'use server';

import { analyzeTripIntent } from "@/componets/trip/analyzetrip";
import { searchPlacesByTags } from '@/componets/trip/searchplaces';
import { getWeather } from '@/componets/trip/getweather';


export async function createTrip(formData) {
  const tripData = {
    destination: formData.get('destination'),
    startDate: formData.get('startDate'),
    endDate: formData.get('endDate'),
    preferences: formData.get('preferences'),
    budget: formData.get('budget'),
  };

  const tags = await analyzeTripIntent(tripData.destination, tripData.preferences);
  const places = await searchPlacesByTags(tags, tripData.destination);
  const weather = await getWeather(tripData.destination);

  console.log(places);
  console.log(tags);
  console.log(tripData);


  const response = await fetch('http://localhost:8000/trip/create/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...tripData,
      tags,
      places,
      weather,
      itinerary: [],
    })
    
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Server error:", errorText);
    throw new Error("Failed to save trip");
  }
  
  const data = await response.json();
  console.log(data);

  // החזרה ל־useFormState (הודעת הצלחה)
  return {
    ...tripData,
    tags,
    places,
    weather,
    success: true
  };
  
}
