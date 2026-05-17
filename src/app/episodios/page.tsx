'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface Episode {
  id: string;
  episodeNumber: number;
  title: string;
  description: string;
  platformType: 'YOUTUBE' | 'SPOTIFY' | 'OTHER';
  contentUrl?: string;
  thumbnailUrl?: string;
  publishedAt: string;
  isExclusive: boolean;
  durationSeconds?: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface EpisodesResponse {
  data: Episode[];
  meta: Pagination;
}

const PLATFORM_COLORS: Record<string, string> = {
  YOUTUBE: 'bg-red-600',
  SPOTIFY: 'bg-green-500',
  OTHER: 'bg-gray-500',
};

const PLATFORM_ICONS: Record<string, string> = {
  YOUTUBE: '▶',
  SPOTIFY: '♫',
  OTHER: '🎧',
};

function formatDuration(seconds?: number): string {
  if (!seconds) return '';
  const mins = Math.floor(seconds / 60);
  const hrs = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  if (hrs > 0) {
    return `${hrs}h ${remainingMins}m`;
  }
  return `${mins}m`;
}

function EpisodeCard({ episode, index }: { episode: Episode; index: number }) {
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

function PaginationNav({ pagination, onPageChange }: { pagination: Pagination; onPageChange: (page: number) => void }) {
  const { page, totalPages } = pagination;

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    pages.push(1);
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  return (
    <nav className="flex items-center justify-center gap-2 mt-12">
      {/* Previous */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-4 py-3 bg-white border-4 border-black font-archivo-black text-black uppercase tracking-wider rounded-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#f9c937] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      >
        ← ANT
      </button>

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {getVisiblePages().map((p, idx) =>
          p === '...' ? (
            <span key={`ellipsis-${idx}`} className="px-3 py-3 font-archivo-black text-black/50">
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={`
                w-12 h-12 font-archivo-black text-lg uppercase tracking-wider rounded-sm border-4 border-black
                transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                ${
                  p === page
                    ? 'bg-black text-[#f9c937]'
                    : 'bg-white text-black hover:bg-[#f9c937]'
                }
              `}
            >
              {p}
            </button>
          )
        )}
      </div>

      {/* Next */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="px-4 py-3 bg-white border-4 border-black font-archivo-black text-black uppercase tracking-wider rounded-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#f9c937] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      >
        SIG →
      </button>
    </nav>
  );
}

function EpisodeModal({ episode, onClose }: { episode: Episode; onClose: () => void }) {
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
        {/* Header image */}
        <div className="relative h-64 bg-[#f9c937]">
          {episode.thumbnailUrl ? (
            <Image
              src={episode.thumbnailUrl}
              alt={episode.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-archivo-black text-9xl text-black/20">
                #{episode.episodeNumber}
              </span>
            </div>
          )}

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-12 h-12 bg-black text-[#f9c937] font-archivo-black text-2xl border-2 border-black rounded-sm hover:bg-black/80 transition-colors"
          >
            ✕
          </button>

          {/* Platform & Exclusive badges */}
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

        {/* Content */}
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

          {/* Meta */}
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

          {/* Play button */}
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

export default function EpisodesPage() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 15;

  useEffect(() => {
    const fetchEpisodes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:3000/episodes?page=${currentPage}&limit=${limit}`);
        if (!response.ok) throw new Error('Error fetching episodes');
        const data: EpisodesResponse = await response.json();

        setEpisodes(data.data || []);
        setPagination(data.meta);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading episodes');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEpisodes();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Header */}
      <header className="px-8 py-12 border-b-4 border-black">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-syne text-5xl md:text-7xl font-extrabold text-[#f9c937] uppercase tracking-tight">
            EPISODIOS
          </h1>
          <div className="mt-4 w-48 h-3 bg-[#f9c937]" />
          <p className="font-plus-jakarta text-white/60 mt-4 text-lg">
            Todos los episodios de la Escuela de Nada
          </p>
        </div>
      </header>

      {/* Episodes grid */}
      <main className="px-8 py-12">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-48 bg-white/10 border-4 border-black rounded-md animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="font-archivo-black text-2xl text-red-500 uppercase">
                Error: {error}
              </p>
              <button
                onClick={() => setCurrentPage(1)}
                className="mt-4 px-6 py-3 bg-[#f9c937] border-4 border-black font-archivo-black text-black uppercase rounded-sm hover:bg-[#e5b800] transition-colors"
              >
                Reintentar
              </button>
            </div>
          ) : episodes.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-syne text-3xl text-white/40 uppercase">
                No hay episodios disponibles
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2">
                <AnimatePresence mode="popLayout">
                  {episodes.map((episode, index) => (
                    <div key={episode.id} onClick={() => setSelectedEpisode(episode)}>
                      <EpisodeCard episode={episode} index={index} />
                    </div>
                  ))}
                </AnimatePresence>
              </div>

              {pagination && pagination.totalPages > 1 && (
                <PaginationNav
                  pagination={{ ...pagination, page: currentPage }}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </main>

      {/* Episode modal */}
      <AnimatePresence>
        {selectedEpisode && (
          <EpisodeModal
            episode={selectedEpisode}
            onClose={() => setSelectedEpisode(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}