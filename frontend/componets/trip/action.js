'use server';

import { analyzeTripIntent } from "@/componets/trip/analyzetrip";
import { searchPlacesByTags } from '@/componets/trip/searchplaces';
import { getWeather } from '@/componets/trip/getweather';
import generateDailyItinerary from '@/componets/result/generateDailyItinerary';

// ⬇️ הוספת פונקציה חדשה לפיצול המקומות לפי ימים
function selectDailyPlaces(allPlaces, totalDays) {
  const minPerDay = 4;
  const maxPerDay = 5;
  const shuffled = [...allPlaces].sort(() => 0.5 - Math.random());
  const dailyPlans = [];
  let index = 0;

  for (let i = 0; i < totalDays; i++) {
    const remainingDays = totalDays - i;
    const remainingPlaces = shuffled.length - index;
    const maxForThisDay = Math.min(maxPerDay, Math.ceil(remainingPlaces / remainingDays));
    const numPlaces = Math.max(minPerDay, Math.min(maxForThisDay, remainingPlaces));

    dailyPlans.push(shuffled.slice(index, index + numPlaces));
    index += numPlaces;
  }

  return dailyPlans.flat(); // מחזיר רשימה שטוחה אחרי חלוקה
}

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

  const tags = await analyzeTripIntent(
    tripData.destination,
    tripData.preferences,
    weather,
    tripData.startDate,
    tripData.endDate
  );

  const tagsWithPlaces = await searchPlacesByTags(tags, tripData.destination);
  const flatPlaces = tagsWithPlaces.flatMap(tag => tag.places);

  // ✅ מחשבים את מספר הימים
  const numDays = Math.ceil((new Date(tripData.endDate) - new Date(tripData.startDate)) / (1000 * 60 * 60 * 24)) + 1;

  // ✅ בוחרים רק 4–5 מקומות לכל יום
  const filteredPlaces = selectDailyPlaces(flatPlaces, numDays);

  const itinerary = generateDailyItinerary(filteredPlaces, tripData.startDate, tripData.endDate, weather);

  const response = await fetch('http://localhost:8000/trip/create/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...tripData,
      tags,
      places: filteredPlaces,
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
    places: filteredPlaces,
    weather,
    itinerary,
    success: true
  };
}
