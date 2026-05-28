"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import type {
  Episode,
  Pagination,
  EpisodesResponse,
  EpisodesGridProps,
} from "@/types/episode";
import EpisodeCard from "./EpisodeCard";
import PaginationNav from "./PaginationNav";
import EpisodeModal from "./EpisodeModal";
import LimitSelector from "./LimitSelector";
import PageIndicator from "./PageIndicator";

const DEFAULT_API_BASE = `${process.env.NEXT_PUBLIC_API_URL}`;
const PREVIEW_LIMIT = 6;
const FULL_DEFAULT_LIMIT = 15;

export default function EpisodesGrid({
  mode,
  apiBaseUrl = DEFAULT_API_BASE,
}: EpisodesGridProps) {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(
    mode === "preview" ? PREVIEW_LIMIT : FULL_DEFAULT_LIMIT,
  );

  const total = pagination?.total ?? 0;
  const totalPages = pagination?.totalPages ?? 0;

  useEffect(() => {
    const fetchEpisodes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${apiBaseUrl}/episodes?page=${currentPage}&limit=${limit}`,
        );
        if (!response.ok) throw new Error("Error fetching episodes");
        const data: EpisodesResponse = await response.json();

        setEpisodes(data.data || []);
        setPagination(data.meta);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading episodes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEpisodes();
  }, [currentPage, limit, apiBaseUrl]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1);
  };

  // Build derived display state
  const displayPage = pagination ? pagination.page : currentPage;
  const showPagination = mode === "full" && totalPages > 1;
  const showPageIndicator = mode === "full" && total > 0;
  const showVerTodos = mode === "preview" && total > PREVIEW_LIMIT;

  const gridContent = (
    <>
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-48 bg-black/10 border-4 border-black rounded-md animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="font-archivo-black text-2xl text-red-500 uppercase">
            Error: {error}
          </p>
          <button
            onClick={() => setCurrentPage(1)}
            className="mt-4 px-6 py-3 bg-edn-neon-yellow border-4 border-black font-archivo-black text-black uppercase rounded-sm hover:bg-edn-neon-yellow/80 transition-colors"
          >
            Reintentar
          </button>
        </div>
      ) : episodes.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-syne text-3xl text-white uppercase">
            No hay episodios disponibles
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {episodes.map((episode, index) => (
                <EpisodeCard
                  key={episode.id}
                  episode={episode}
                  index={index}
                  onClick={() => setSelectedEpisode(episode)}
                />
              ))}
            </AnimatePresence>
          </div>

          {showPageIndicator && (
            <PageIndicator
              page={displayPage}
              totalPages={totalPages}
              total={total}
            />
          )}

          {showPagination && (
            <PaginationNav
              pagination={{ page: displayPage, limit, total, totalPages }}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </>
  );

  // PREVIEW MODE: self-contained section with header
  if (mode === "preview") {
    return (
      <section
        id="episodes"
        className="py-16 bg-black border-t-4 border-edn-neon-yellow"
      >
        {/* Header */}
        <header className="px-8 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-syne text-4xl md:text-5xl font-extrabold text-edn-yellow-neon uppercase tracking-tight">
                EPISODIOS
              </h2>
              <div className="mt-4 w-48 h-2 bg-edn-yellow-neon" />
            </div>
            {showVerTodos && (
              <Link
                href="/all-episodes"
                className={`
                  px-6 py-3 bg-edn-neon-yellow border-4 border-black rounded-sm
                  font-archivo-black text-black uppercase tracking-wider
                  shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                  hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
                  hover:translate-x-0.5 hover:translate-y-0.5
                  transition-all duration-150
                `}
              >
                Ver todos los episodios
              </Link>
            )}
          </div>
          <p className="font-plus-jakarta text-black/60 mt-4 text-lg">
            Los &uacute;ltimos episodios de la Escuela de Nada
          </p>
        </header>

        {/* Grid */}
        <main className="px-8">
          <div className="max-w-6xl mx-auto">{gridContent}</div>
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
      </section>
    );
  }

  // FULL MODE: no header (page provides its own), includes controls
  return (
    <>
      {/* Controls bar: limit selector */}
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 mb-8 ">
        <LimitSelector value={limit} onChange={handleLimitChange} />
      </div>

      {/* Grid */}
      <main className="px-8">
        <div className="max-w-6xl mx-auto">{gridContent}</div>
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
    </>
  );
}
