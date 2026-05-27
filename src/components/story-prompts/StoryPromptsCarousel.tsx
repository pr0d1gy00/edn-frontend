"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { StoryPrompt } from "@/types/storyPrompt";
import StoryPromptCard from "./StoryPromptCard";

const PREVIEW_LIMIT = 6;

export default function StoryPromptsCarousel() {
  const [prompts, setPrompts] = useState<StoryPrompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const apiBase =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const response = await fetch(`${apiBase}/story-prompts`);
        if (!response.ok) throw new Error("Error fetching story prompts");
        const data = await response.json();

        const promptsArray = Array.isArray(data)
          ? data
          : data.data || [];
        setPrompts(promptsArray);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error loading story prompts",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrompts();
  }, []);

  if (error) {
    return null;
  }

  if (isLoading) {
    return (
      <section
        id="story-prompts"
        className="py-16 bg-black border-t-4 border-[#f9c937]"
      >
        <div className="px-8 mb-8">
          <h2 className="font-syne text-4xl md:text-5xl font-extrabold text-[#f9c937] uppercase tracking-tight">
            HISTORIAS DE LA COMUNIDAD
          </h2>
          <div className="mt-4 w-48 h-2 bg-[#f9c937]" />
        </div>
        <div className="px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-48 bg-white/10 border-4 border-white/20 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (prompts.length === 0) {
    return (
      <section
        id="story-prompts"
        className="py-16 bg-black border-t-4 border-[#f9c937]"
      >
        <div className="px-8 mb-8">
          <h2 className="font-syne text-4xl md:text-5xl font-extrabold text-[#f9c937] uppercase tracking-tight">
            HISTORIAS DE LA COMUNIDAD
          </h2>
          <div className="mt-4 w-48 h-2 bg-[#f9c937]" />
        </div>
        <div className="px-8">
          <p className="text-white/70 font-syne text-xl text-center py-12">
            No hay historias para votar por ahora. ¡Volvé más tarde!
          </p>
        </div>
      </section>
    );
  }

  const previewPrompts = prompts.slice(0, PREVIEW_LIMIT);

  return (
    <section
      id="story-prompts"
      className="py-16 bg-black border-t-4 border-[#f9c937]"
    >
      {/* Section header */}
      <div className="px-8 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4">
              <h2 className="font-syne text-4xl md:text-5xl font-extrabold text-[#f9c937] uppercase tracking-tighter">
                HISTORIAS
              </h2>
              <h2 className="font-syne text-4xl md:text-5xl font-extrabold text-white uppercase tracking-tighter">
                DE LA COMUNIDAD
              </h2>
            </div>
            <div className="flex-1 h-4 bg-[#f9c937] mt-2 mb-2" />
            <p className="mt-2 font-archivo-black text-sm text-white/60 uppercase tracking-widest">
              Temas para votar — ¡Elegí la próxima historia!
            </p>
          </div>
        </div>
      </div>

      {/* Grid preview */}
      <div className="px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {previewPrompts.map((prompt, index) => (
            <motion.div
              key={prompt.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.05,
                type: "spring",
                stiffness: 150,
                damping: 20,
              }}
            >
              <StoryPromptCard prompt={prompt} index={index} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* VER TODAS button */}
      <div className="px-8 mt-8">
        <Link
          href="/stories"
          className="
            inline-block px-8 py-4 bg-[#f9c937] border-4 border-black
            font-archivo-black text-black text-lg uppercase tracking-wider
            shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
            hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
            hover:translate-x-[-4px] hover:translate-y-[-4px]
            hover:bg-[#e5b800]
            transition-all duration-150
          "
        >
          VER TODAS →
        </Link>
      </div>

      {/* Bottom decorative bar */}
      <div className="mt-12 flex items-center justify-center gap-4 px-8">
        <div className="flex-1 h-1 bg-[#f9c937]" />
        <span className="font-archivo-black text-xs text-[#f9c937] uppercase">
          ✦ STORY PROMPTS ✦
        </span>
        <div className="flex-1 h-1 bg-[#f9c937]" />
      </div>
    </section>
  );
}