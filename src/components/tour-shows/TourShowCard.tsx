'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import type { TourShow } from '@/types/tourShow';

const STATUS_LABELS: Record<string, string> = {
  AVAILABLE: 'DISPONIBLE',
  FEW_TICKETS: '¡ÚLTIMAS!',
  SOLD_OUT: 'AGOTADO',
};

const STATUS_COLORS: Record<string, string> = {
  AVAILABLE: 'bg-green-500',
  FEW_TICKETS: 'bg-orange-500',
  SOLD_OUT: 'bg-red-500',
};

function formatShowDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

interface TourShowCardProps {
  show: TourShow;
  index: number;
  onClick: () => void;
}

export default function TourShowCard({ show, index, onClick }: TourShowCardProps) {
  const statusLabel = STATUS_LABELS[show.ticketStatus] || 'DISPONIBLE';
  const statusColor = STATUS_COLORS[show.ticketStatus] || 'bg-green-500';
  const formattedDate = formatShowDate(show.showDate);
  const hasImages = show.images && show.images.length > 0;
  const canBuy = show.ticketStatus !== 'SOLD_OUT' && show.ticketUrl;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 150, damping: 20 }}
      onClick={onClick}
      className={`
        relative bg-white border-4 border-black rounded-md overflow-hidden
        shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
        hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
        hover:translate-x-[-4px] hover:translate-y-[-4px]
        transition-all duration-150 cursor-pointer
      `}
    >
      {/* Image / Header area */}
      <div className="relative h-32 bg-[#f9c937] border-b-4 border-black">
        {hasImages ? (
          <Image
            src={show.images[0]}
            alt={show.city}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-archivo-black text-6xl text-black/20 uppercase">
              {show.city.charAt(0)}
            </span>
          </div>
        )}

        {/* Status badge */}
        <div
          className={`
            absolute top-2 right-2 px-3 py-1 ${statusColor} border-2 border-black rounded-sm
          `}
        >
          <span className="font-archivo-black text-xs text-white uppercase tracking-wider">
            {statusLabel}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-syne font-extrabold text-xl text-black uppercase leading-tight">
              {show.city}
            </h3>
            <p className="font-archivo-black text-sm text-black/60 uppercase mt-0.5">
              {show.country}
            </p>
          </div>
        </div>

        <p className="font-plus-jakarta text-sm text-black/80 mt-2">
          {show.venueName}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <span className="font-archivo-black text-sm text-black">
            {formattedDate}
          </span>

          {canBuy && (
            <a
              href={show.ticketUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="px-3 py-1.5 bg-black text-[#f9c937] font-archivo-black text-xs uppercase tracking-wider rounded-sm border-2 border-black hover:bg-black/80 transition-colors"
            >
              COMPRAR
            </a>
          )}
        </div>

        {/* Multiple images indicator */}
        {hasImages && show.images.length > 1 && (
          <div className="mt-2 flex items-center gap-1">
            <span className="font-archivo-black text-xs text-black/40 uppercase">
              +{show.images.length - 1} foto{show.images.length - 1 !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>
    </motion.article>
  );
}
