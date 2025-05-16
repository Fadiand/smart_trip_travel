'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// אייקון ברירת מחדל
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// רכיב שמרכז את המפה
function FlyTo({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 13);
    }
  }, [center, map]);
  return null;
}

export default function MapView({ destination, places }) {
  const [center, setCenter] = useState([32.0853, 34.7818]); // ברירת מחדל - תל אביב

  useEffect(() => {
    if (places?.length && places[0]?.location) {
      setCenter([places[0].location.lat, places[0].location.lng]);
    }
  }, [places]);

  const path = places
    .filter(p => p.location)
    .map(p => [p.location.lat, p.location.lng]);

  return (
    <div style={{ marginTop: '20px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: '500px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        <FlyTo center={center} />

        {path.length > 1 && (
          <Polyline
            positions={path}
            pathOptions={{
              color: '#ff5722',
              weight: 5,
              opacity: 0.8,
              dashArray: '8,12'
            }}
          />
        )}

        {places.map((place, idx) => (
          <Marker
            key={idx}
            position={[place.location.lat, place.location.lng]}
          >
            <Popup>
              <strong>{place.name}</strong><br />
              {place.address}<br />
              ⭐ {place.rating ?? 'No rating'}
            </Popup>
            <Tooltip direction="top" offset={[0, -20]} opacity={1}>
              {place.name}
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
