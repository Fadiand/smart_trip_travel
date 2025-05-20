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
    if (!uniquePlacesMap.has(p.name)) {
      uniquePlacesMap.set(p.name, p);
    }
  });
  const uniquePlaces = Array.from(uniquePlacesMap.values());

  // 📍 שלב 1–4: סידור לפי מסלול מינימלי
  const distanceMatrix = buildDistanceMatrix(uniquePlaces);
  const startIndex = findBestStartingIndex(distanceMatrix);
  const bestPathIndexes = buildGreedyPath(distanceMatrix, startIndex);
  const sortedPlaces = bestPathIndexes.map(i => uniquePlaces[i]);

  let placeIndex = 0;

  for (let day = 0; day < numDays; day++) {
    const date = new Date(new Date(startDate).getTime() + day * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split("T")[0];

    const schedule = [];
    let currentTime = 9 * 60; // 09:00

    while (placeIndex < sortedPlaces.length) {
      const place = sortedPlaces[placeIndex];
      const duration = place.duration || (place.type === 'restaurant' ? 60 : 90);

      if (currentTime + duration > 17 * 60) break; // אל תחרוג מ־17:00

      const startHour = Math.floor(currentTime / 60).toString().padStart(2, "0");
      const startMin = (currentTime % 60).toString().padStart(2, "0");

      currentTime += duration + 30; // +30 דקות מרווח

      const endHour = Math.floor(currentTime / 60).toString().padStart(2, "0");
      const endMin = (currentTime % 60).toString().padStart(2, "0");

      schedule.push({
        name: place.name,
        address: place.address || '',
        rating: place.rating || null,
        location: place.location || null,
        startTime: `${startHour}:${startMin}`,
        endTime: `${endHour}:${endMin}`,
        duration,
        type: place.type || "general",
        weatherSuitable: weather?.description?.toLowerCase().includes("rain")
          ? (place.indoor ?? false)
          : true
      });

      placeIndex++;
    }

    itinerary.push({
      day: day + 1,
      date: dateStr,
      schedule
    });
  }

  return itinerary;
}
