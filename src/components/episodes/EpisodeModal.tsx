'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Episode } from '@/types/episode';
import { PLATFORM_COLORS, PLATFORM_ICONS, formatDuration } from './EpisodeCard';

interface EpisodeModalProps {
  episode: Episode;
  onClose: () => void;
}

export default function EpisodeModal({ episode, onClose }: EpisodeModalProps) {
  const publishedDate = new Date(episode.publishedAt);
  const formattedDate = publishedDate.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, rotate: -2 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0.8, rotate: 2 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white border-4 border-black rounded-md shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="relative h-64 bg-[#f9c937]">
          {episode.thumbnailUrl ? (
            <Image src={episode.thumbnailUrl} alt={episode.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-archivo-black text-9xl text-black/20">#{episode.episodeNumber}</span>
            </div>
          )}

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-12 h-12 bg-black text-[#f9c937] font-archivo-black text-2xl border-2 border-black rounded-sm hover:bg-black/80 transition-colors"
          >
            ✕
          </button>

          <div className="absolute bottom-4 left-4 flex gap-2">
            <span className={`px-3 py-1 ${PLATFORM_COLORS[episode.platformType]} text-white font-archivo-black text-sm uppercase tracking-wider rounded-sm border-2 border-black`}>
              {PLATFORM_ICONS[episode.platformType]} {episode.platformType}
            </span>
            {episode.isExclusive && (
              <span className="px-3 py-1 bg-[#f9c937] text-black font-archivo-black text-sm uppercase tracking-wider rounded-sm border-2 border-black animate-pulse">
                ★ EXCLUSIVO
              </span>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-black text-[#f9c937] font-archivo-black text-xl flex items-center justify-center rounded-sm border-2 border-black flex-shrink-0">
              #{episode.episodeNumber}
            </div>
            <div>
              <h2 className="font-syne font-extrabold text-2xl md:text-3xl text-black uppercase leading-tight">
                {episode.title}
              </h2>
            </div>
          </div>

          <p className="mt-6 font-plus-jakarta text-black/80 text-lg leading-relaxed">
            {episode.description}
          </p>

          <div className="flex flex-wrap gap-6 mt-6 p-4 bg-black/5 border-4 border-black rounded-sm">
            <div>
              <span className="font-archivo-black text-xs text-black/50 uppercase block">Fecha</span>
              <span className="font-archivo-black text-lg text-black">{formattedDate}</span>
            </div>
            {episode.durationSeconds && (
              <div>
                <span className="font-archivo-black text-xs text-black/50 uppercase block">Duración</span>
                <span className="font-archivo-black text-lg text-black">{formatDuration(episode.durationSeconds)}</span>
              </div>
            )}
            <div>
              <span className="font-archivo-black text-xs text-black/50 uppercase block">Episodio</span>
              <span className="font-archivo-black text-lg text-black">#{episode.episodeNumber}</span>
            </div>
          </div>

          {episode.contentUrl && (
            <a
              href={episode.contentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 w-full py-5 bg-black text-[#f9c937] font-archivo-black uppercase tracking-wider text-xl rounded-sm border-4 border-black hover:bg-black/80 transition-colors flex items-center justify-center gap-3"
              style={{ boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)' }}
            >
              ▶ ESCUCHAR ESTE EPISODIO
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
