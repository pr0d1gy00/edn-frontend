'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface Episode {
  id: number;
  title: string;
  description: string;
  episodeNumber: number;
  season?: number;
  releaseDate: string;
  duration?: string;
  audioUrl?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  guests?: string[];
  tags?: string[];
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface EpisodesResponse {
  data: Episode[];
  pagination?: Pagination;
}

const SEASON_COLORS: Record<number, string> = {
  1: 'border-l-[#f9c937]',
  2: 'border-l-[#39FF14]',
  3: 'border-l-[#8A2BE2]',
  4: 'border-l-[#ff6b6b]',
  5: 'border-l-[#48dbfb]',
};

function EpisodeCard({ episode, index }: { episode: Episode; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const seasonColor = episode.season ? SEASON_COLORS[episode.season] || SEASON_COLORS[1] : SEASON_COLORS[1];
  const releaseDate = new Date(episode.releaseDate);
  const formattedDate = releaseDate.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 150, damping: 20 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative bg-white border-4 border-black rounded-md overflow-hidden
        shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
        hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
        hover:translate-x-[-4px] hover:translate-y-[-4px]
        transition-all duration-150 cursor-pointer
        border-l-8 ${seasonColor}
      `}
    >
      <div className="flex flex-col md:flex-row">
        {/* Thumbnail */}
        <div className="relative w-full md:w-48 h-48 md:h-auto bg-[#f9c937] flex-shrink-0">
          {episode.imageUrl || episode.thumbnailUrl ? (
            <Image
              src={episode.imageUrl || episode.thumbnailUrl}
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
          <div className="absolute top-2 left-2 w-12 h-12 bg-black text-[#f9c937] font-archivo-black text-xl flex items-center justify-center rounded-sm border-2 border-black">
            {episode.episodeNumber}
          </div>

          {/* Season badge */}
          {episode.season && (
            <div className="absolute top-2 right-2 px-2 py-1 bg-black text-white font-archivo-black text-xs rounded-sm border-2 border-black">
              S{episode.season}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          <h3 className="font-syne font-extrabold text-xl md:text-2xl text-black uppercase leading-tight line-clamp-2">
            {episode.title}
          </h3>

          <p className="font-plus-jakarta text-sm text-black/70 mt-2 line-clamp-2">
            {episode.description}
          </p>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <span className="font-archivo-black text-xs text-black/60 uppercase">
              📅 {formattedDate}
            </span>
            {episode.duration && (
              <span className="font-archivo-black text-xs text-black/60 uppercase">
                ⏱ {episode.duration}
              </span>
            )}
          </div>

          {/* Tags */}
          {episode.tags && episode.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {episode.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-black/10 font-archivo-black text-xs text-black/70 uppercase rounded-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Play button */}
          {episode.audioUrl && (
            <button
              className={`
                mt-4 px-4 py-2 bg-black text-[#f9c937] font-archivo-black text-sm uppercase tracking-wider
                border-2 border-black rounded-sm flex items-center gap-2
                hover:bg-black/80 transition-colors
                ${isHovered ? 'opacity-100' : 'opacity-80'}
              `}
            >
              ▶ ESCUCHAR
            </button>
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
  const releaseDate = new Date(episode.releaseDate);
  const formattedDate = releaseDate.toLocaleDateString('es-AR', {
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
          {episode.imageUrl || episode.thumbnailUrl ? (
            <Image
              src={episode.imageUrl || episode.thumbnailUrl}
              alt={episode.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-archivo-black text-9xl text-black/20">
                {episode.episodeNumber}
              </span>
            </div>
          )}

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-12 h-12 bg-black text-[#f9c937] font-archivo-black text-2xl border-2 border-black rounded-sm hover:bg-black/80 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-black text-[#f9c937] font-archivo-black text-2xl flex items-center justify-center rounded-sm border-2 border-black flex-shrink-0">
              {episode.episodeNumber}
            </div>
            <div>
              <h2 className="font-syne font-extrabold text-3xl text-black uppercase leading-tight">
                {episode.title}
              </h2>
              {episode.season && (
                <span className="inline-block mt-2 px-3 py-1 bg-black text-white font-archivo-black text-sm rounded-sm border-2 border-black">
                  TEMPORADA {episode.season}
                </span>
              )}
            </div>
          </div>

          <p className="mt-6 font-plus-jakarta text-black/80 text-lg leading-relaxed">
            {episode.description}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap gap-4 mt-6 p-4 bg-black/5 border-4 border-black rounded-sm">
            <div>
              <span className="font-archivo-black text-xs text-black/50 uppercase">Fecha</span>
              <p className="font-archivo-black text-black">{formattedDate}</p>
            </div>
            {episode.duration && (
              <div>
                <span className="font-archivo-black text-xs text-black/50 uppercase">Duración</span>
                <p className="font-archivo-black text-black">{episode.duration}</p>
              </div>
            )}
          </div>

          {/* Guests */}
          {episode.guests && episode.guests.length > 0 && (
            <div className="mt-6">
              <h4 className="font-archivo-black text-sm text-black/50 uppercase mb-2">Invitados</h4>
              <div className="flex flex-wrap gap-2">
                {episode.guests.map((guest) => (
                  <span key={guest} className="px-3 py-2 bg-[#f9c937] border-2 border-black font-archivo-black text-sm text-black rounded-sm">
                    {guest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {episode.tags && episode.tags.length > 0 && (
            <div className="mt-6">
              <h4 className="font-archivo-black text-sm text-black/50 uppercase mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {episode.tags.map((tag) => (
                  <span key={tag} className="px-3 py-2 bg-black text-[#f9c937] font-archivo-black text-xs uppercase rounded-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Play button */}
          {episode.audioUrl && (
            <a
              href={episode.audioUrl}
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

        // Handle different response structures
        const episodesArray = Array.isArray(data) ? data : data.data || [];
        setEpisodes(episodesArray);

        // Extract pagination from various response formats
        if (data.pagination) {
          setPagination(data.pagination);
        } else if (!Array.isArray(data) && (data.total || data.totalPages)) {
          setPagination({
            page: currentPage,
            limit,
            total: data.total || episodesArray.length,
            totalPages: data.totalPages || Math.ceil((data.total || episodesArray.length) / limit),
          });
        }
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