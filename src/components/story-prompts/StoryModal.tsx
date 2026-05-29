"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { Story } from "@/types/storyPrompt";
import VoteButtons from "./VoteButtons";

interface Author {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
}

interface StoryModalProps {
  story: Story | null;
  onClose: () => void;
}

function isCDNUrl(url: string): boolean {
  return (
    url.includes("s3.") ||
    url.includes("cdn.") ||
    url.includes("idrivee2") ||
    url.includes("facebook.com") ||
    url.includes("r2.dev")
  );
}

export default function StoryModal({ story, onClose }: StoryModalProps) {
  const [author, setAuthor] = useState<Author | null>(null);
  const [isLoadingAuthor, setIsLoadingAuthor] = useState(false);

  useEffect(() => {
    if (!story?.authorId) return;

    const fetchAuthor = async () => {
      setIsLoadingAuthor(true);
      try {
        const apiBase =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const response = await fetch(`${apiBase}/users/${story.authorId}`);
        if (response.ok) {
          const data = await response.json();
          // Handle both { data: User } and direct User object
          const user = data.data || data;
          setAuthor(user);
        }
      } catch {
        // Silently fail - author info is nice to have
      } finally {
        setIsLoadingAuthor(false);
      }
    };

    fetchAuthor();
  }, [story?.authorId]);

  return (
    <AnimatePresence>
      {story && (
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
            initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotate: 2 }}
            className="fixed inset-0 z-[1001] flex items-center justify-center p-2 sm:p-4 pointer-events-none"
          >
            <div
              className="bg-white border-4 border-black rounded-none shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-[calc(100%-1rem)] sm:max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header - yellow bar with close */}
              <div className="sticky top-0 bg-[#f9c937] border-b-4 border-black p-2 sm:p-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  {/* Author avatar */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black border-2 sm:border-4 border-black flex items-center justify-center overflow-hidden">
                    {author?.avatarUrl ? (
                      <Image
                        src={author.avatarUrl}
                        alt={author.username}
                        width={36}
                        height={36}
                        className="object-cover"
                        unoptimized={isCDNUrl(author.avatarUrl)}
                      />
                    ) : (
                      <span className="font-archivo-black text-base sm:text-xl text-[#f9c937] uppercase">
                        {author?.username?.charAt(0) || "?"}
                      </span>
                    )}
                  </div>
                  <div>
                    {isLoadingAuthor ? (
                      <div className="w-20 sm:w-24 h-4 bg-black/20 animate-pulse" />
                    ) : (
                      <p className="font-archivo-black text-xs sm:text-sm text-black uppercase tracking-wider">
                        @{author?.username || " autor desconocido"}
                      </p>
                    )}
                    <p className="font-plus-jakarta text-xs text-black/60">
                      Historia
                    </p>
                  </div>

                  {/* Vote buttons - hidden on small mobile */}
                  <div className="ml-2 sm:ml-4 hidden sm:block">
                    <VoteButtons
                      storyId={story.id}
                      initialScore={story.score}
                      initialUserVote={story.userVote}
                      size="sm"
                      layout="horizontal"
                    />
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-black text-[#f9c937] font-archivo-black text-lg sm:text-xl border-2 sm:border-4 border-black hover:bg-black/80 transition-colors flex items-center justify-center"
                  aria-label="Cerrar"
                >
                  ✕
                </button>
              </div>

              {/* Vote buttons - visible on mobile below header */}
              <div className="sm:hidden bg-[#f9c937] p-2 border-b-4 border-black">
                <VoteButtons
                  storyId={story.id}
                  initialScore={story.score}
                  initialUserVote={story.userVote}
                  size="sm"
                  layout="horizontal"
                />
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6 md:p-8">
                {/* Title */}
                <h2 className="font-syne font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl text-black uppercase leading-tight tracking-tight mb-4 sm:mb-6">
                  {story.title}
                </h2>

                {/* Meta info */}
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b-4 border-black flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg">📅</span>
                    <span className="font-archivo-black text-xs sm:text-sm text-black/60 uppercase">
                      {story.createdAt
                        ? new Date(story.createdAt).toLocaleDateString(
                            "es-AR",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )
                        : "Fecha desconocida"}
                    </span>
                  </div>
                </div>

                {/* Story content - full text */}
                <div className="prose prose-lg max-w-none">
                  <p className="font-plus-jakarta text-sm sm:text-base text-black leading-relaxed whitespace-pre-wrap">
                    {story.content}
                  </p>
                </div>
              </div>

              {/* Footer decoration */}
              <div className="bg-black p-3 sm:p-4 flex items-center justify-center gap-4">
                <div className="flex-1 h-1 bg-[#f9c937]" />
                <span className="font-archivo-black text-xs text-[#f9c937] uppercase">
                  ✦ EDN STORIES ✦
                </span>
                <div className="flex-1 h-1 bg-[#f9c937]" />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}