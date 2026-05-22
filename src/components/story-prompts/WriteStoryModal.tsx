"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { StoryPrompt } from "@/types/storyPrompt";
import { useAuthStore } from "@/stores/authStore";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface WriteStoryModalProps {
  promptId: string;
  promptTitle: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function WriteStoryModal({
  promptId,
  promptTitle,
  onClose,
  onSuccess,
}: WriteStoryModalProps) {
  const router = useRouter();
  const { isAuthenticated, user, getAccessToken } = useAuthStore();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError("El título y contenido son requeridos");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const accessToken = getAccessToken();

      const response = await fetch(`${API_BASE}/stories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          promptId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al crear historia");
      }

      // Success - close modal and refresh
      onSuccess?.();
      onClose();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de red");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AnimatePresence>
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -1 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.9, rotate: 1 }}
          className="fixed inset-0 z-[1001] flex items-center justify-center p-4 pointer-events-none"
        >
          <div
            className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-edn-neon-yellow border-b-4 border-black p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-archivo-black text-xs text-black/60 uppercase tracking-widest">
                    Escribí tu historia
                  </p>
                  <h2 className="font-syne font-extrabold text-2xl text-black uppercase tracking-tight mt-1">
                    {promptTitle}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 bg-black text-edn-neon-yellow font-archivo-black text-xl border-4 border-black hover:bg-black/80 transition-colors flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="mb-6 p-4 bg-red-500 text-white font-archivo-black text-sm uppercase border-4 border-red-600">
                  {error}
                </div>
              )}

              <div className="mb-6">
                <label
                  htmlFor="title"
                  className="block font-archivo-black text-xs text-black/60 uppercase tracking-widest mb-2"
                >
                  Título de tu historia
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="El título de tu historia..."
                  maxLength={200}
                  className="
                    w-full px-4 py-3 bg-white border-4 border-black
                    font-syne font-bold text-lg text-black
                    placeholder:text-black/30
                    focus:outline-none focus:ring-4 focus:ring-edn-neon-yellow
                    transition-all
                  "
                />
                <p className="mt-1 text-xs text-black/40 font-plus-jakarta">
                  {title.length}/200 caracteres
                </p>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="content"
                  className="block font-archivo-black text-xs text-black/60 uppercase tracking-widest mb-2"
                >
                  Tu historia
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Escribí tu historia aquí... ¿Qué pasa con los personajes? ¿Cómo se desarrolla la trama?"
                  rows={12}
                  className="
                    w-full px-4 py-3 bg-white border-4 border-black
                    font-plus-jakarta text-base text-black leading-relaxed
                    placeholder:text-black/30
                    focus:outline-none focus:ring-4 focus:ring-edn-neon-yellow
                    transition-all resize-none
                  "
                />
                <p className="mt-1 text-xs text-black/40 font-plus-jakarta">
                  Mínimo 100 caracteres, máximo 10,000
                </p>
              </div>

              {/* Author info */}
              <div className="mb-6 p-4 bg-black/5 border-4 border-black">
                <p className="font-archivo-black text-xs text-black/60 uppercase">
                  Escribís como
                </p>
                <p className="font-syne font-bold text-black mt-1">
                  @{user?.username || "usuario"}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="
                    flex-1 px-6 py-4 bg-white text-black font-archivo-black uppercase text-sm
                    border-4 border-black
                    shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                    hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                    hover:translate-x-[-2px] hover:translate-y-[-2px]
                    transition-all duration-150
                  "
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !title.trim() || !content.trim()}
                  className="
                    flex-1 px-6 py-4 bg-black text-edn-neon-yellow font-archivo-black uppercase text-sm
                    border-4 border-black
                    shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                    hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                    hover:translate-x-[-2px] hover:translate-y-[-2px]
                    transition-all duration-150
                    disabled:opacity-50 disabled:cursor-not-allowed
                    disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                  "
                >
                  {isLoading ? "Publicando..." : "Publicar Historia"}
                </button>
              </div>

              <p className="mt-4 text-center text-xs text-black/40 font-plus-jakarta">
                Tu historia será revisada antes de ser publicada públicamente.
              </p>
            </form>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );
}