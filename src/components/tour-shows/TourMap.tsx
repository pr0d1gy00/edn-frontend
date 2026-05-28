'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence } from 'framer-motion';
import type { TourShow } from '@/types/tourShow';
import TourShowModal from './TourShowModal';

// Dynamic import for SSR safety
const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-[#e5e5e5] flex items-center justify-center border-4 border-black" style={{ minHeight: '700px' }}>
      <div className="w-16 h-16 border-4 border-black border-t-[#f9c937] rounded-full animate-spin" style={{borderTopColor: '#000'}} />
    </div>
  ),
});

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
<MapView shows={shows} onMarkerClick={setSelectedShow} />
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