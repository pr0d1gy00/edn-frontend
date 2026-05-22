"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { getAllStories, approveStory, rejectStory, deleteStory, type StoryAdmin } from "@/services/storiesApi";

const STATUS_COLORS = {
  pending: { bg: "bg-yellow-400", text: "text-black", border: "border-yellow-600" },
  approved: { bg: "bg-green-500", text: "text-white", border: "border-green-700" },
};

const ACTION_COLORS = {
  approve: "bg-edn-neon-yellow text-black hover:bg-yellow-400",
  reject: "bg-red-500 text-white hover:bg-red-600",
  delete: "bg-black text-red-500 hover:bg-red-500 hover:text-white",
};

export default function HistoriasAdminPage() {
  const [stories, setStories] = useState<StoryAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedStory, setSelectedStory] = useState<StoryAdmin | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  const fetchStories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllStories();
      if (response.success && response.data) {
        setStories(response.data);
      } else {
        setError(response.error || "Error al cargar historias");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de red");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const triggerConfetti = () => {
    const count = 80;
    const defaults = { origin: { y: 0.6 }, zIndex: 9999 };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55, color: "#f9c937" });
    fire(0.2, { spread: 60, color: "#ffffff" });
    fire(0.35, { spread: 100, decay: 0.91, color: "#f9c937" });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, color: "#f9c937" });
    fire(0.1, { spread: 120, startVelocity: 45, color: "#ffffff" });
  };

  const handleApprove = async (story: StoryAdmin) => {
    if (actionLoading) return;
    setActionLoading(story.id);

    try {
      const response = await approveStory(story.id);
      if (response.success) {
        triggerConfetti();
        fetchStories();
        setSelectedStory(null);
      } else {
        alert(response.error || "Error al aprobar");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (story: StoryAdmin) => {
    if (actionLoading) return;
    if (!confirm(`¿Rechazar "${story.title}"? Esta acción no se puede deshacer.`)) return;

    setActionLoading(story.id);
    try {
      const response = await rejectStory(story.id);
      if (response.success) {
        fetchStories();
        setSelectedStory(null);
      } else {
        alert(response.error || "Error al rechazar");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (story: StoryAdmin) => {
    if (actionLoading) return;
    if (!confirm(`¿Eliminar "${story.title}" permanentemente?`)) return;

    setActionLoading(story.id);
    try {
      const response = await deleteStory(story.id);
      if (response.success) {
        fetchStories();
        setSelectedStory(null);
      } else {
        alert(response.error || "Error al eliminar");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredStories = stories.filter((story) => {
    if (filter === "pending") return !story.isApproved;
    if (filter === "approved") return story.isApproved;
    return true;
  });

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("es-AR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trimEnd() + "…";
  };

  if (loading && stories.length === 0) {
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
            Historias
          </h1>
          <p className="font-plus-jakarta text-black/50 mt-1">
            Gestiona las historias de la comunidad
          </p>
        </div>
        <div className="flex gap-2">
          <span className="px-4 py-2 bg-black text-edn-neon-yellow font-archivo-black text-sm uppercase border-4 border-black">
            {stories.filter((s) => !s.isApproved).length} pendientes
          </span>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(["all", "pending", "approved"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`
              px-4 py-2 font-archivo-black text-xs uppercase border-4 border-black transition-all
              ${filter === f
                ? "bg-black text-edn-neon-yellow shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                : "bg-white text-black hover:bg-black hover:text-edn-neon-yellow"
              }
            `}
          >
            {f === "all" ? "Todas" : f === "pending" ? "Pendientes" : "Aprobadas"}
          </button>
        ))}
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500 text-white font-archivo-black uppercase border-4 border-black">
          {error}
        </div>
      )}

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-yellow-400 border-4 border-black p-4">
          <p className="font-archivo-black text-xs uppercase text-black/60">Pendientes</p>
          <p className="font-syne font-extrabold text-3xl text-black">
            {stories.filter((s) => !s.isApproved).length}
          </p>
        </div>
        <div className="bg-green-500 border-4 border-black p-4">
          <p className="font-archivo-black text-xs uppercase text-white/70">Aprobadas</p>
          <p className="font-syne font-extrabold text-3xl text-white">
            {stories.filter((s) => s.isApproved).length}
          </p>
        </div>
        <div className="bg-black border-4 border-black p-4">
          <p className="font-archivo-black text-xs uppercase text-white/50">Total</p>
          <p className="font-syne font-extrabold text-3xl text-edn-neon-yellow">
            {stories.length}
          </p>
        </div>
      </div>

      {/* Stories grid */}
      {filteredStories.length === 0 ? (
        <div className="bg-black/5 border-4 border-dashed border-black/20 p-12 text-center">
          <p className="font-archivo-black text-black/40 uppercase">
            No hay historias {filter === "pending" ? "pendientes" : filter === "approved" ? "aprobadas" : ""}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredStories.map((story, index) => (
              <motion.article
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.03 }}
                className={`
                  bg-white border-4 border-black
                  shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                  hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
                  hover:translate-x-[-2px] hover:translate-y-[-2px]
                  transition-all duration-150
                `}
              >
                {/* Status badge */}
                <div className="bg-black p-2 flex items-center justify-between">
                  <span
                    className={`
                      px-2 py-1 font-archivo-black text-xs uppercase border-2
                      ${STATUS_COLORS[story.isApproved ? "approved" : "pending"].bg}
                      ${STATUS_COLORS[story.isApproved ? "approved" : "pending"].text}
                      ${STATUS_COLORS[story.isApproved ? "approved" : "pending"].border}
                    `}
                  >
                    {story.isApproved ? "✓ Aprobada" : "⏳ Pendiente"}
                  </span>
                  {story._count?.votes !== undefined && (
                    <span className="font-archivo-black text-xs text-white/60">
                      {story._count.votes} votos
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-syne font-extrabold text-lg text-black uppercase leading-tight mb-2">
                    {truncateText(story.title, 50)}
                  </h3>
                  <p className="font-plus-jakarta text-sm text-black/60 leading-relaxed mb-4">
                    {truncateText(story.content, 120)}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-black/50 mb-4">
                    <span>Por: {story.author?.username || story.authorId}</span>
                    <span>{formatDate(story.createdAt)}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedStory(story)}
                      className="flex-1 px-3 py-2 bg-black text-white font-archivo-black text-xs uppercase border-2 border-black hover:bg-black/80 transition-colors"
                    >
                      Ver
                    </button>
                    {!story.isApproved && (
                      <button
                        onClick={() => handleApprove(story)}
                        disabled={actionLoading === story.id}
                        className="flex-1 px-3 py-2 bg-green-500 text-white font-archivo-black text-xs uppercase border-2 border-black hover:bg-green-600 transition-colors disabled:opacity-50"
                      >
                        {actionLoading === story.id ? "..." : "✓ Aprobar"}
                      </button>
                    )}
                    <button
                      onClick={() => handleReject(story)}
                      disabled={actionLoading === story.id}
                      className="px-3 py-2 bg-red-500 text-white font-archivo-black text-xs uppercase border-2 border-black hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Story detail modal */}
      <AnimatePresence>
        {selectedStory && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm"
              onClick={() => setSelectedStory(null)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -1 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.9, rotate: 1 }}
              className="fixed inset-0 z-[1001] flex items-center justify-center p-4 pointer-events-none"
            >
              <div
                className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-3xl max-h-[90vh] overflow-y-auto pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="sticky top-0 bg-black border-b-4 border-black p-4 flex items-center justify-between z-10">
                  <div className="flex items-center gap-3">
                    <span
                      className={`
                        px-3 py-1 font-archivo-black text-sm uppercase border-2
                        ${STATUS_COLORS[selectedStory.isApproved ? "approved" : "pending"].bg}
                        ${STATUS_COLORS[selectedStory.isApproved ? "approved" : "pending"].text}
                      `}
                    >
                      {selectedStory.isApproved ? "✓ Aprobada" : "⏳ Pendiente"}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedStory(null)}
                    className="w-10 h-10 bg-edn-neon-yellow text-black font-archivo-black text-xl border-4 border-black hover:bg-edn-neon-yellow/80 transition-colors flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>

                {/* Content */}
                <div className="p-8">
                  <h2 className="font-syne font-extrabold text-2xl md:text-3xl text-black uppercase leading-tight tracking-tight mb-4">
                    {selectedStory.title}
                  </h2>

                  {/* Meta info */}
                  <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b-4 border-black">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">👤</span>
                      <span className="font-archivo-black text-xs text-black/60 uppercase">
                        @{selectedStory.author?.username || selectedStory.authorId}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📅</span>
                      <span className="font-archivo-black text-xs text-black/60 uppercase">
                        {formatDate(selectedStory.createdAt)}
                      </span>
                    </div>
                    {selectedStory.prompt?.title && (
                      <div className="flex items-center gap-2">
                        <span className="text-lg">💬</span>
                        <span className="font-archivo-black text-xs text-black/60 uppercase">
                          {selectedStory.prompt.title}
                        </span>
                      </div>
                    )}
                    {selectedStory._count?.votes !== undefined && (
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🗳️</span>
                        <span className="font-archivo-black text-xs text-black/60 uppercase">
                          {selectedStory._count.votes} votos
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Full content */}
                  <div className="prose prose-lg max-w-none">
                    <p className="font-plus-jakarta text-base text-black leading-relaxed whitespace-pre-wrap">
                      {selectedStory.content}
                    </p>
                  </div>
                </div>

                {/* Footer actions */}
                <div className="bg-black p-4 flex items-center justify-between">
                  <div className="flex gap-3">
                    {!selectedStory.isApproved && (
                      <button
                        onClick={() => handleApprove(selectedStory)}
                        disabled={actionLoading === selectedStory.id}
                        className="px-6 py-3 bg-green-500 text-white font-archivo-black uppercase text-sm border-4 border-green-600 hover:bg-green-400 hover:text-black transition-colors disabled:opacity-50"
                      >
                        {actionLoading === selectedStory.id ? "..." : "✓ Aprobar Historia"}
                      </button>
                    )}
                    <button
                      onClick={() => handleReject(selectedStory)}
                      disabled={actionLoading === selectedStory.id}
                      className="px-6 py-3 bg-red-500 text-white font-archivo-black uppercase text-sm border-4 border-red-600 hover:bg-red-400 hover:text-black transition-colors disabled:opacity-50"
                    >
                      {actionLoading === selectedStory.id ? "..." : "✕ Rechazar"}
                    </button>
                  </div>
                  <button
                    onClick={() => handleDelete(selectedStory)}
                    disabled={actionLoading === selectedStory.id}
                    className="px-6 py-3 bg-white text-red-600 font-archivo-black uppercase text-sm border-4 border-black hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}