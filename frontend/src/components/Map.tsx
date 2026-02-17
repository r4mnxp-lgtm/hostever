import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const Map = ({ locations }) => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  const bounds = locations.length > 0 ? new L.LatLngBounds(locations.map(loc => loc.position)) : null;

  return (
    <MapContainer 
      center={bounds ? bounds.getCenter() : [0, 0]} 
      zoom={bounds ? 2 : 1}
      scrollWheelZoom={false} 
      style={{ height: '100%', width: '100%' }}
      bounds={bounds}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((loc, index) => (
        <Marker key={index} position={loc.position} icon={customIcon}>
          <Popup>{loc.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;