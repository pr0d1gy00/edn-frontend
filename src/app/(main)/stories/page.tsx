"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { StoryPrompt } from "@/types/storyPrompt";
import StoryPromptCard from "@/components/story-prompts/StoryPromptCard";
import { AnimatePresence, motion } from "framer-motion";

export default function StoriesPage() {
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

  return (
    <div className="min-h-screen bg-white" id="stories">
      {/* Neo-brutalist header */}
      <header className="px-4 sm:px-8 py-8 md:py-12 border-b-4 border-black">
        <div className="max-w-6xl mx-auto">

          <h1 className="font-syne text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-black uppercase tracking-tight">
            STORY PROMPTS
          </h1>
          <div className="mt-3 sm:mt-4 w-32 sm:w-48 h-2 sm:h-3 bg-black" />
          <p className="font-plus-jakarta text-black/60 mt-3 sm:mt-4 text-base sm:text-lg">
            Elegí el tema de la próxima historia de la comunidad.
          </p>
        </div>
      </header>

      {/* Main content */}
      <section className="py-8 md:py-12 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-64 bg-black/10 border-4 border-black animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="font-archivo-black text-2xl text-red-500 uppercase">
                Error: {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-3 bg-edn-neon-yellow border-4 border-black font-archivo-black text-black uppercase hover:bg-[#e5b800] transition-colors"
              >
                Reintentar
              </button>
            </div>
          ) : prompts.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-syne text-3xl text-black/40 uppercase">
                No hay story prompts disponibles
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {prompts.map((prompt, index) => (
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
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
