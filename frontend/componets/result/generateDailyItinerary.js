export default function generateDailyItinerary(places, startDate, endDate, weather) {
  const itinerary = [];
  const numDays = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;

  const placesPerDay = Math.ceil(places.length / numDays);
  let placeIndex = 0;

  for (let day = 0; day < numDays; day++) {
    const date = new Date(new Date(startDate).getTime() + day * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split("T")[0];

    const schedule = [];
    let currentTime = 9 * 60; // 09:00 in minutes

    for (let i = 0; i < placesPerDay && placeIndex < places.length; i++) {
      const place = places[placeIndex++];
      const duration = place.duration || (place.type === 'restaurant' ? 60 : 90); // מסעדות 60 דק
      const startHour = Math.floor(currentTime / 60).toString().padStart(2, "0");
      const startMin = (currentTime % 60).toString().padStart(2, "0");

      currentTime += duration + 30; // Add 30 min buffer

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
    }

    itinerary.push({
      day: day + 1,
      date: dateStr,
      schedule
    });
  }

  return itinerary;
}
