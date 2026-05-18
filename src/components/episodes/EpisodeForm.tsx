"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { Episode, Guest } from "@/types/episode";
import { episodesApi } from "@/services/episodesApi";
import { useEpisodeGuests } from "@/hooks/useEpisodeGuests";
import { useAddGuestToEpisode } from "@/hooks/useAddGuestToEpisode";
import { useRemoveGuestFromEpisode } from "@/hooks/useRemoveGuestFromEpisode";
import GuestSelect from "./GuestSelect";
import SelectedGuests from "./SelectedGuests";
import ImageUploader, { type ImageEntry } from "./ImageUploader";

interface EpisodeFormProps {
  mode: "create" | "edit";
  initialData?: Episode | null;
}

interface GuestSelection {
  guest: Guest;
  isNew: boolean; // true if not yet saved to episode
  isRemoved: boolean; // true if was saved but user removed in this session
}

export default function EpisodeForm({ mode, initialData }: EpisodeFormProps) {
  const router = useRouter();
  const isEditMode = mode === "edit";
  const episodeId = initialData?.id;

  // Episode form state
  const [form, setForm] = useState({
    episodeNumber: initialData?.episodeNumber?.toString() || "",
    title: initialData?.title || "",
    description: initialData?.description || "",
    platformType: (initialData?.platformType ||
      "YOUTUBE") as Episode["platformType"],
    contentUrl: initialData?.contentUrl || "",
    thumbnailUrl: initialData?.thumbnailUrl || "",
    publishedAt: initialData?.publishedAt || "",
    isExclusive: initialData?.isExclusive || false,
    durationSeconds: initialData?.durationSeconds?.toString() || "",
  });

  // Episode save state
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Guest hooks
  const { guests: currentGuests } = useEpisodeGuests(episodeId || "");
  const { addGuestToEpisode, loading: addLoading } = useAddGuestToEpisode();
  const { removeGuestFromEpisode, loading: removeLoading } =
    useRemoveGuestFromEpisode();

  // Guest selection state
  const [selectedGuests, setSelectedGuests] = useState<GuestSelection[]>([]);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  // Images state
  const [images, setImages] = useState<ImageEntry[]>(() => {
    if (initialData?.images && initialData.images.length > 0) {
      return initialData.images.map((img) => ({
        id: img.id,
        url: img.url,
        isNew: false,
      }));
    }
    return [];
  });

  // Track if initial guests have been loaded
  const initialGuestsLoaded = useRef(false);

  // Load existing guests in edit mode
  useEffect(() => {
    if (
      isEditMode &&
      currentGuests.length > 0 &&
      !initialGuestsLoaded.current
    ) {
      initialGuestsLoaded.current = true;
      setSelectedGuests(
        currentGuests.map((g) => ({
          guest: g,
          isNew: false,
          isRemoved: false,
        })),
      );
    }
  }, [isEditMode, currentGuests]);

  const handleSelectGuest = useCallback(
    (guest: Guest) => {
      setDuplicateWarning(null);

      const alreadySelected = selectedGuests.find(
        (sg) => sg.guest.id === guest.id && !sg.isRemoved,
      );
      if (alreadySelected) {
        setDuplicateWarning("Este invitado ya está en el episodio");
        return;
      }

      setSelectedGuests((prev) => {
        // If guest was previously removed, un-remove them
        const existing = prev.find((sg) => sg.guest.id === guest.id);
        if (existing && existing.isRemoved) {
          return prev.map((sg) =>
            sg.guest.id === guest.id ? { ...sg, isRemoved: false } : sg,
          );
        }

        return [...prev, { guest, isNew: true, isRemoved: false }];
      });
    },
    [selectedGuests],
  );

  const handleRemoveGuest = useCallback((guest: Guest) => {
    setSelectedGuests((prev) =>
      prev.map((sg) =>
        sg.guest.id === guest.id ? { ...sg, isRemoved: true } : sg,
      ),
    );
  }, []);

  const visibleGuests = selectedGuests.filter((sg) => !sg.isRemoved);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Get new image files
      const newImageFiles = images
        .filter((img) => img.isNew && img.file)
        .map((img) => img.file!);

      const episodeData = {
        episodeNumber: parseInt(form.episodeNumber),
        title: form.title,
        description: form.description,
        platformType: form.platformType,
        contentUrl: form.contentUrl || undefined,
        thumbnailUrl: form.thumbnailUrl || undefined,
        publishedAt: form.publishedAt || new Date().toISOString(),
        isExclusive: form.isExclusive,
        durationSeconds: form.durationSeconds
          ? parseInt(form.durationSeconds)
          : undefined,
        images: newImageFiles.length > 0 ? newImageFiles : undefined,
      };

      let savedEpisodeId = episodeId;

      if (isEditMode && episodeId) {
        await episodesApi.updateEpisode(episodeId, episodeData);
      } else {
        const result = await episodesApi.createEpisode(episodeData);
        savedEpisodeId = result.id;
      }

      // Sync guests
      if (savedEpisodeId) {
        // Add new guests
        const guestsToAdd = selectedGuests.filter(
          (sg) => sg.isNew && !sg.isRemoved,
        );
        for (const sg of guestsToAdd) {
          await addGuestToEpisode(savedEpisodeId, sg.guest.id);
        }

        // Remove deleted guests
        const guestsToRemove = selectedGuests.filter(
          (sg) => !sg.isNew && sg.isRemoved,
        );
        for (const sg of guestsToRemove) {
          await removeGuestFromEpisode(savedEpisodeId, sg.guest.id);
        }
      }

      router.push("/dashboard/episodes");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al guardar episodio",
      );
    } finally {
      setSaving(false);
    }
  };

  const isLoading = saving || addLoading || removeLoading;

  const submitLabel = isEditMode
    ? isLoading
      ? "Guardando..."
      : "Guardar cambios"
    : isLoading
      ? "Creando..."
      : "Crear Episodio";

  return (
    <div className="bg-white p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          type="button"
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
        <h1 className="font-syne font-extrabold text-3xl text-black uppercase tracking-tight">
          {isEditMode ? "Editar Episodio" : "Nuevo Episodio"}
        </h1>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500 text-white font-archivo-black uppercase border-4 border-black">
          {error}
        </div>
      )}

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        noValidate
        className="max-w-2xl bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
      >
        <div className="p-6 space-y-6">
          {/* Episode Number */}
          <div>
            <label
              htmlFor="episode-number"
              className="block font-archivo-black uppercase text-sm text-black mb-2 tracking-wide"
            >
              Número de Episodio *
            </label>
            <input
              id="episode-number"
              type="number"
              required
              value={form.episodeNumber}
              onChange={(e) =>
                setForm({ ...form, episodeNumber: e.target.value })
              }
              className="w-full px-4 py-3 bg-white border-4 border-black font-plus-jakarta text-black placeholder-black/40 focus:outline-none focus:bg-[#f9c937]/20"
              placeholder="Ej: 101"
            />
          </div>

          {/* Title */}
          <div>
            <label
              htmlFor="episode-title"
              className="block font-archivo-black uppercase text-sm text-black mb-2 tracking-wide"
            >
              Título *
            </label>
            <input
              id="episode-title"
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-3 bg-white border-4 border-black font-plus-jakarta text-black placeholder-black/40 focus:outline-none focus:bg-[#f9c937]/20"
              placeholder="Episode 101: Gran invitado especial"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="episode-description"
              className="block font-archivo-black uppercase text-sm text-black mb-2 tracking-wide"
            >
              Descripción *
            </label>
            <textarea
              id="episode-description"
              required
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-3 bg-white border-4 border-black font-plus-jakarta text-black placeholder-black/40 focus:outline-none focus:bg-[#f9c937]/20 resize-none"
              placeholder="Descripción detallada del episodio..."
            />
          </div>

          {/* Platform & Duration row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="episode-platform"
                className="block font-archivo-black uppercase text-sm text-black mb-2 tracking-wide"
              >
                Plataforma *
              </label>
              <select
                id="episode-platform"
                value={form.platformType}
                onChange={(e) =>
                  setForm({
                    ...form,
                    platformType: e.target.value as Episode["platformType"],
                  })
                }
                className="w-full px-4 py-3 bg-white border-4 border-black font-archivo-black text-black uppercase focus:outline-none focus:bg-[#f9c937]/20 cursor-pointer"
              >
                <option value="YOUTUBE">YouTube</option>
                <option value="SPOTIFY">Spotify</option>
                <option value="OTHER">Otro</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="episode-duration"
                className="block font-archivo-black uppercase text-sm text-black mb-2 tracking-wide"
              >
                Duración (minutos)
              </label>
              <input
                id="episode-duration"
                type="number"
                value={form.durationSeconds}
                onChange={(e) =>
                  setForm({ ...form, durationSeconds: e.target.value })
                }
                className="w-full px-4 py-3 bg-white border-4 border-black font-plus-jakarta text-black placeholder-black/40 focus:outline-none focus:bg-[#f9c937]/20"
                placeholder="Ej: 45"
              />
            </div>
          </div>

          {/* Content URL & Thumbnail URL row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="episode-content-url"
                className="block font-archivo-black uppercase text-sm text-black mb-2 tracking-wide"
              >
                URL del Contenido
              </label>
              <input
                id="episode-content-url"
                type="url"
                value={form.contentUrl}
                onChange={(e) =>
                  setForm({ ...form, contentUrl: e.target.value })
                }
                className="w-full px-4 py-3 bg-white border-4 border-black font-plus-jakarta text-black placeholder-black/40 focus:outline-none focus:bg-[#f9c937]/20"
                placeholder="https://youtube.com/..."
              />
            </div>

            <div>
              <label
                htmlFor="episode-thumbnail"
                className="block font-archivo-black uppercase text-sm text-black mb-2 tracking-wide"
              >
                URL del Thumbnail
              </label>
              <input
                id="episode-thumbnail"
                type="url"
                value={form.thumbnailUrl}
                onChange={(e) =>
                  setForm({ ...form, thumbnailUrl: e.target.value })
                }
                className="w-full px-4 py-3 bg-white border-4 border-black font-plus-jakarta text-black placeholder-black/40 focus:outline-none focus:bg-[#f9c937]/20"
                placeholder="https://picsum.photos/..."
              />
            </div>
          </div>

          {/* Published At */}
          <div>
            <label
              htmlFor="episode-published"
              className="block font-archivo-black uppercase text-sm text-black mb-2 tracking-wide"
            >
              Fecha de Publicación
            </label>
            <input
              id="episode-published"
              type="datetime-local"
              value={form.publishedAt ? form.publishedAt.slice(0, 16) : ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  publishedAt: new Date(e.target.value).toISOString(),
                })
              }
              className="w-full px-4 py-3 bg-white border-4 border-black font-plus-jakarta text-black focus:outline-none focus:bg-[#f9c937]/20"
            />
          </div>

          {/* Exclusive checkbox */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="episode-exclusive"
              checked={form.isExclusive}
              onChange={(e) =>
                setForm({ ...form, isExclusive: e.target.checked })
              }
              className="w-6 h-6 bg-white border-4 border-black cursor-pointer accent-[#f9c937]"
            />
            <label
              htmlFor="episode-exclusive"
              className="font-archivo-black uppercase text-sm text-black cursor-pointer"
            >
              Episodio Exclusivo
            </label>
          </div>

          {/* Divider */}
          <div className="border-t-4 border-black" />

          {/* Invitados Section */}
          <div>
            <h3 className="font-archivo-black text-xl text-black uppercase mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-[#f9c937] border-2 border-black rounded-sm flex items-center justify-center text-lg">
                👥
              </span>
              INVITADOS
            </h3>

            <GuestSelect
              onSelect={handleSelectGuest}
              selectedIds={visibleGuests.map((sg) => sg.guest.id)}
            />

            {duplicateWarning && (
              <p className="mt-2 font-archivo-black text-xs text-red-500 uppercase">
                {duplicateWarning}
              </p>
            )}

            <SelectedGuests
              guests={visibleGuests.map((sg) => sg.guest)}
              onRemove={handleRemoveGuest}
            />
          </div>

          {/* Images Section */}
          <div>
            <h3 className="font-archivo-black text-xl text-black uppercase mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-[#f9c937] border-2 border-black rounded-sm flex items-center justify-center text-lg">
                🖼
              </span>
              IMÁGENES
            </h3>
            <ImageUploader
              images={images}
              onChange={setImages}
              maxImages={5}
            />
          </div>
        </div>

        {/* Submit */}
        <div className="p-6 bg-black/[0.03] border-t-4 border-black">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.push("/dashboard/episodes")}
              className="flex-1 py-4 bg-white text-black font-archivo-black uppercase text-sm border-4 border-black hover:bg-black/[0.05] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-4 bg-black text-[#f9c937] font-archivo-black uppercase text-sm border-4 border-black hover:bg-black/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#f9c937] border-t-transparent rounded-full animate-spin" />
                  {submitLabel}
                </>
              ) : (
                submitLabel
              )}
            </button>
          </div>
        </div>
      </motion.form>
    </div>
  );
}
