'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence } from 'framer-motion';
import type { TourShow } from '@/types/tourShow';
import TourShowModal from './TourShowModal';
import 'leaflet/dist/leaflet.css';

// Custom neo-brutalist marker
const CustomMarkerIcon = () => (
  <div style={{
    width: 40,
    height: 40,
    background: '#f9c937',
    border: '4px solid #000',
    borderRadius: 0,
    boxShadow: '4px 4px 0px #000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  }}>
    <span style={{ fontFamily: 'Archivo Black, sans-serif', fontSize: 20, color: '#000' }}>📍</span>
  </div>
);

// Map component loaded dynamically to avoid SSR issues
const MapComponent = dynamic(
  () => import('react-leaflet').then((mod) => {
    const { MapContainer, TileLayer, Marker, Popup } = mod;
    const L = require('leaflet');

    // Fix for default marker icons in leaflet with webpack
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });

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

    function MapWithMarkers({ shows, onMarkerClick }: { shows: TourShow[]; onMarkerClick: (show: TourShow) => void }) {
      return (
        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{ height: '100%', width: '100%', minHeight: '700px', background: '#e5e5e5' }}
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
        </MapContainer>
      );
    }

    return MapWithMarkers;
  }),
  { ssr: false, loading: () =>         <div className="h-full w-full bg-[#e5e5e5] flex items-center justify-center border-4 border-black" style={{ minHeight: '700px' }}>
          <div className="w-16 h-16 border-4 border-black border-t-[#f9c937] rounded-full animate-spin" style={{borderTopColor: '#000'}} />
        </div> }
);

export default function TourMap() {
  const [shows, setShows] = useState<TourShow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedShow, setSelectedShow] = useState<TourShow | null>(null);

  useEffect(() => {
    const fetchTourShows = async () => {
      try {
        const response = await fetch('http://localhost:3000/tour-shows');
        if (!response.ok) throw new Error('Error fetching tour shows');
        const data = await response.json();

        const showsArray = Array.isArray(data) ? data : data.data || data.shows || [];
        const showsWithCoords = showsArray.filter(
          (show: TourShow) => show.latitude != null && show.longitude != null
        );
        setShows(showsWithCoords);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading tour shows');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTourShows();
  }, []);

  if (isLoading) {
    return (
      <div className="py-16 bg-black border-t-4 border-black">
        <div className="px-8 mb-6">
          <h2 className="font-syne text-3xl md:text-4xl font-extrabold text-[#f9c937] uppercase tracking-tight">
            MAPA MUNDIAL
          </h2>
          <div className="mt-2 w-32 h-2 bg-[#f9c937]" />
        </div>
        <div className="h-96 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-[#f9c937] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return null;
  }

  return (
    <div className="relative z-40 py-8 bg-black border-t-4 border-black">
      {/* Section header */}
      <div className="px-8 mb-6">
        <h2 className="font-syne text-3xl md:text-4xl font-extrabold text-[#f9c937] uppercase tracking-tight">
          MAPA MUNDIAL
        </h2>
        <div className="mt-2 w-32 h-2 bg-[#f9c937]" />
        <p className="font-plus-jakarta text-white/60 mt-3">
          {shows.length} shows en {new Set(shows.map((s) => s.country)).size} países
        </p>
      </div>

      {/* Map container - neo-brutalist style */}
      <div className="relative mx-8 border-4 border-black rounded-md overflow-hidden" style={{ minHeight: '700px' }}>
        <div className="absolute inset-0 bg-[#e5e5e5]" /> {/* Light background behind map */}
        <MapComponent shows={shows} onMarkerClick={setSelectedShow} />

        {/* Neo-brutalist zoom controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-[400]">
<button
            onClick={() => {
              const map = document.querySelector('.leaflet-container') as any;
              if (map?._leaflet_map) map._leaflet_map.zoomIn();
            }}
            className="w-12 h-12 bg-[#f9c937] border-4 border-black rounded-sm flex items-center justify-center text-2xl font-archivo-black text-black hover:bg-[#f9c937]/80 transition-colors"
            style={{ boxShadow: '4px 4px 0px_0px_rgba(0,0,0,1)' }}
          >
            +
          </button>
          <button
            onClick={() => {
              const map = document.querySelector('.leaflet-container') as any;
              if (map?._leaflet_map) map._leaflet_map.zoomOut();
            }}
            className="w-12 h-12 bg-[#f9c937] border-4 border-black rounded-sm flex items-center justify-center text-2xl font-archivo-black text-black hover:bg-[#f9c937]/80 transition-colors"
            style={{ boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}
          >
            +
          </button>
          <button
            onClick={() => {
              const map = document.querySelector('.leaflet-container');
              if (map?._leaflet_map) map._leaflet_map.zoomOut();
            }}
            className="w-12 h-12 bg-white border-4 border-black rounded-sm flex items-center justify-center text-2xl font-archivo-black text-black hover:bg-gray-200 transition-colors"
            style={{ boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}
          >
            −
          </button>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedShow && (
          <TourShowModal show={selectedShow} onClose={() => setSelectedShow(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}