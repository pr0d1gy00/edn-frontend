'use client';

import { useState, useEffect } from 'react';

interface TourShow {
  id: number;
  city: string;
  country: string;
  venueName: string;
  showDate: string;
  ticketUrl: string;
  ticketStatus: 'AVAILABLE' | 'FEW_TICKETS' | 'SOLD_OUT';
  latitude?: number;
  longitude?: number;
  images?: string[];
}

const STATUS_LABELS: Record<string, { text: string; color: string }> = {
  AVAILABLE: { text: 'ENTRADAS DISPONIBLES', color: 'bg-green-500' },
  FEW_TICKETS: { text: '¡ULTIMAS ENTRADAS!', color: 'bg-orange-500' },
  SOLD_OUT: { text: 'AGOTADO', color: 'bg-red-500' },
};

function TourShowCard({ show }: { show: TourShow }) {
  const statusInfo = STATUS_LABELS[show.ticketStatus] || STATUS_LABELS.AVAILABLE;
  const date = new Date(show.showDate);
  const formattedDate = date.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="flex-shrink-0 w-72 mx-3">
      <div className="bg-white border-4 border-black rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        {/* Image area */}
        <div className="relative h-32 bg-[#f9c937] border-b-4 border-black">
          {show.images && show.images.length > 0 ? (
            <img
              src={show.images[0]}
              alt={show.city}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-archivo-black text-4xl text-black/20 uppercase">
                {show.city.charAt(0)}
              </span>
            </div>
          )}
          {/* Status badge */}
          <div className={`absolute top-2 right-2 px-2 py-1 ${statusInfo.color} border-2 border-black rounded-sm`}>
            <span className="font-archivo-black text-xs text-white uppercase tracking-wider">
              {statusInfo.text}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-syne font-extrabold text-xl text-black uppercase leading-tight">
            {show.city}
          </h3>
          <p className="font-archivo-black text-sm text-black/60 uppercase">
            {show.country}
          </p>
          <p className="font-plus-jakarta text-sm text-black/80 mt-1">
            {show.venueName}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span className="font-archivo-black text-sm text-black">
              {formattedDate}
            </span>
            {show.ticketStatus !== 'SOLD_OUT' && show.ticketUrl && (
              <a
                href={show.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-black text-[#f9c937] font-archivo-black text-xs uppercase tracking-wider rounded-sm border-2 border-black hover:bg-black/80 transition-colors"
              >
                COMPRAR
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TourShowsTicker() {
  const [shows, setShows] = useState<TourShow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTourShows = async () => {
      try {
        const response = await fetch('http://localhost:3000/tour-shows');
        if (!response.ok) throw new Error('Error fetching tour shows');
        const data = await response.json();
        setShows(data);
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
      <div className="py-8 bg-black border-t-4 border-black">
        <div className="overflow-hidden">
          <div className="flex gap-4 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-shrink-0 w-72 h-48 bg-white/20 rounded-md" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || shows.length === 0) {
    return null;
  }

  // Duplicate shows for seamless loop
  const duplicatedShows = [...shows, ...shows, ...shows, ...shows];

  return (
    <div className="py-8 bg-black border-t-4 border-black">
      {/* Section header */}
      <div className="px-8 mb-6">
        <h2 className="font-syne text-3xl md:text-4xl font-extrabold text-[#f9c937] uppercase tracking-tight">
          TOUR MUNDIAL
        </h2>
        <div className="mt-2 w-32 h-2 bg-[#f9c937]" />
      </div>

      {/* Scrolling ticker */}
      <div className="relative overflow-hidden">
        {/* Left fade gradient */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        {/* Right fade gradient */}
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

        <div className="flex animate-ticker">
          {duplicatedShows.map((show, index) => (
            <TourShowCard key={`${show.id}-${index}`} show={show} />
          ))}
        </div>
      </div>
    </div>
  );
}