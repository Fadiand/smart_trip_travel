import {
  calculateDistanceKm,
  buildDistanceMatrix,
  findBestStartingIndex,
  buildGreedyPath
} from "@/utils/distanceUtils";


export default function generateDailyItinerary(places, startDate, endDate, weather) {
  const itinerary = [];
  const numDays = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;

  // 🧠 שלב 0: סינון כפילויות לפי שם
  const uniquePlacesMap = new Map();
  places.forEach(p => {
    const name = typeof p === 'string' ? p : p?.name;
    if (name && !uniquePlacesMap.has(name)) {
      uniquePlacesMap.set(name, typeof p === 'string' ? { name: p } : p);
    }
  });
  const uniquePlaces = Array.from(uniquePlacesMap.values());

  // 🧩 שלב 1: חלוקה לקבוצות לפי ימים
  const dailyGroups = [];
  const shuffled = [...uniquePlaces].sort(() => 0.5 - Math.random());
  const groupSize = Math.ceil(shuffled.length / numDays);
  for (let i = 0; i < numDays; i++) {
    dailyGroups.push(shuffled.slice(i * groupSize, (i + 1) * groupSize));
  }

  // 📍 שלב 2: יצירת מסלול יומי לכל יום
  for (let day = 0; day < numDays; day++) {
    const date = new Date(new Date(startDate).getTime() + day * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split("T")[0];
    const dayPlaces = dailyGroups[day];

    const schedule = [];
    let currentTime = 9 * 60;

    if (dayPlaces.length === 0) {
      itinerary.push({ day: day + 1, date: dateStr, schedule: [] });
      continue;
    }

    const distanceMatrix = buildDistanceMatrix(dayPlaces);
    const startIndex = findBestStartingIndex(distanceMatrix);
    const bestPathIndexes = buildGreedyPath(distanceMatrix, startIndex);
    const sortedDayPlaces = bestPathIndexes.map(i => dayPlaces[i]);

    for (const rawPlace of sortedDayPlaces) {
      if (!rawPlace) continue;

      const place = typeof rawPlace === 'string'
        ? { name: rawPlace, type: 'general', duration: 90 }
        : {
            name: rawPlace.name || 'Unnamed Place',
            address: rawPlace.address || '',
            rating: rawPlace.rating ?? null,
            location: rawPlace.location ?? null,
            type: rawPlace.type || 'general',
            duration: rawPlace.duration ?? (rawPlace.type === 'restaurant' ? 60 : 90),
            indoor: rawPlace.indoor ?? false
          };

      const duration = place.duration;
      if (currentTime + duration > 17 * 60) break;

      const startHour = Math.floor(currentTime / 60).toString().padStart(2, "0");
      const startMin = (currentTime % 60).toString().padStart(2, "0");

      currentTime += duration + 30;

      const endHour = Math.floor(currentTime / 60).toString().padStart(2, "0");
      const endMin = (currentTime % 60).toString().padStart(2, "0");

      schedule.push({
        name: place.name,
        address: place.address,
        rating: place.rating,
        location: place.location,
        startTime: `${startHour}:${startMin}`,
        endTime: `${endHour}:${endMin}`,
        duration,
        type: place.type,
        weatherSuitable: weather?.description?.toLowerCase().includes("rain")
          ? place.indoor
          : true
      });
    }

    itinerary.push({ day: day + 1, date: dateStr, schedule });
  }

  return itinerary;
}
