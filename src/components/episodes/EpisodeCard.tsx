'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Episode } from '@/types/episode';

export const PLATFORM_COLORS: Record<string, string> = {
  YOUTUBE: 'bg-red-600',
  SPOTIFY: 'bg-green-500',
  OTHER: 'bg-gray-500',
};

export const PLATFORM_ICONS: Record<string, string> = {
  YOUTUBE: '▶',
  SPOTIFY: '♫',
  OTHER: '🎧',
};

export function formatDuration(seconds?: number): string {
  if (!seconds) return '';
  const mins = Math.floor(seconds / 60);
  const hrs = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  if (hrs > 0) {
    return `${hrs}h ${remainingMins}m`;
  }
  return `${mins}m`;
}

interface EpisodeCardProps {
  episode: Episode;
  index: number;
  onClick: () => void;
}

export default function EpisodeCard({ episode, index, onClick }: EpisodeCardProps) {
  const platformColor = PLATFORM_COLORS[episode.platformType] || PLATFORM_COLORS.OTHER;
  const platformIcon = PLATFORM_ICONS[episode.platformType] || PLATFORM_ICONS.OTHER;
  const publishedDate = new Date(episode.publishedAt);
  const formattedDate = publishedDate.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

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
      <div className="flex flex-col md:flex-row">
        {/* Thumbnail */}
        <div className="relative w-full md:w-64 h-48 md:h-auto bg-[#f9c937] flex-shrink-0">
          {episode.thumbnailUrl ? (
            <Image
              src={episode.thumbnailUrl}
              alt={episode.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-archivo-black text-6xl text-black/20">
                {episode.episodeNumber}
              </span>
            </div>
          )}

          {/* Episode number badge */}
          <div className="absolute top-2 left-2 w-14 h-14 bg-black text-[#f9c937] font-archivo-black text-xl flex items-center justify-center rounded-sm border-2 border-black">
            #{episode.episodeNumber}
          </div>

          {/* Platform badge */}
          <div className={`absolute top-2 right-2 px-3 py-1 ${platformColor} text-white font-archivo-black text-xs uppercase tracking-wider rounded-sm border-2 border-black`}>
            {platformIcon} {episode.platformType}
          </div>

          {/* Exclusive badge */}
          {episode.isExclusive && (
            <div className="absolute bottom-2 left-2 px-2 py-1 bg-[#f9c937] text-black font-archivo-black text-xs uppercase tracking-wider rounded-sm border-2 border-black animate-pulse">
              ★ EXCLUSIVO
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-5">
          <h3 className="font-syne font-extrabold text-xl md:text-2xl text-black uppercase leading-tight line-clamp-2">
            {episode.title}
          </h3>

          <p className="font-plus-jakarta text-sm text-black/70 mt-3 line-clamp-3">
            {episode.description}
          </p>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <span className="font-archivo-black text-xs text-black/60 uppercase">
              📅 {formattedDate}
            </span>
            {episode.durationSeconds && (
              <span className="font-archivo-black text-xs text-black/60 uppercase">
                ⏱ {formatDuration(episode.durationSeconds)}
              </span>
            )}
          </div>

          {/* Play button */}
          {episode.contentUrl && (
            <a
              href={episode.contentUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={`
                mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-black text-[#f9c937] font-archivo-black text-sm uppercase tracking-wider
                border-2 border-black rounded-sm hover:bg-black/80 transition-colors
              `}
            >
              ▶ ESCUCHAR
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
