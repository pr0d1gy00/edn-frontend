"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Episode, Pagination } from "@/types/episode";
import { episodesApi } from "@/services/episodesApi";
import PaginationNav from "@/components/episodes/PaginationNav";
import LimitSelector from "@/components/episodes/LimitSelector";
import PageIndicator from "@/components/episodes/PageIndicator";

export default function EpisodesAdminPage() {
  const router = useRouter();
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchEpisodes = useCallback(async (page: number, limit: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await episodesApi.getEpisodes(page, limit);
      setEpisodes(response.data);
      setPagination(response.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando episodios");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEpisodes(pagination.page, pagination.limit);
  }, [pagination.page, pagination.limit, fetchEpisodes]);

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (newLimit: number) => {
    setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este episodio?")) return;

    setDeletingId(id);
    try {
      await episodesApi.deleteEpisode(id);
      // Refrescar lista
      fetchEpisodes(pagination.page, pagination.limit);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error eliminando episodio");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-AR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "-";
    const mins = Math.floor(seconds / 60);
    const hrs = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return hrs > 0 ? `${hrs}h ${remainingMins}m` : `${mins}m`;
  };

  if (loading && episodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-syne font-extrabold text-3xl text-black uppercase tracking-tight">
            Episodios
          </h1>
          <p className="font-plus-jakarta text-black/50 mt-1">
            Gestiona todos los episodios del podcast
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push("/dashboard/episodes/new")}
          className="
            px-6 py-3 bg-black text-white font-archivo-black uppercase text-sm
            border-4 border-black rounded-none
            shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
            hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
            hover:translate-x-[-2px] hover:translate-y-[-2px]
            transition-all duration-150
          "
        >
          + Nuevo Episodio
        </motion.button>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500 text-white font-archivo-black uppercase border-4 border-black">
          {error}
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex items-center justify-between mb-6 p-4 bg-black/[0.03] border-4 border-black">
        <LimitSelector value={pagination.limit} onChange={handleLimitChange} />
        <PageIndicator
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
        />
        <PaginationNav
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Table */}
      <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-black text-white">
              <th className="px-4 py-4 font-archivo-black text-xs uppercase text-left">
                #
              </th>
              <th className="px-4 py-4 font-archivo-black text-xs uppercase text-left">
                Título
              </th>
              <th className="px-4 py-4 font-archivo-black text-xs uppercase text-left">
                Plataforma
              </th>
              <th className="px-4 py-4 font-archivo-black text-xs uppercase text-left">
                Fecha
              </th>
              <th className="px-4 py-4 font-archivo-black text-xs uppercase text-left">
                Duración
              </th>
              <th className="px-4 py-4 font-archivo-black text-xs uppercase text-left">
                Invitados
              </th>
              <th className="px-4 py-4 font-archivo-black text-xs uppercase text-left">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {episodes.map((episode, index) => {
              const displayImage =
                episode.thumbnailUrl ||
                (episode.images && episode.images.length > 0
                  ? episode.images[0].url
                  : null);

              return (
                <motion.tr
                  key={episode.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-t-2 border-black hover:bg-[#f9c937]/10 transition-colors"
                >
                  <td className="px-4 py-4">
                    <div className="w-12 h-12 bg-black text-[#f9c937] font-archivo-black flex items-center justify-center text-sm">
                      {episode.episodeNumber}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      {displayImage && (
                        <div className="relative w-16 h-12 bg-[#f9c937] border-2 border-black flex-shrink-0 overflow-hidden">
                          <Image
                            src={displayImage}
                            alt={episode.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-syne font-bold text-black text-sm uppercase leading-tight">
                          {episode.title}
                        </p>
                        {episode.isExclusive && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-[#f9c937] text-black font-archivo-black text-xs uppercase border border-black">
                            ★ Exclusivo
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`
                    inline-block px-3 py-1.5 font-archivo-black text-xs uppercase border-2 border-black
                    ${episode.platformType === "YOUTUBE" ? "bg-red-600 text-white" : ""}
                    ${episode.platformType === "SPOTIFY" ? "bg-green-500 text-white" : ""}
                    ${episode.platformType === "PATREON" ? "bg-gray-500 text-white" : ""}
                    ${episode.platformType === "OTHER" ? "bg-gray-500 text-white" : ""}
                  `}
                    >
                      {episode.platformType}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-plus-jakarta text-sm text-black/70">
                    {formatDate(episode.publishedAt)}
                  </td>
                  <td className="px-4 py-4 font-archivo-black text-sm text-black/70">
                    {formatDuration(episode.durationSeconds)}
                  </td>
                  <td className="px-4 py-4">
                    {episode.guests && episode.guests.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {episode.guests.slice(0, 2).map((guest) => (
                          <span
                            key={guest.id}
                            className="px-2 py-1 bg-black text-[#f9c937] font-archivo-black text-xs border border-[#f9c937]/30"
                            title={guest.name}
                          >
                            {guest.name.slice(0, 10)}
                          </span>
                        ))}
                        {episode.guests.length > 2 && (
                          <span className="px-2 py-1 bg-black/20 text-black/70 font-archivo-black text-xs">
                            +{episode.guests.length - 2}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-black/30">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          router.push(`/dashboard/episodes/${episode.id}`)
                        }
                        className="px-3 py-2 bg-black text-white font-archivo-black text-xs uppercase border-2 border-black hover:bg-[#f9c937] hover:text-black transition-colors"
                      >
                        Ver
                      </button>
                      <button
                        onClick={() =>
                          router.push(`/dashboard/episodes/${episode.id}/edit`)
                        }
                        className="px-3 py-2 bg-[#f9c937] text-black font-archivo-black text-xs uppercase border-2 border-black hover:bg-black hover:text-[#f9c937] transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(episode.id)}
                        disabled={deletingId === episode.id}
                        className="px-3 py-2 bg-white text-red-600 font-archivo-black text-xs uppercase border-2 border-black hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50"
                      >
                        {deletingId === episode.id ? "..." : "Elim"}
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Bottom pagination */}
      <div className="mt-6 flex items-center justify-center">
        <PaginationNav
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
