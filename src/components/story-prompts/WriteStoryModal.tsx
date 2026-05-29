"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { StoryPrompt } from "@/types/storyPrompt";
import { useAuthStore } from "@/stores/authStore";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface WriteStoryModalProps {
  promptId: string;
  promptTitle: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const MIN_CONTENT_LENGTH = 100;
const MAX_TITLE_LENGTH = 200;
const MAX_CONTENT_LENGTH = 10000;

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
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Handle Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (title.trim() || content.trim()) {
          if (confirm("¿Salir sin guardar tu historia?")) {
            onClose();
          }
        } else {
          onClose();
        }
      }
    },
    [title, content, onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Redirect to login if not authenticated when component mounts
  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError("El título y contenido son requeridos");
      return;
    }

    if (content.trim().length < MIN_CONTENT_LENGTH) {
      setError(`Tu historia debe tener al menos ${MIN_CONTENT_LENGTH} caracteres`);
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

  const handleLoginRedirect = () => {
    onClose();
    router.push("/login");
  };

  const canSubmit = title.trim().length > 0 && content.trim().length >= MIN_CONTENT_LENGTH && !isLoading;
  const contentLength = content.trim().length;
  const isContentTooShort = contentLength > 0 && contentLength < MIN_CONTENT_LENGTH;

  if (showLoginPrompt) {
    return (
      <AnimatePresence>
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm"
          />

          {/* Login Prompt Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -1 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotate: 1 }}
            className="fixed inset-0 z-[1001] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-md pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-edn-neon-yellow border-b-4 border-black p-6">
                <div className="flex items-center justify-between">
                  <p className="font-archivo-black text-xs text-black/60 uppercase tracking-widest">
                    ¡Ups!
                  </p>
                  <button
                    onClick={onClose}
                    className="w-10 h-10 bg-black text-edn-neon-yellow font-archivo-black text-xl border-4 border-black hover:bg-black/80 transition-colors flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="text-5xl mb-4">🔒</div>
                  <h3 className="font-syne font-extrabold text-xl text-black uppercase mb-2">
                    Iniciá sesión para continuar
                  </h3>
                  <p className="font-plus-jakarta text-black/60 text-sm">
                    Necesitás estar registrado para escribir tu historia y participar de la comunidad.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleLoginRedirect}
                    className="
                      w-full px-6 py-4 bg-black text-edn-neon-yellow font-archivo-black uppercase text-sm
                      border-4 border-black
                      shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                      hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                      hover:translate-x-[-2px] hover:translate-y-[-2px]
                      transition-all duration-150
                    "
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    onClick={onClose}
                    className="
                      w-full px-6 py-4 bg-white text-black font-archivo-black uppercase text-sm
                      border-4 border-black
                      shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                      hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                      hover:translate-x-[-2px] hover:translate-y-[-2px]
                      transition-all duration-150
                    "
                  >
                    Volver
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <>
        {/* Backdrop - close on click only if no content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm"
          onClick={() => {
            if (title.trim() || content.trim()) {
              if (confirm("¿Salir sin guardar tu historia?")) {
                onClose();
              }
            } else {
              onClose();
            }
          }}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -1 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.9, rotate: 1 }}
          className="fixed inset-0 z-[1001] flex items-center justify-center p-4 pointer-events-none"
        >
          <div
            className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-2xl max-h-[95vh] overflow-y-auto pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-edn-neon-yellow border-b-4 border-black p-4 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-archivo-black text-xs text-black/60 uppercase tracking-widest">
                    Escribí tu historia
                  </p>
                  <h2 className="font-syne font-extrabold text-xl sm:text-2xl text-black uppercase tracking-tight mt-1 truncate">
                    {promptTitle}
                  </h2>
                </div>
                <button
                  onClick={() => {
                    if (title.trim() || content.trim()) {
                      if (confirm("¿Salir sin guardar tu historia?")) {
                        onClose();
                      }
                    } else {
                      onClose();
                    }
                  }}
                  className="w-10 h-10 bg-black text-edn-neon-yellow font-archivo-black text-xl border-4 border-black hover:bg-black/80 transition-colors flex items-center justify-center flex-shrink-0"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 sm:p-6">
              {error && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-500 text-white font-archivo-black text-xs sm:text-sm uppercase border-4 border-red-600">
                  {error}
                </div>
              )}

              {/* Title */}
              <div className="mb-4 sm:mb-6">
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
                  onChange={(e) => setTitle(e.target.value.slice(0, MAX_TITLE_LENGTH))}
                  placeholder="El título de tu historia..."
                  maxLength={MAX_TITLE_LENGTH}
                  className="
                    w-full px-3 sm:px-4 py-3 bg-white border-4 border-black
                    font-syne font-bold text-base sm:text-lg text-black
                    placeholder:text-black/30
                    focus:outline-none focus:ring-4 focus:ring-edn-neon-yellow
                    transition-all
                  "
                />
                <p className="mt-1 text-xs text-black/40 font-plus-jakarta">
                  {title.length}/{MAX_TITLE_LENGTH} caracteres
                </p>
              </div>

              {/* Content */}
              <div className="mb-4 sm:mb-6">
                <label
                  htmlFor="content"
                  className="block font-archivo-black text-xs text-black/60 uppercase tracking-widest mb-2"
                >
                  Tu historia
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value.slice(0, MAX_CONTENT_LENGTH))}
                  placeholder="Escribí tu historia aquí... ¿Qué pasa con los personajes? ¿Cómo se desarrolla la trama?"
                  rows={10}
                  className="
                    w-full px-3 sm:px-4 py-3 bg-white border-4 border-black
                    font-plus-jakarta text-sm sm:text-base text-black leading-relaxed
                    placeholder:text-black/30
                    focus:outline-none focus:ring-4 focus:ring-edn-neon-yellow
                    transition-all resize-none
                  "
                />
                <div className="mt-1 flex flex-wrap gap-2 items-center justify-between">
                  <p className="text-xs text-black/40 font-plus-jakarta">
                    Mínimo {MIN_CONTENT_LENGTH} caracteres
                  </p>
                  <p className={`text-xs font-plus-jakarta ${
                    isContentTooShort 
                      ? "text-red-500" 
                      : contentLength >= MIN_CONTENT_LENGTH 
                        ? "text-green-600" 
                        : "text-black/40"
                  }`}>
                    {contentLength.toLocaleString()}/{MAX_CONTENT_LENGTH.toLocaleString()} caracteres
                    {isContentTooShort && ` (faltan ${MIN_CONTENT_LENGTH - contentLength})`}
                    {!isContentTooShort && contentLength >= MIN_CONTENT_LENGTH && " ✓"}
                  </p>
                </div>
              </div>

              {/* Author info */}
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-black/5 border-4 border-black">
                <p className="font-archivo-black text-xs text-black/60 uppercase">
                  Escribís como
                </p>
                <p className="font-syne font-bold text-black mt-1 truncate">
                  @{user?.username || "usuario"}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (title.trim() || content.trim()) {
                      if (confirm("¿Salir sin guardar tu historia?")) {
                        onClose();
                      }
                    } else {
                      onClose();
                    }
                  }}
                  className="
                    flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-white text-black font-archivo-black uppercase text-xs sm:text-sm
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
                  disabled={!canSubmit}
                  className="
                    flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-black text-edn-neon-yellow font-archivo-black uppercase text-xs sm:text-sm
                    border-4 border-black
                    shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                    hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                    hover:translate-x-[-2px] hover:translate-y-[-2px]
                    transition-all duration-150
                    disabled:opacity-50 disabled:cursor-not-allowed
                    disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                    flex items-center justify-center gap-2
                  "
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Publicando...
                    </>
                  ) : (
                    "Publicar Historia"
                  )}
                </button>
              </div>

              <p className="mt-4 text-center text-xs text-black/40 font-plus-jakarta px-2">
                Tu historia será revisada antes de ser publicada públicamente.
              </p>
            </form>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );
}