"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import EpisodeForm from "@/components/episodes/EpisodeForm";
import type { Episode } from "@/types/episode";
import { episodesApi } from "@/services/episodesApi";

export default function EditEpisodePage() {
  const params = useParams();
  const router = useRouter();
  const episodeId = params.id as string;

  const [episode, setEpisode] = useState<Episode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!episodeId) return;

    const fetchEpisode = async () => {
      try {
        const response = await episodesApi.getEpisodeById(episodeId);
        setEpisode(response as Episode);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error cargando episodio",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEpisode();
  }, [episodeId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-4 sm:p-8">
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
          <button
            onClick={() => router.push("/dashboard/episodes")}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-black text-[#f9c937] font-archivo-black uppercase text-xs sm:text-sm border-3 sm:border-4 border-black hover:bg-[#f9c937] hover:text-black transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="square"
                strokeWidth="3"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Volver
          </button>
        </div>
        <div className="p-3 sm:p-4 bg-red-500 text-white font-archivo-black text-xs sm:text-sm uppercase border-3 sm:border-4 border-black">
          {error}
        </div>
      </div>
    );
  }

  if (!episode) {
    return (
      <div className="bg-white p-4 sm:p-8">
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
          <button
            onClick={() => router.push("/dashboard/episodes")}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-black text-[#f9c937] font-archivo-black uppercase text-xs sm:text-sm border-3 sm:border-4 border-black hover:bg-[#f9c937] hover:text-black transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="square"
                strokeWidth="3"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Volver
          </button>
        </div>
        <div className="p-3 sm:p-4 bg-red-500 text-white font-archivo-black text-xs sm:text-sm uppercase border-3 sm:border-4 border-black">
          Episodio no encontrado
        </div>
      </div>
    );
  }

  return <EpisodeForm mode="edit" initialData={episode} />;
}
