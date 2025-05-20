'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/componets/store/ContexApi';
import dynamic from 'next/dynamic';
import DifferentTripButton from './DifferentTripButton';

const MapView = dynamic(() => import('@/componets/map/viewmap'), { ssr: false });

export default function FullTripSummary() {
  const { username } = useUser();
  const [tripData, setTripData] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [showDayMaps, setShowDayMaps] = useState([]);

  // ✅ קודם שולף tripData לפי username
  useEffect(() => {
    if (!username) return;

    fetch(`http://localhost:8000/trip/by-username?username=${username}`)
      .then(res => res.json())  
      .then(data => {
        if (data.success) {
          setTripData(data);
          setShowDayMaps(new Array(data.itinerary?.length || 0).fill(false));
        } else {
          console.error("Trip not found:", data.error);
        }
      })
      .catch(err => console.error("Error fetching trip:", err));
  }, [username]);

  // ✅ ואז, כשיש tripData – מייצא אותו ל־backend
  useEffect(() => {
    if (tripData) {
      fetch('http://localhost:8000/trip/export/trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tripData)
      });
    }
  }, [tripData]);

  // ❗ עכשיו מותר לשים return
  if (!tripData) return <p>Loading your trip details...</p>;

  const { destination, startDate, endDate, weather, tags, places, preferences, itinerary } = tripData;

  const toggleDayMap = (index) => {
    setShowDayMaps(prev => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const usedPlaces = itinerary?.flatMap(day => day.schedule) ?? [];
  
  return (
    <div className="full-trip-summary">
      <h1 className="trip-title">Trip to {destination.charAt(0).toUpperCase() + destination.slice(1)}</h1>
      <p className="trip-dates">{startDate} – {endDate}</p>

      {preferences && <p className="trip-preferences">Trip Style: <strong>{preferences}</strong></p>}

      {weather && (
        <div className="weather-box">
          <h3>Weather Forecast</h3>
          <p>{weather.description}</p>
          <p>{weather.temp}°C (Feels like {weather.feels_like}°C)</p>
        </div>
      )}

      {tags?.length > 0 && (
        <div className="tags-section">
          <h3>Trip Tags</h3>
          <div className="tag-list">
            {tags.map((tag, i) => (
              <span className="tag-item" key={i}>{tag}</span>
            ))}
          </div>
        </div>
      )}

      <div className="places-grid">
        {usedPlaces.map((place, idx) => (
          <div className="place-card" key={idx}>
            <h4>{place.name}</h4>
            <p>{place.address}</p>
            <p>⭐ {place.rating ?? 'No rating'}</p>
          </div>
        ))}
      </div>

      {itinerary?.length > 0 && (
        <div className="itinerary-section">
          <h3>Daily Itinerary</h3>
          {itinerary.map((day, i) => (
            <div key={i} className="itinerary-day">
              <h4>Day {i + 1} - {day.date}</h4>
              <ul>
                {day.schedule.map((item, j) => (
                  <li key={j} className="itinerary-item">
                    <strong>{item.startTime} – {item.endTime}</strong> · <span>{item.name}</span>
                    <br />
                    <small>Type: {item.type}</small>
                    {item.address && <><br /><small>Address: {item.address}</small></>}
                    {item.rating && <><br /><small>Rating: ⭐ {item.rating}</small></>}
                    {item.location && (
                      <>
                        <br />
                        <a
                          href={`https://www.google.com/maps?q=${item.location.lat},${item.location.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="map-link"
                        >
                          View on Google Maps
                        </a>
                      </>
                    )}
                    <br />
                  </li>
                ))}
              </ul>

              <button className="show-map-btn" onClick={() => toggleDayMap(i)}>
                {showDayMaps[i] ? 'Hide Day Map 📍' : 'Show Day Map 📍'}
              </button>

              {showDayMaps[i] && (
                <div className="map-wrapper">
                  <MapView destination={destination} places={day.schedule} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="map-wrapper">
        <button className="show-map-btn" onClick={() => setShowMap(prev => !prev)}>
          {showMap ? 'Hide Map 📍' : 'Show Map 📍'}
        </button>

        {showMap && <MapView destination={destination} places={usedPlaces} />}
      </div>

      <DifferentTripButton />
    </div>
  );
}
