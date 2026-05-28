"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StoryPrompt {
  id: string;
  title: string;
  description: string;
  isPublic: boolean;
  isOpen: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const STATUS_COLORS = {
  draft: { bg: "bg-gray-400", text: "text-white", border: "border-gray-600", label: "Borrador" },
  public: { bg: "bg-green-500", text: "text-white", border: "border-green-700", label: "Público" },
};

const VOTING_COLORS = {
  open: { bg: "bg-edn-neon-yellow", text: "text-black", border: "border-black", label: "🗳️ Abierto" },
  closed: { bg: "bg-black", text: "text-white", border: "border-black", label: "🔒 Cerrado" },
};

export default function PromptsAdminPage() {
  const [prompts, setPrompts] = useState<StoryPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<StoryPrompt | null>(null);
  const [filter, setFilter] = useState<"all" | "public" | "private">("all");
  const [showForm, setShowForm] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<StoryPrompt | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isPublic: true,
  });

  const { getAllPrompts, createPrompt, updatePrompt, deletePrompt, openVoting, closeVoting, publishPrompt, unpublishPrompt } = require("@/services/storyPromptsApi").storyPromptsApi;

  const fetchPrompts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllPrompts({ includeAll: false });
      if (response.success && response.data) {
        setPrompts(response.data);
      } else {
        setError(response.error || "Error al cargar prompts");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de red");
    } finally {
      setLoading(false);
    }
  }, [getAllPrompts]);

  useEffect(() => {
    fetchPrompts();
  }, [fetchPrompts]);

  const handleOpenForm = (prompt?: StoryPrompt) => {
    if (prompt) {
      setEditingPrompt(prompt);
      setFormData({
        title: prompt.title,
        description: prompt.description,
        isPublic: prompt.isPublic,
      });
    } else {
      setEditingPrompt(null);
      setFormData({ title: "", description: "", isPublic: true });
    }
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPrompt(null);
    setFormData({ title: "", description: "", isPublic: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (actionLoading) return;

    setActionLoading(editingPrompt?.id || "creating");
    try {
      let response;
      if (editingPrompt) {
        response = await updatePrompt(editingPrompt.id, formData);
      } else {
        response = await createPrompt(formData);
      }
      if (response.success) {
        fetchPrompts();
        handleCloseForm();
      } else {
        alert(response.error || "Error al guardar");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (prompt: StoryPrompt) => {
    if (actionLoading) return;
    if (!confirm(`¿Eliminar "${prompt.title}" permanentemente?`)) return;

    setActionLoading(prompt.id);
    try {
      const response = await deletePrompt(prompt.id);
      if (response.success) {
        fetchPrompts();
        setSelectedPrompt(null);
      } else {
        alert(response.error || "Error al eliminar");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleVoting = async (prompt: StoryPrompt) => {
    if (actionLoading) return;
    setActionLoading(prompt.id);
    try {
      const response = prompt.isOpen
        ? await closeVoting(prompt.id)
        : await openVoting(prompt.id);
      if (response.success) {
        fetchPrompts();
        setSelectedPrompt(null);
      } else {
        alert(response.error || "Error al cambiar estado de voting");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleTogglePublish = async (prompt: StoryPrompt) => {
    if (actionLoading) return;
    setActionLoading(prompt.id);
    try {
      const response = prompt.isPublic
        ? await unpublishPrompt(prompt.id)
        : await publishPrompt(prompt.id);
      if (response.success) {
        fetchPrompts();
        setSelectedPrompt(null);
      } else {
        alert(response.error || "Error al cambiar visibilidad");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredPrompts = prompts.filter((prompt) => {
    if (filter === "public") return prompt.isPublic;
    if (filter === "private") return !prompt.isPublic;
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

  if (loading && prompts.length === 0) {
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
            Prompts
          </h1>
          <p className="font-plus-jakarta text-black/50 mt-1">
            Crea y gestiona los prompts para historias
          </p>
        </div>
        <div className="flex gap-2">
          <span className="px-4 py-2 bg-black text-edn-neon-yellow font-archivo-black text-sm uppercase border-4 border-black">
            {prompts.length} prompts
          </span>
          <button
            onClick={() => handleOpenForm()}
            className="px-6 py-3 bg-edn-neon-yellow text-black font-archivo-black uppercase text-sm border-4 border-black hover:bg-yellow-400 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            + Nuevo Prompt
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(["all", "public", "private"] as const).map((f) => (
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
            {f === "all" ? "Todos" : f === "public" ? "Públicos" : "Privados"}
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
          <p className="font-archivo-black text-xs uppercase text-black/60">Total</p>
          <p className="font-syne font-extrabold text-3xl text-black">{prompts.length}</p>
        </div>
        <div className="bg-green-500 border-4 border-black p-4">
          <p className="font-archivo-black text-xs uppercase text-white/70">Públicos</p>
          <p className="font-syne font-extrabold text-3xl text-white">
            {prompts.filter((p) => p.isPublic).length}
          </p>
        </div>
        <div className="bg-black border-4 border-black p-4">
          <p className="font-archivo-black text-xs uppercase text-white/50">Abiertos</p>
          <p className="font-syne font-extrabold text-3xl text-edn-neon-yellow">
            {prompts.filter((p) => p.isOpen).length}
          </p>
        </div>
      </div>

      {/* Prompts grid */}
      {filteredPrompts.length === 0 ? (
        <div className="bg-black/5 border-4 border-dashed border-black/20 p-12 text-center">
          <p className="font-archivo-black text-black/40 uppercase">
            No hay prompts {filter === "public" ? "públicos" : filter === "private" ? "privados" : ""}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredPrompts.map((prompt, index) => (
              <motion.article
                key={prompt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.03 }}
                className={`
                  bg-white border-4 border-black
                  shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                  hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
                  hover:-translate-x-0.5 hover:-translate-y-0.5
                  transition-all duration-150
                `}
              >
                {/* Status badges */}
                <div className="bg-black p-2 flex items-center justify-between gap-2">
                  <span
                    className={`
                      px-2 py-1 font-archivo-black text-xs uppercase border-2
                      ${prompt.isPublic ? STATUS_COLORS.public.bg : STATUS_COLORS.draft.bg}
                      ${prompt.isPublic ? STATUS_COLORS.public.text : STATUS_COLORS.draft.text}
                      ${prompt.isPublic ? STATUS_COLORS.public.border : STATUS_COLORS.draft.border}
                    `}
                  >
                    {prompt.isPublic ? "🌐 Público" : "📝 Borrador"}
                  </span>
                  <span
                    className={`
                      px-2 py-1 font-archivo-black text-xs uppercase border-2
                      ${prompt.isOpen ? VOTING_COLORS.open.bg : VOTING_COLORS.closed.bg}
                      ${prompt.isOpen ? VOTING_COLORS.open.text : VOTING_COLORS.closed.text}
                      ${prompt.isOpen ? VOTING_COLORS.open.border : VOTING_COLORS.closed.border}
                    `}
                  >
                    {prompt.isOpen ? "🗳️ Abierto" : "🔒 Cerrado"}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-syne font-extrabold text-lg text-black uppercase leading-tight mb-2">
                    {truncateText(prompt.title, 50)}
                  </h3>
                  <p className="font-plus-jakarta text-sm text-black/60 leading-relaxed mb-4">
                    {truncateText(prompt.description, 100)}
                  </p>

                  {/* Meta */}
                  <div className="text-xs text-black/50 mb-4">
                    <span>{formatDate(prompt.createdAt)}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedPrompt(prompt)}
                      className="flex-1 px-3 py-2 bg-black text-white font-archivo-black text-xs uppercase border-2 border-black hover:bg-black/80 transition-colors"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => handleOpenForm(prompt)}
                      className="flex-1 px-3 py-2 bg-edn-neon-yellow text-black font-archivo-black text-xs uppercase border-2 border-black hover:bg-yellow-400 transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleToggleVoting(prompt)}
                      disabled={actionLoading === prompt.id}
                      className="px-3 py-2 bg-gray-200 text-black font-archivo-black text-xs uppercase border-2 border-black hover:bg-gray-300 transition-colors disabled:opacity-50"
                    >
                      {prompt.isOpen ? "✕" : "✓"}
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Prompt detail modal */}
      <AnimatePresence>
        {selectedPrompt && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
              onClick={() => setSelectedPrompt(null)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -1 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.9, rotate: 1 }}
              className="fixed inset-0 z-51 flex items-center justify-center p-4 pointer-events-none"
            >
              <div
                className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-3xl max-h-[90vh] overflow-y-auto pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="sticky top-0 bg-black border-b-4 border-black p-4 flex items-center justify-between z-10">
                  <div className="flex items-center gap-2">
                    <span
                      className={`
                        px-3 py-1 font-archivo-black text-sm uppercase border-2
                        ${selectedPrompt.isPublic ? STATUS_COLORS.public.bg : STATUS_COLORS.draft.bg}
                        ${selectedPrompt.isPublic ? STATUS_COLORS.public.text : STATUS_COLORS.draft.text}
                      `}
                    >
                      {selectedPrompt.isPublic ? "🌐 Público" : "📝 Borrador"}
                    </span>
                    <span
                      className={`
                        px-3 py-1 font-archivo-black text-sm uppercase border-2
                        ${selectedPrompt.isOpen ? VOTING_COLORS.open.bg : VOTING_COLORS.closed.bg}
                        ${selectedPrompt.isOpen ? VOTING_COLORS.open.text : VOTING_COLORS.closed.text}
                      `}
                    >
                      {selectedPrompt.isOpen ? "🗳️ Voting Abierto" : "🔒 Voting Cerrado"}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedPrompt(null)}
                    className="w-10 h-10 bg-edn-neon-yellow text-black font-archivo-black text-xl border-4 border-black hover:bg-edn-neon-yellow/80 transition-colors flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>

                {/* Content */}
                <div className="p-8">
                  <h2 className="font-syne font-extrabold text-2xl md:text-3xl text-black uppercase leading-tight tracking-tight mb-4">
                    {selectedPrompt.title}
                  </h2>

                  {/* Meta info */}
                  <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b-4 border-black">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📅</span>
                      <span className="font-archivo-black text-xs text-black/60 uppercase">
                        Creado: {formatDate(selectedPrompt.createdAt)}
                      </span>
                    </div>
                    {selectedPrompt.updatedAt && (
                      <div className="flex items-center gap-2">
                        <span className="text-lg">✏️</span>
                        <span className="font-archivo-black text-xs text-black/60 uppercase">
                          Actualizado: {formatDate(selectedPrompt.updatedAt)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Full description */}
                  <div className="prose prose-lg max-w-none">
                    <p className="font-plus-jakarta text-base text-black leading-relaxed whitespace-pre-wrap">
                      {selectedPrompt.description}
                    </p>
                  </div>
                </div>

                {/* Footer actions */}
                <div className="bg-black p-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleToggleVoting(selectedPrompt)}
                      disabled={actionLoading === selectedPrompt.id}
                      className={`
                        px-6 py-3 font-archivo-black uppercase text-sm border-4 transition-colors disabled:opacity-50
                        ${selectedPrompt.isOpen
                          ? "bg-red-500 text-white border-red-600 hover:bg-red-400 hover:text-black"
                          : "bg-green-500 text-white border-green-600 hover:bg-green-400 hover:text-black"
                        }
                      `}
                    >
                      {selectedPrompt.isOpen ? "🔒 Cerrar Voting" : "🗳️ Abrir Voting"}
                    </button>
                    <button
                      onClick={() => handleTogglePublish(selectedPrompt)}
                      disabled={actionLoading === selectedPrompt.id}
                      className={`
                        px-6 py-3 font-archivo-black uppercase text-sm border-4 transition-colors disabled:opacity-50
                        ${selectedPrompt.isPublic
                          ? "bg-gray-600 text-white border-gray-700 hover:bg-gray-500"
                          : "bg-green-500 text-white border-green-600 hover:bg-green-400 hover:text-black"
                        }
                      `}
                    >
                      {selectedPrompt.isPublic ? "📝 Hacer Privado" : "🌐 Hacer Público"}
                    </button>
                    <button
                      onClick={() => handleOpenForm(selectedPrompt)}
                      className="px-6 py-3 bg-edn-neon-yellow text-black font-archivo-black uppercase text-sm border-4 border-black hover:bg-yellow-400 transition-colors"
                    >
                      ✏️ Editar
                    </button>
                  </div>
                  <button
                    onClick={() => handleDelete(selectedPrompt)}
                    disabled={actionLoading === selectedPrompt.id}
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

      {/* Create/Edit form modal */}
      <AnimatePresence>
        {showForm && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
              onClick={handleCloseForm}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: 1 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.9, rotate: -1 }}
              className="fixed inset-0 z-51 flex items-center justify-center p-4 pointer-events-none"
            >
              <div
                className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="sticky top-0 bg-edn-neon-yellow border-b-4 border-black p-4 flex items-center justify-between z-10">
                  <h2 className="font-syne font-extrabold text-xl text-black uppercase">
                    {editingPrompt ? "✏️ Editar Prompt" : "➕ Nuevo Prompt"}
                  </h2>
                  <button
                    onClick={handleCloseForm}
                    className="w-10 h-10 bg-black text-edn-neon-yellow font-archivo-black text-xl border-4 border-black hover:bg-black/80 transition-colors flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8">
                  {/* Title */}
                  <div className="mb-6">
                    <label className="block font-archivo-black text-sm uppercase text-black mb-2">
                      Título del Prompt
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      maxLength={100}
                      className="w-full px-4 py-3 bg-white border-4 border-black font-plus-jakarta text-black placeholder-black/40 focus:outline-none focus:bg-edn-neon-yellow/20 transition-colors"
                      placeholder="Ej: El objeto perdido"
                    />
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <label className="block font-archivo-black text-sm uppercase text-black mb-2">
                      Descripción
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                      rows={5}
                      className="w-full px-4 py-3 bg-white border-4 border-black font-plus-jakarta text-black placeholder-black/40 focus:outline-none focus:bg-edn-neon-yellow/20 transition-colors resize-none"
                      placeholder="Describe el prompt que verán los usuarios para escribir sus historias..."
                    />
                  </div>

                  {/* Public toggle */}
                  <div className="mb-8 p-4 bg-black/5 border-4 border-black">
                    <label className="flex items-center gap-4 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isPublic}
                        onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                        className="w-6 h-6 bg-white border-4 border-black cursor-pointer accent-edn-neon-yellow"
                      />
                      <div>
                        <span className="font-archivo-black text-sm uppercase text-black block">
                          Público
                        </span>
                        <span className="font-plus-jakarta text-xs text-black/60">
                          Los usuarios podrán ver este prompt para escribir historias
                        </span>
                      </div>
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={handleCloseForm}
                      className="flex-1 py-4 bg-white text-black font-archivo-black uppercase border-4 border-black hover:bg-black/5 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={actionLoading !== null}
                      className="flex-1 py-4 bg-black text-edn-neon-yellow font-archivo-black uppercase border-4 border-black hover:bg-black/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {actionLoading && (
                        <div className="w-4 h-4 border-2 border-edn-neon-yellow border-t-transparent rounded-full animate-spin" />
                      )}
                      {editingPrompt ? "Guardar Cambios" : "Crear Prompt"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}