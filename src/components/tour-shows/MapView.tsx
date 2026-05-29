'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import type { TourShow } from '@/types/tourShow';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom neo-brutalist icon with glow
const customIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div style="
    width:48px;
    height:48px;
    background:#f9c937;
    border:4px solid #000;
    box-shadow:6px 6px 0px #000, 0 0 20px rgba(249,201,55,0.4);
    display:flex;
    align-items:center;
    justify-content:center;
    border-radius:0;
    position:relative;
  ">
    <span style="font-size:24px;filter:drop-shadow(2px_2px_0px_#000);">📍</span>
  </div>`,
  iconSize: [48, 48],
  iconAnchor: [24, 48],
  popupAnchor: [0, -48],
});

// Zoom controls component using useMap hook
function ZoomControls() {
  const map = useMap();

  return (
    <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-[400]">
      <button
        onClick={() => map.zoomIn()}
        className="w-12 h-12 bg-[#f9c937] border-4 border-black rounded-sm flex items-center justify-center text-2xl font-archivo-black text-black hover:bg-[#f9c937]/80 transition-colors"
        style={{ boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}
      >
        +
      </button>
      <button
        onClick={() => map.zoomOut()}
        className="w-12 h-12 bg-white border-4 border-black rounded-sm flex items-center justify-center text-2xl font-archivo-black text-black hover:bg-gray-200 transition-colors"
        style={{ boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}
      >
        −
      </button>
    </div>
  );
}

interface MapViewProps {
  shows: TourShow[];
  onMarkerClick: (show: TourShow) => void;
}

function MapView({ shows, onMarkerClick }: MapViewProps) {
  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ height: '100%', width: '100%', minHeight: '100%', background: '#e5e5e5' }}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {shows.map((show) => (
        <Marker
          key={show.id}
          position={[show.latitude!, show.longitude!]}
          icon={customIcon}
          eventHandlers={{ click: () => onMarkerClick(show) }}
        >
          <Popup className="neo-popup">
            <div className="p-3 bg-[#f9c937] border-3 border-black rounded-sm font-archivo-black shadow-[3px_3px_0px_#000]">
              <h3 className="text-lg text-black">{show.city}</h3>
              <p className="font-plus-jakarta text-sm text-black/70">{show.country}</p>
              <p className="font-plus-jakarta text-xs text-black/50 mt-1">Click para ver detalles →</p>
            </div>
          </Popup>
        </Marker>
      ))}
      <ZoomControls />
    </MapContainer>
  );
}

export default MapView;
