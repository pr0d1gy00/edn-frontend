"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import type { Story } from "@/types/storyPrompt";
import StoryModal from "./StoryModal";
import VoteButtons from "./VoteButtons";

interface Author {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
}

interface StoriesListProps {
  promptId: string;
  initialLimit?: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

export default function StoriesList({ promptId, initialLimit = 6 }: StoriesListProps) {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: initialLimit,
    total: 0,
    totalPages: 0,
  });

  const fetchStories = useCallback(async (page: number, limit: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      // Request 2x limit to detect if there are more pages
      const response = await fetch(`${apiBase}/stories?page=${page}&limit=${limit * 2}`);
      if (!response.ok) throw new Error("Error fetching stories");
      const data = await response.json();

      const storiesArray: Story[] = Array.isArray(data) ? data : data.data || [];
      // Filter by promptId
      const filtered = storiesArray.filter((s) => s.promptId === promptId);
      // Apply limit
      const paginatedStories = filtered.slice(0, limit);
      // Check if there's more data (we got more than limit)
      const hasMore = filtered.length > limit;

      setStories(paginatedStories);
      // Estimate total - page * limit + remaining
      const estimatedTotal = (page - 1) * limit + filtered.length;
      setPagination((prev) => ({
        ...prev,
        page,
        limit,
        total: estimatedTotal,
        totalPages: hasMore ? page + 1 : page,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading stories");
    } finally {
      setIsLoading(false);
    }
  }, [promptId]);

  useEffect(() => {
    fetchStories(pagination.page, pagination.limit);
  }, [promptId, pagination.page, pagination.limit, fetchStories]);

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLimitChange = (newLimit: number) => {
    setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  };

  if (isLoading) {
    return (
      <div data-testid="stories-loading" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-48 bg-black/10 border-4 border-black animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="font-archivo-black text-lg text-red-500 uppercase">
          Error: {error}
        </p>
      </div>
    );
  }

  const displayStories = stories;

  if (displayStories.length === 0) {
    return (
      <div className="text-center py-12 border-4 border-black bg-white">
        <p className="font-syne text-2xl text-black/40 uppercase">
          No hay historias aún
        </p>
        <p className="font-plus-jakarta text-black/50 mt-2">
          ¡Sé el primero en escribir una historia para este prompt!
        </p>
      </div>
    );
  }

  return (
    <div className="px-8">
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {displayStories.map((story) => (
        <article
          key={story.id}
          onClick={() => setSelectedStory(story)}
          className="
            bg-white border-4 border-black cursor-pointer
            shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
            hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]
            hover:translate-x-[-4px] hover:translate-y-[-4px]
            transition-all duration-150
          "
        >
          <div className="bg-edn-neon-yellow border-b-4 border-black p-5">
            <h3 className="font-syne font-extrabold text-xl text-black uppercase leading-tight tracking-tight">
              {story.title}
            </h3>
          </div>
          <div className="p-5">
            <p className="font-plus-jakarta text-sm text-black/70 leading-relaxed">
              {truncateText(story.content, 150)}
            </p>
          </div>
          <div className="px-5 pb-5 flex justify-end">
            <VoteButtons
              storyId={story.id}
              initialScore={story._count?.votes}
              initialUserVote={story.userVote}
              size="sm"
              layout="horizontal"
            />
          </div>
        </article>
      ))}
      </div>

      {/* Pagination controls */}
      {pagination.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-archivo-black text-xs text-black/60 uppercase">
              Historias por página:
            </span>
            <select
              value={pagination.limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
              className="
                px-3 py-2 bg-white border-2 border-black
                font-archivo-black text-sm text-black
                focus:outline-none focus:ring-2 focus:ring-edn-neon-yellow
              "
            >
              <option value={6}>6</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1 || isLoading}
              className="
                px-4 py-2 bg-black text-white font-archivo-black text-sm uppercase
                border-2 border-black disabled:opacity-50
                hover:bg-edn-neon-yellow hover:text-black
                transition-colors
              "
            >
              ← Anterior
            </button>
            <span className="px-4 py-2 bg-edn-neon-yellow text-black font-archivo-black text-sm border-2 border-black">
              {pagination.page} / {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages || isLoading}
              className="
                px-4 py-2 bg-black text-white font-archivo-black text-sm uppercase
                border-2 border-black disabled:opacity-50
                hover:bg-edn-neon-yellow hover:text-black
                transition-colors
              "
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}

      {/* Story detail modal */}
      <StoryModal
        story={selectedStory}
        onClose={() => setSelectedStory(null)}
      />
    </div>
  );
}
