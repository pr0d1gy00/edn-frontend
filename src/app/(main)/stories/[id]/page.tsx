"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import type { StoryPrompt } from "@/types/storyPrompt";
import StoriesList from "@/components/story-prompts/StoriesList";
import WriteStoryModal from "@/components/story-prompts/WriteStoryModal";
import { useAuthStore } from "@/stores/authStore";

const STATUS_CONFIG: Record<
  string,
  { text: string; bg: string; textColor: string }
> = {
  open: {
    text: "ABIERTO",
    bg: "bg-green-500",
    textColor: "text-white",
  },
  closed: {
    text: "CERRADO",
    bg: "bg-gray-500",
    textColor: "text-white",
  },
};

export default function StoryPromptDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [prompt, setPrompt] = useState<StoryPrompt | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWriteModal, setShowWriteModal] = useState(false);

  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!id) return;

    const fetchPrompt = async () => {
      try {
        const apiBase =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const response = await fetch(`${apiBase}/story-prompts/${id}`);
        if (!response.ok) throw new Error("Error fetching prompt");
        const data = await response.json();
        const promptData = data.data ?? data;
        setPrompt(promptData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error loading prompt",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrompt();
  }, [id]);

  if (isLoading) {
    return (
      <div data-testid="detail-loading" className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-8 py-16">
          <div className="h-12 w-64 bg-black/10 border-4 border-black animate-pulse mb-8" />
          <div className="h-8 w-32 bg-black/10 border-4 border-black animate-pulse mb-6" />
          <div className="h-48 bg-black/10 border-4 border-black animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-8 py-16">
          <div className="text-center py-16">
            <p className="font-archivo-black text-2xl text-red-500 uppercase">
              Error: {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-8 py-16">
          <Link
            href="/stories"
            className="inline-flex items-center gap-2 font-archivo-black text-sm text-black/60 uppercase hover:text-black transition-colors mb-8"
          >
            ← Volver a historias
          </Link>
          <div className="text-center py-16">
            <p className="font-syne text-3xl text-black/40 uppercase">
              Prompt no encontrado
            </p>
          </div>
        </div>
      </div>
    );
  }

  const status = prompt.isOpen ? "open" : "closed";
  const statusInfo = STATUS_CONFIG[status];

  return (
    <div className="min-h-screen bg-white">


      {/* Header */}
      <header className="px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start gap-4 flex-wrap">
            <div className="flex-1">
              <p className="font-archivo-black text-xs text-black/40 uppercase tracking-widest mb-2">
                STORY PROMPTS
              </p>
              <h1 className="font-syne text-5xl md:text-7xl font-extrabold text-black uppercase tracking-tight leading-none">
                {prompt.title}
              </h1>
            </div>
            <div
              className={`px-6 py-3 ${statusInfo.bg} border-4 border-black`}
            >
              <span
                className={`font-archivo-black text-sm ${statusInfo.textColor} uppercase tracking-wider`}
              >
                {statusInfo.text}
              </span>
            </div>
          </div>
          <div className="mt-6 w-48 h-3 bg-black" />
        </div>
      </header>

      {/* Write story button - only if prompt is open */}
      {prompt.isOpen && (
        <section className="px-8 py-6 bg-black">
          <div className="max-w-6xl mx-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowWriteModal(true)}
              className="
                w-full sm:w-auto px-8 py-4 bg-edn-neon-yellow text-black font-archivo-black uppercase text-sm
                border-4 border-edn-neon-yellow
                shadow-[4px_4px_0px_0px_rgba(249,201,55,1)]
                hover:shadow-[6px_6px_0px_0px_rgba(249,201,55,1)]
                hover:translate-x-[-2px] hover:translate-y-[-2px]
                transition-all duration-150
              "
            >
              ✎ Escribir mi historia
            </motion.button>
          </div>
        </section>
      )}

      {/* Description */}
      <section className="px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="font-archivo-black text-sm text-black/40 uppercase tracking-widest mb-4">
              Descripción
            </h2>
            <p className="font-plus-jakarta text-lg text-black/80 leading-relaxed whitespace-pre-wrap">
              {prompt.description}
            </p>
          </div>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="px-8 py-12 border-t-4 border-black bg-[#f9c937]/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-syne text-3xl font-extrabold text-black uppercase tracking-tight mb-8">
            Historias
          </h2>
          <StoriesList promptId={prompt.id} />
        </div>
      </section>

      {/* Bottom decorative bar */}
      <div className="mt-8 flex items-center justify-center gap-4 px-8 pb-8">
        <div className="flex-1 h-1 bg-black/20" />
        <span className="font-archivo-black text-xs text-black/40 uppercase">
          ✦ STORY PROMPT ✦
        </span>
        <div className="flex-1 h-1 bg-black/20" />
      </div>

      {/* Write story modal */}
      {prompt.isOpen && showWriteModal && (
        <WriteStoryModal
          promptId={prompt.id}
          promptTitle={prompt.title}
          onClose={() => setShowWriteModal(false)}
          onSuccess={() => {}}
        />
      )}
    </div>
  );
}
