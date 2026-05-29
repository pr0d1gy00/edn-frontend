"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Episode, Guest, InsideJoke } from "@/types/episode";
import { PLATFORM_COLORS, PLATFORM_ICONS, formatDuration } from "./EpisodeCard";
import { useState } from "react";

interface EpisodeModalProps {
  episode: Episode;
  onClose: () => void;
}

function GuestCard({ guest }: { guest: Guest }) {
  return (
    <div className="p-3 sm:p-4 bg-white border-3 sm:border-4 border-black rounded-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex items-center gap-2 sm:gap-3 mb-2">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#f9c937] border-2 border-black rounded-sm flex items-center justify-center">
          <span className="font-archivo-black text-sm sm:text-lg text-black">
            {guest.name[0]}
          </span>
        </div>
        <h4 className="font-archivo-black text-sm sm:text-lg text-black uppercase truncate">
          {guest.name}
        </h4>
      </div>
      <p className="font-plus-jakarta text-xs sm:text-sm text-black/70 mb-2 sm:mb-3 line-clamp-2">
        {guest.bio}
      </p>
      <div className="flex gap-1.5 sm:gap-2 flex-wrap">
        {guest.twitterHandle && (
          <a
            href={`https://twitter.com/${guest.twitterHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 sm:px-3 py-1 sm:py-1.5 bg-black text-white font-archivo-black text-[10px] sm:text-xs uppercase rounded-sm border-2 border-black hover:bg-black/80 transition-colors flex items-center gap-1"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span className="hidden sm:inline">@{guest.twitterHandle}</span>
            <span className="sm:hidden">X</span>
          </a>
        )}
        {guest.instagramHandle && (
          <a
            href={`https://instagram.com/${guest.instagramHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 sm:px-3 py-1 sm:py-1.5 bg-black text-white font-archivo-black text-[10px] sm:text-xs uppercase rounded-sm border-2 border-black hover:bg-black/80 transition-colors flex items-center gap-1"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            <span className="hidden sm:inline">@{guest.instagramHandle}</span>
            <span className="sm:hidden">IG</span>
          </a>
        )}
      </div>
    </div>
  );
}

function InsideJokeCard({ joke }: { joke: InsideJoke }) {
  return (
    <div className="p-2.5 sm:p-3 bg-[#f9c937]/20 border-2 border-[#f9c937] rounded-sm">
      <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
        <span className="px-1.5 sm:px-2 py-0.5 bg-[#f9c937] text-black font-archivo-black text-[10px] sm:text-xs uppercase border border-black rounded-sm">
          ⏱ {joke.startTimeStamp}
        </span>
        <span className="font-archivo-black text-[10px] sm:text-xs text-black/60">
          → {joke.endTimeStamp}
        </span>
      </div>
      <h5 className="font-archivo-black text-xs sm:text-sm text-black uppercase mb-1">
        {joke.keyConcept}
      </h5>
      <p className="font-plus-jakarta text-[10px] sm:text-xs text-black/70 italic line-clamp-2">
        {joke.transcriptContext}
      </p>
    </div>
  );
}

export default function EpisodeModal({ episode, onClose }: EpisodeModalProps) {
  const publishedDate = new Date(episode.publishedAt);
  const formattedDate = publishedDate.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const hasImages = episode?.images && episode.images.length > 0;
  const imagesForCarousel = hasImages
    ? episode.images!.map((img) => img.url)
    : episode?.thumbnailUrl
      ? [episode.thumbnailUrl]
      : [];
  const hasGuests = episode.guests && episode.guests.length > 0;
  const hasJokes = episode.insideJokes && episode.insideJokes.length > 0;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const isCDNUrl = (url: string) => {
    return (
      url.includes("s3.") ||
      url.includes("cdn.") ||
      url.includes("idrivee2") ||
      url.includes("facebook.com") ||
      url.includes("r2.dev")
    );
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, rotate: -2 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0.8, rotate: 2 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white border-4 border-black rounded-md shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
      >
        <div className="relative flex items-center justify-center flex-col max-h-[250px] sm:max-h-[400px] lg:max-h-[500px] bg-[#f9c937]">
          {imagesForCarousel.length > 0 ? (
            <>
              <Image
                src={imagesForCarousel[currentImageIndex]}
                alt={`${episode.title} - Imagen ${currentImageIndex + 1}`}
                className="object-cover"
                width={400}
                height={400}
                unoptimized={isCDNUrl(imagesForCarousel[currentImageIndex])}
              />
              {/* Carousel controls */}
              {imagesForCarousel.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentImageIndex((prev) =>
                        prev === 0 ? imagesForCarousel.length - 1 : prev - 1,
                      )
                    }
                    className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 bg-black/50 text-white font-archivo-black text-sm border-2 border-black hover:bg-black transition-colors flex items-center justify-center"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() =>
                      setCurrentImageIndex((prev) =>
                        prev === imagesForCarousel.length - 1 ? 0 : prev + 1,
                      )
                    }
                    className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 bg-black/50 text-white font-archivo-black text-sm border-2 border-black hover:bg-black transition-colors flex items-center justify-center"
                  >
                    ›
                  </button>
                  {/* Image indicators */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {imagesForCarousel.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-2 h-2 rounded-full border-2 border-black ${
                          idx === currentImageIndex
                            ? "bg-[#f9c937]"
                            : "bg-black/50"
                        }`}
                      />
                    ))}
                  </div>
                  {/* Image counter */}
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 sm:px-2 sm:py-1 bg-black text-[#f9c937] font-archivo-black text-[10px] sm:text-xs border-2 border-black">
                    {currentImageIndex + 1}/{imagesForCarousel.length}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-archivo-black text-4xl sm:text-6xl text-black/20">
                #{episode.episodeNumber}
              </span>
            </div>
          )}

          <button
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 bg-black text-[#f9c937] font-archivo-black text-lg sm:text-2xl border-2 border-black rounded-sm hover:bg-black/80 transition-colors"
          >
            ✕
          </button>

          <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 flex gap-1.5 sm:gap-2 flex-wrap">
            <span
              className={`px-2 py-0.5 sm:px-3 sm:py-1 ${PLATFORM_COLORS[episode.platformType]} text-white font-archivo-black text-[10px] sm:text-sm uppercase tracking-wider rounded-sm border-2 border-black`}
            >
              {PLATFORM_ICONS[episode.platformType]} {episode.platformType}
            </span>
            {episode.isExclusive && (
              <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-[#f9c937] text-black font-archivo-black text-[10px] sm:text-sm uppercase tracking-wider rounded-sm border-2 border-black animate-pulse">
                ★ EXCLUSIVO
              </span>
            )}
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-black text-[#f9c937] font-archivo-black text-base sm:text-xl flex items-center justify-center rounded-sm border-2 border-black flex-shrink-0">
              #{episode.episodeNumber}
            </div>
            <div>
              <h2 className="font-syne font-extrabold text-xl sm:text-2xl lg:text-3xl text-black uppercase leading-tight">
                {episode.title}
              </h2>
            </div>
          </div>

          <p className="mt-4 sm:mt-6 font-plus-jakarta text-sm sm:text-base lg:text-lg text-black/80 leading-relaxed">
            {episode.description}
          </p>

          <div className="flex flex-wrap gap-3 sm:gap-6 mt-4 sm:mt-6 p-3 sm:p-4 bg-black/5 border-3 sm:border-4 border-black rounded-sm">
            <div>
              <span className="font-archivo-black text-[10px] sm:text-xs text-black/50 uppercase block">
                Fecha
              </span>
              <span className="font-archivo-black text-sm sm:text-base lg:text-lg text-black">
                {formattedDate}
              </span>
            </div>
            {episode.durationSeconds && (
              <div>
                <span className="font-archivo-black text-[10px] sm:text-xs text-black/50 uppercase block">
                  Duración
                </span>
                <span className="font-archivo-black text-sm sm:text-base lg:text-lg text-black">
                  {formatDuration(episode.durationSeconds)}
                </span>
              </div>
            )}
            <div>
              <span className="font-archivo-black text-[10px] sm:text-xs text-black/50 uppercase block">
                Episodio
              </span>
              <span className="font-archivo-black text-sm sm:text-base lg:text-lg text-black">
                #{episode.episodeNumber}
              </span>
            </div>
          </div>

          {/* Guests Section */}
          {hasGuests && (
            <div className="mt-6 sm:mt-8">
              <h3 className="font-archivo-black text-base sm:text-xl text-black uppercase mb-3 sm:mb-4 flex items-center gap-2">
                <span className="w-7 h-7 sm:w-8 sm:h-8 bg-[#f9c937] border-2 border-black rounded-sm flex items-center justify-center text-sm">
                  👥
                </span>
                INVITADOS
              </h3>
              <div className="grid gap-2 sm:gap-3">
                {episode.guests!.map((guest) => (
                  <GuestCard key={guest.id} guest={guest} />
                ))}
              </div>
            </div>
          )}

          {/* Inside Jokes / Topics Section */}
          {hasJokes && (
            <div className="mt-6 sm:mt-8">
              <h3 className="font-archivo-black text-base sm:text-xl text-black uppercase mb-3 sm:mb-4 flex items-center gap-2">
                <span className="w-7 h-7 sm:w-8 sm:h-8 bg-[#f9c937] border-2 border-black rounded-sm flex items-center justify-center text-sm">
                  💬
                </span>
                BROMAS INTERNAS
              </h3>
              <div className="grid gap-2 sm:gap-3">
                {episode.insideJokes!.map((joke) => (
                  <InsideJokeCard key={joke.id} joke={joke} />
                ))}
              </div>
            </div>
          )}

          {episode.contentUrl && (
            <a
              href={episode.contentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 text-center sm:mt-8 w-full py-3 sm:py-5 bg-black text-edn-neon-yellow font-archivo-black uppercase tracking-wider text-base sm:text-xl rounded-sm border-3 sm:border-4 border-black hover:bg-black/80 transition-colors flex items-center justify-center gap-2 sm:gap-3"
              style={{ boxShadow: "4px 4px 0px 0px rgba(0,0,0,1) sm:6px 6px 0px 0px rgba(0,0,0,1)" }}
            >
              ▶ ESCUCHAR ESTE EPISODIO
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
