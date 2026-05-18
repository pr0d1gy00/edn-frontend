"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import type { Episode, Guest } from "@/types/episode";
import { episodesApi } from "@/services/episodesApi";
import GuestSelect from "@/components/episodes/GuestSelect";
import SelectedGuests from "@/components/episodes/SelectedGuests";
import { useEpisodeGuests } from "@/hooks/useEpisodeGuests";
import { useAddGuestToEpisode } from "@/hooks/useAddGuestToEpisode";
import { useRemoveGuestFromEpisode } from "@/hooks/useRemoveGuestFromEpisode";

interface GuestSelection {
  guest: Guest;
  isNew: boolean;
  isRemoved: boolean;
}

export default function EpisodeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const episodeId = params.id as string;

  const [episode, setEpisode] = useState<Episode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Guest hooks
  const { guests: currentGuests } = useEpisodeGuests(episodeId);
  const { addGuestToEpisode } = useAddGuestToEpisode();
  const { removeGuestFromEpisode } = useRemoveGuestFromEpisode();

  // Guest selection state
  const [selectedGuests, setSelectedGuests] = useState<GuestSelection[]>([]);
  const [syncing, setSyncing] = useState(false);

  // Inside joke form state
  const [showJokeForm, setShowJokeForm] = useState(false);
  const [jokeForm, setJokeForm] = useState({
    startTimeStamp: "",
    endTimeStamp: "",
    keyConcept: "",
    transcriptContext: "",
  });
  const [addingJoke, setAddingJoke] = useState(false);

  // Image carousel state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Load episode
  const fetchEpisode = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await episodesApi.getEpisodeById(episodeId);

      setEpisode(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando episodio");
    } finally {
      setLoading(false);
    }
  }, [episodeId]);

  useEffect(() => {
    fetchEpisode();
  }, [fetchEpisode]);

  // Load existing guests in edit mode
  useEffect(() => {
    if (currentGuests.length > 0) {
      setSelectedGuests(
        currentGuests.map((g) => ({
          guest: g,
          isNew: false,
          isRemoved: false,
        })),
      );
    }
  }, [currentGuests]);

  const handleSelectGuest = useCallback((guest: Guest) => {
    setSelectedGuests((prev) => {
      const existing = prev.find((sg) => sg.guest.id === guest.id);
      if (existing && existing.isRemoved) {
        return prev.map((sg) =>
          sg.guest.id === guest.id ? { ...sg, isRemoved: false } : sg,
        );
      }
      if (existing) return prev;
      return [...prev, { guest, isNew: true, isRemoved: false }];
    });
  }, []);

  const handleRemoveGuest = useCallback((guest: Guest) => {
    setSelectedGuests((prev) =>
      prev.map((sg) =>
        sg.guest.id === guest.id ? { ...sg, isRemoved: true } : sg,
      ),
    );
  }, []);

  const handleSyncGuests = async () => {
    setSyncing(true);
    try {
      // Add new guests
      const toAdd = selectedGuests.filter((sg) => sg.isNew && !sg.isRemoved);
      for (const sg of toAdd) {
        await addGuestToEpisode(episodeId, sg.guest.id);
      }
      // Remove guests
      const toRemove = selectedGuests.filter((sg) => !sg.isNew && sg.isRemoved);
      for (const sg of toRemove) {
        await removeGuestFromEpisode(episodeId, sg.guest.id);
      }
      // Refresh episode data
      fetchEpisode();
      // Reload guests
      setSelectedGuests(
        selectedGuests
          .filter((sg) => !sg.isRemoved)
          .map((sg) => ({ ...sg, isNew: false, isRemoved: false })),
      );
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Error sincronizando invitados",
      );
    } finally {
      setSyncing(false);
    }
  };

  const visibleGuests = selectedGuests.filter((sg) => !sg.isRemoved);
  const hasChanges = selectedGuests.some((sg) => sg.isNew || sg.isRemoved);

  const handleAddJoke = async () => {
    if (!jokeForm.keyConcept.trim()) return;
    setAddingJoke(true);
    try {
      await episodesApi.addInsideJoke({
        episodeId,
        ...jokeForm,
      });
      setJokeForm({
        startTimeStamp: "",
        endTimeStamp: "",
        keyConcept: "",
        transcriptContext: "",
      });
      setShowJokeForm(false);
      fetchEpisode();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error agregando broma");
    } finally {
      setAddingJoke(false);
    }
  };

  const handleRemoveJoke = async (jokeId: string) => {
    if (!confirm("¿Eliminar esta broma interna?")) return;
    try {
      await episodesApi.removeInsideJoke(jokeId);
      fetchEpisode();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error eliminando broma");
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "-";
    const mins = Math.floor(seconds / 60);
    const hrs = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return hrs > 0 ? `${hrs}h ${remainingMins}m` : `${mins}m`;
  };

  // Determine image sources for carousel
  const hasImages = episode?.images && episode.images.length > 0;
  const imagesForCarousel = hasImages
    ? episode.images!.map((img) => img.url)
    : episode?.thumbnailUrl
      ? [episode.thumbnailUrl]
      : [];

  // Check if URL is from S3/CDN (needs unoptimized for external URLs)
  const isCDNUrl = (url: string) => {
    return (
      url.includes("s3.") ||
      url.includes("cdn.") ||
      url.includes("idrivee2") ||
      url.includes("facebook.com") ||
      url.includes("r2.dev")
    );
  };

  // Reset carousel index when episode changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [episode?.id]);

  if (loading) {
    return (
      <div className="bg-white p-8 flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !episode) {
    return (
      <div className="bg-white p-8">
        <div className="p-6 bg-red-500 text-white font-archivo-black uppercase border-4 border-black">
          {error || "Episodio no encontrado"}
        </div>
        <button
          onClick={() => router.push("/dashboard/episodes")}
          className="mt-4 px-6 py-3 bg-black text-white font-archivo-black uppercase border-4 border-black hover:bg-[#f9c937] hover:text-black transition-colors"
        >
          ← Volver a episodios
        </button>
      </div>
    );
  }
  console.log(visibleGuests);
  return (
    <div className="bg-white p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => router.push("/dashboard/episodes")}
          className="flex items-center gap-2 px-4 py-2 bg-black text-[#f9c937] font-archivo-black uppercase text-sm border-4 border-black hover:bg-[#f9c937] hover:text-black transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="square"
              strokeWidth="3"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Volver
        </button>

        <div className="w-16 h-16 bg-black text-[#f9c937] font-archivo-black text-2xl flex items-center justify-center border-4 border-black">
          #{episode.episodeNumber}
        </div>
      </div>

      {/* Episode info card */}
      <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-8 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Image display - Carousel or single thumbnail */}
          <div className="w-full md:w-72 h-72 md:h-auto bg-[#f9c937] relative">
            {imagesForCarousel.length > 0 ? (
              <>
                <Image
                  src={imagesForCarousel[currentImageIndex]}
                  alt={`${episode.title} - Imagen ${currentImageIndex + 1}`}
                  className="object-cover"
                  fill
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
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 text-white font-archivo-black text-sm border-2 border-black hover:bg-black transition-colors flex items-center justify-center"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() =>
                        setCurrentImageIndex((prev) =>
                          prev === imagesForCarousel.length - 1 ? 0 : prev + 1,
                        )
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 text-white font-archivo-black text-sm border-2 border-black hover:bg-black transition-colors flex items-center justify-center"
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
                    <div className="absolute top-2 left-2 px-2 py-1 bg-black text-[#f9c937] font-archivo-black text-xs border-2 border-black">
                      {currentImageIndex + 1}/{imagesForCarousel.length}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-archivo-black text-6xl text-black/20">
                  #{episode.episodeNumber}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <div className="flex items-start gap-4 mb-4">
              <h1 className="font-syne font-extrabold text-2xl md:text-3xl text-black uppercase leading-tight">
                {episode.title}
              </h1>
              {episode.isExclusive && (
                <span className="px-3 py-1 bg-[#f9c937] text-black font-archivo-black text-sm uppercase border-2 border-black">
                  ★ Exclusivo
                </span>
              )}
            </div>

            <p className="font-plus-jakarta text-black/70 mb-6">
              {episode.description}
            </p>

            {/* Meta info */}
            <div className="flex flex-wrap gap-6 p-4 bg-black/[0.03] border-4 border-black">
              <div>
                <span className="font-archivo-black text-xs text-black/50 uppercase block">
                  Plataforma
                </span>
                <span
                  className={`
                  inline-block px-3 py-1 font-archivo-black text-sm uppercase border-2 border-black mt-1
                  ${episode.platformType === "YOUTUBE" ? "bg-red-600 text-white" : ""}
                  ${episode.platformType === "SPOTIFY" ? "bg-green-500 text-white" : ""}
                  ${episode.platformType === "OTHER" ? "bg-gray-500 text-white" : ""}
                `}
                >
                  {episode.platformType}
                </span>
              </div>
              <div>
                <span className="font-archivo-black text-xs text-black/50 uppercase block">
                  Fecha
                </span>
                <span className="font-archivo-black text-lg text-black">
                  {formatDate(episode.publishedAt)}
                </span>
              </div>
              <div>
                <span className="font-archivo-black text-xs text-black/50 uppercase block">
                  Duración
                </span>
                <span className="font-archivo-black text-lg text-black">
                  {formatDuration(episode.durationSeconds)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two column layout for guests and jokes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Guests section */}
        <div className="border-4 border-black">
          <div className="bg-black text-white px-4 py-3 flex items-center justify-between">
            <h2 className="font-archivo-black uppercase text-lg">Invitados</h2>
          </div>

          <div className="p-4">
            {/* Guest selector */}
            <div className="mb-4">
              <GuestSelect
                onSelect={handleSelectGuest}
                selectedIds={visibleGuests.map((sg) => sg.guest.id)}
              />
            </div>

            {/* Selected guests */}
            <SelectedGuests
              guests={visibleGuests.map((sg) => sg.guest)}
              onRemove={handleRemoveGuest}
            />

            {/* Sync button */}
            {hasChanges && (
              <button
                onClick={handleSyncGuests}
                disabled={syncing}
                className="mt-4 w-full py-3 bg-[#f9c937] text-black font-archivo-black uppercase border-4 border-black hover:bg-[#f9c937]/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {syncing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Sincronizando...
                  </>
                ) : (
                  "Sincronizar Invitados"
                )}
              </button>
            )}

            {/* Guest list */}
            {episode.guests && episode.guests.length > 0 ? (
              <div className="space-y-3 mt-4">
                {episode.guests.map((guest) => (
                  <div
                    key={guest.id}
                    className="p-4 bg-white border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#f9c937] border-2 border-black flex items-center justify-center font-archivo-black text-lg">
                          {guest.name[0]}
                        </div>
                        <h4 className="font-archivo-black text-lg text-black uppercase">
                          {guest.name}
                        </h4>
                      </div>
                    </div>
                    <p className="font-plus-jakarta text-sm text-black/70 mb-2">
                      {guest.bio}
                    </p>
                    <div className="flex gap-2">
                      {guest.twitterHandle && (
                        <span className="px-2 py-1 bg-black text-white font-archivo-black text-xs">
                          @{guest.twitterHandle}
                        </span>
                      )}
                      {guest.instagramHandle && (
                        <span className="px-2 py-1 bg-black text-white font-archivo-black text-xs">
                          @{guest.instagramHandle}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-black/40 font-archivo-black uppercase">
                No hay invitados
              </div>
            )}
          </div>
        </div>

        {/* Inside jokes section */}
        <div className="border-4 border-black">
          <div className="bg-black text-white px-4 py-3 flex items-center justify-between">
            <h2 className="font-archivo-black uppercase text-lg">
              Bromas Internas
            </h2>
            <button
              onClick={() => setShowJokeForm(!showJokeForm)}
              className="px-3 py-1 bg-[#f9c937] text-black font-archivo-black text-xs uppercase border-2 border-[#f9c937] hover:bg-white hover:border-white transition-colors"
            >
              {showJokeForm ? "Cancelar" : "+ Agregar"}
            </button>
          </div>

          <div className="p-4">
            {/* Add joke form */}
            {showJokeForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-6 p-4 bg-[#f9c937]/20 border-4 border-black"
              >
                <h3 className="font-archivo-black text-sm uppercase mb-4">
                  Nueva Broma Interna
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Inicio (00:10:00)"
                      value={jokeForm.startTimeStamp}
                      onChange={(e) =>
                        setJokeForm({
                          ...jokeForm,
                          startTimeStamp: e.target.value,
                        })
                      }
                      className="flex-1 px-3 py-2 bg-white border-2 border-black font-plus-jakarta text-black placeholder-black/40 focus:outline-none focus:bg-[#f9c937]"
                    />
                    <input
                      type="text"
                      placeholder="Fin (00:12:00)"
                      value={jokeForm.endTimeStamp}
                      onChange={(e) =>
                        setJokeForm({
                          ...jokeForm,
                          endTimeStamp: e.target.value,
                        })
                      }
                      className="flex-1 px-3 py-2 bg-white border-2 border-black font-plus-jakarta text-black placeholder-black/40 focus:outline-none focus:bg-[#f9c937]"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Concepto clave"
                    value={jokeForm.keyConcept}
                    onChange={(e) =>
                      setJokeForm({ ...jokeForm, keyConcept: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border-2 border-black font-plus-jakarta text-black placeholder-black/40 focus:outline-none focus:bg-[#f9c937]"
                  />
                  <textarea
                    placeholder="Contexto del chiste"
                    value={jokeForm.transcriptContext}
                    onChange={(e) =>
                      setJokeForm({
                        ...jokeForm,
                        transcriptContext: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white border-2 border-black font-plus-jakarta text-black placeholder-black/40 focus:outline-none focus:bg-[#f9c937] min-h-[80px]"
                  />
                  <button
                    onClick={handleAddJoke}
                    disabled={addingJoke || !jokeForm.keyConcept.trim()}
                    className="w-full py-3 bg-black text-[#f9c937] font-archivo-black uppercase border-2 border-black hover:bg-black/80 transition-colors disabled:opacity-50"
                  >
                    {addingJoke ? "Agregando..." : "Agregar Broma"}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Jokes list */}
            {episode.insideJokes && episode.insideJokes.length > 0 ? (
              <div className="space-y-3">
                {episode.insideJokes.map((joke) => (
                  <div
                    key={joke.id}
                    className="p-4 bg-[#f9c937]/20 border-4 border-[#f9c937]"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-[#f9c937] text-black font-archivo-black text-xs border border-black">
                          ⏱ {joke.startTimeStamp}
                        </span>
                        <span className="text-black/50">
                          → {joke.endTimeStamp}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveJoke(joke.id)}
                        className="w-8 h-8 bg-white text-red-600 border-2 border-black font-archivo-black text-xs hover:bg-red-600 hover:text-white transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                    <h5 className="font-archivo-black text-sm text-black uppercase mb-1">
                      {joke.keyConcept}
                    </h5>
                    <p className="font-plus-jakarta text-xs text-black/70 italic">
                      {joke.transcriptContext}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-black/40 font-archivo-black uppercase">
                No hay bromas internas
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
