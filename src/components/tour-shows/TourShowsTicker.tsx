"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import type { TourShow } from "@/types/tourShow";

const STATUS_LABELS: Record<
  string,
  { text: string; bg: string; textColor: string }
> = {
  AVAILABLE: {
    text: "DISPONIBLE",
    bg: "bg-green-500",
    textColor: "text-white",
  },
  FEW_TICKETS: {
    text: "¡ÚLTIMAS!",
    bg: "bg-orange-500",
    textColor: "text-white",
  },
  SOLD_OUT: { text: "AGOTADO", bg: "bg-red-500", textColor: "text-white" },
};

function isCDNUrl(url: string): boolean {
  return (
    url.includes("s3.") ||
    url.includes("cdn.") ||
    url.includes("idrivee2") ||
    url.includes("facebook.com") ||
    url.includes("r2.dev")
  );
}

interface TourShowsTickerProps {
  onShowClick?: (show: TourShow) => void;
}

function TourShowCard({
  show,
  onClick,
}: {
  show: TourShow;
  onClick?: () => void;
}) {
  const statusInfo =
    STATUS_LABELS[show.ticketStatus] || STATUS_LABELS.AVAILABLE;
  const date = new Date(show.showDate);
  const formattedDate = date.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const validImages = (show.images || []).filter(
    (img) => img.url && img.url.trim() !== "",
  );
  const hasImages = validImages.length > 0;

  if(!show){
    return(
      <div>
        <h2>No hay tour</h2>
        </div>
    )
  }

  return (
    <div className="shrink-0 w-[280px] sm:w-80 md:w-80 lg:w-80 mx-2 sm:mx-3 cursor-pointer group" onClick={onClick}>
      {/* Main card container - neo-brutalist */}
      <div className="bg-white border-3 sm:border-4 border-black rounded-none overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:group-hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] sm:group-hover:translate-x-[-4px] sm:group-hover:translate-y-[-4px] transition-all duration-150">
        {/* Image area */}
        <div className="relative h-32 sm:h-40 bg-[#f9c937] border-b-3 sm:border-b-4 border-black">
          {hasImages ? (
            <Image
              src={validImages[0].url}
              alt={show.city}
              fill
              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
              priority
              unoptimized={isCDNUrl(validImages[0].url)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-black">
              <span className="font-archivo-black text-6xl sm:text-8xl text-[#f9c937] uppercase">
                {show.city.charAt(0)}
              </span>
            </div>
          )}

          {/* Status badge - always prominent, top-left */}
          <div className="absolute top-0 left-0">
            <div
              className={`px-3 sm:px-4 py-1.5 sm:py-2 ${statusInfo.bg} border-b-3 sm:border-b-4 border-r-3 sm:border-r-4 border-black`}
            >
              <span
                className={`font-archivo-black text-xs sm:text-sm ${statusInfo.textColor} uppercase tracking-wider`}
              >
                {statusInfo.text}
              </span>
            </div>
          </div>

          {/* Buy button - only if available */}
          {show.ticketStatus !== "SOLD_OUT" && show.ticketUrl && (
            <div className="absolute bottom-1.5 sm:bottom-2 right-1.5 sm:right-2">
              <a
                href={show.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="block px-2.5 sm:px-4 py-1.5 sm:py-2 bg-edn-neon-yellow text-black font-archivo-black text-xs uppercase tracking-wider border-2 border-[#f9c937] hover:bg-[#f9c937] hover:text-black transition-colors"
              >
                COMPRAR →
              </a>
            </div>
          )}
        </div>

        {/* Content area */}
        <div className="p-3 sm:p-4 md:p-5 bg-white">
          {/* City & Country */}
          <h3 className="font-syne font-extrabold text-xl sm:text-2xl text-black uppercase leading-tight tracking-tight">
            {show.city}
          </h3>
          <p className="font-archivo-black text-xs sm:text-sm text-black/60 uppercase mt-0.5 sm:mt-1 tracking-widest">
            {show.country}
          </p>

          {/* Venue */}
          <div className="mt-2 sm:mt-3 flex items-center gap-1.5 sm:gap-2">
            <span className="text-base sm:text-lg">📍</span>
            <p className="font-plus-jakarta text-xs sm:text-sm text-black font-medium">
              {show.venueName}
            </p>
          </div>

          {/* Date */}
          <div className="mt-1.5 sm:mt-2 flex items-center gap-1.5 sm:gap-2">
            <span className="text-base sm:text-lg">📅</span>
            <p className="font-archivo-black text-xs sm:text-sm text-black uppercase">
              {formattedDate}
            </p>
          </div>

          {/* Bottom action bar */}
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t-3 sm:border-t-4 border-black flex items-center justify-between">
            <span className="font-archivo-black text-xs text-black/40 uppercase">
              Ver detalles →
            </span>
            <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 bg-black rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TourShowsTicker({ onShowClick }: TourShowsTickerProps) {
  const [shows, setShows] = useState<TourShow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const tickerRef = useRef<HTMLDivElement>(null);

  const CARD_WIDTH = 320; // w-80 + mx-3 * 2

  useEffect(() => {
    const fetchTourShows = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tour-shows`);
        if (!response.ok) throw new Error("Error fetching tour shows");
        const data = await response.json();

        // Handle both array response and { data: [...] } format
        const showsArray = Array.isArray(data)
          ? data
          : data.data || data.shows || [];
        setShows(showsArray);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error loading tour shows",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTourShows();
  }, []);

  const scrollLeft = () => {
    if (tickerRef.current) {
      tickerRef.current.scrollBy({ left: -CARD_WIDTH, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (tickerRef.current) {
      tickerRef.current.scrollBy({ left: CARD_WIDTH, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 bg-black border-t-4 border-[#f9c937]">
        <div className="overflow-hidden">
          <div className="flex gap-4 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex-shrink-0 w-80 h-64 bg-white/10 border-4 border-black"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
  if(shows.length === 0){
    return (
      <div className="py-12 bg-black border-t-4 border-[#f9c937]">
        <div className="flex items-center gap-4">
            <h2 className="font-syne text-4xl md:text-5xl font-black text-edn-neon-yellow uppercase tracking-tighter">
              TOUR
            </h2>
            <h2 className="font-syne text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
              MUNDIAL
            </h2>
          </div>
        <div className="text-center py-16">
          <p className="font-syne text-3xl text-white uppercase">
            No hay fechas de tour
          </p>
        </div>
      </div>
    );
  }
  if (error) {
    return null;
  }

  return (
    <div className="py-8 sm:py-10 md:py-12 lg:py-16 bg-black border-t-4 border-edn-neon-yellow">
      {/* Section header - brutalist style */}
      <div className="px-4 sm:px-6 md:px-8 mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 sm:gap-4">
            <h2 className="font-syne text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-edn-neon-yellow uppercase tracking-tighter leading-none">
              TOUR
            </h2>
            <h2 className="font-syne text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-none">
              MUNDIAL
            </h2>
          </div>
          <div className="flex-1 h-1 sm:h-2 bg-edn-neon-yellow mt-2 sm:mt-3 mb-2 sm:mb-3 w-32 sm:w-48" />
          <p className="mt-1 sm:mt-2 font-archivo-black text-xs sm:text-sm text-white/60 uppercase tracking-widest">
            Fechas confirmadas 2026
          </p>
        </div>

        {/* Navigation arrows */}
        <div className="flex gap-2">
          <button
            onClick={scrollLeft}
            className="w-10 sm:w-12 h-10 sm:h-12 bg-edn-neon-yellow border-3 sm:border-4 border-black flex items-center justify-center text-2xl sm:text-3xl font-archivo-black text-black hover:bg-[#e5b800] transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            aria-label="Anterior"
          >
            ‹
          </button>
          <button
            onClick={scrollRight}
            className="w-10 sm:w-12 h-10 sm:h-12 bg-edn-neon-yellow border-3 sm:border-4 border-black flex items-center justify-center text-2xl sm:text-3xl font-archivo-black text-black hover:bg-[#e5b800] transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            aria-label="Siguiente"
          >
            ›
          </button>
        </div>
      </div>

      {/* Scrolling carousel */}
      <div className="relative">

        <div
          ref={tickerRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-3 sm:pb-4 px-4 sm:px-6 md:px-8"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {shows.map((show, index) => (
            <TourShowCard
              key={`${show.id}-${index}`}
              show={show}
              onClick={onShowClick ? () => onShowClick(show) : undefined}
            />
          ))}
        </div>
      </div>

      {/* Bottom decorative bar */}
      <div className="mt-6 sm:mt-8 flex items-center justify-center gap-3 sm:gap-4 px-4 sm:px-6 md:px-8">
        <div className="flex-1 h-0.5 sm:h-1 bg-[#f9c937]" />
        <span className="font-archivo-black text-xs sm:text-sm text-[#f9c937] uppercase">
          ✦ EDN TOUR 2026 ✦
        </span>
        <div className="flex-1 h-0.5 sm:h-1 bg-[#f9c937]" />
      </div>
    </div>
  );
}
