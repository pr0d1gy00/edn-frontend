'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const customIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div style="
    width:40px;height:40px;background:#f9c937;border:3px solid #000;
    box-shadow:3px 3px 0px #000;display:flex;align-items:center;justify-content:center;
  "><span style="font-size:20px;">📍</span></div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

interface LocationMapProps {
  position: [number, number];
}

function LocationMapView({ position }: LocationMapProps) {
  return (
    <MapContainer
      center={position}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={customIcon}>
        <Popup>
          <div style={{ padding: '8px', fontFamily: 'Archivo Black, sans-serif' }}>
            Show Location
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}

export default LocationMapView;
