'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import type { Episode } from '@/types/episode';
import { episodesApi } from '@/services/episodesApi';

export default function NewEpisodePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    episodeNumber: '',
    title: '',
    description: '',
    platformType: 'YOUTUBE' as Episode['platformType'],
    contentUrl: '',
    thumbnailUrl: '',
    publishedAt: '',
    isExclusive: false,
    durationSeconds: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const episodeData = {
        episodeNumber: parseInt(form.episodeNumber),
        title: form.title,
        description: form.description,
        platformType: form.platformType,
        contentUrl: form.contentUrl || undefined,
        thumbnailUrl: form.thumbnailUrl || undefined,
        publishedAt: form.publishedAt || new Date().toISOString(),
        isExclusive: form.isExclusive,
        durationSeconds: form.durationSeconds ? parseInt(form.durationSeconds) : undefined,
      };

      await episodesApi.createEpisode(episodeData);
      router.push('/dashboard/episodes');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creando episodio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.push('/dashboard/episodes')}
          className="flex items-center gap-2 px-4 py-2 bg-black text-[#f9c937] font-archivo-black uppercase text-sm border-4 border-black hover:bg-[#f9c937] hover:text-black transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="square" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver
        </button>
        <h1 className="font-syne font-extrabold text-3xl text-black uppercase tracking-tight">
          Nuevo Episodio
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
        className="max-w-2xl bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
      >
        <div className="p-6 space-y-6">
          {/* Episode Number */}
          <div>
            <label className="block font-archivo-black uppercase text-sm text-black mb-2 tracking-wide">
              Número de Episodio *
            </label>
            <input
              type="number"
              required
              value={form.episodeNumber}
              onChange={(e) => setForm({ ...form, episodeNumber: e.target.value })}
              className="w-full px-4 py-3 bg-white border-4 border-black font-plus-jakarta text-black placeholder-black/40 focus:outline-none focus:bg-[#f9c937]/20"
              placeholder="Ej: 101"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block font-archivo-black uppercase text-sm text-black mb-2 tracking-wide">
              Título *
            </label>
            <input
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
            <label className="block font-archivo-black uppercase text-sm text-black mb-2 tracking-wide">
              Descripción *
            </label>
            <textarea
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-white border-4 border-black font-plus-jakarta text-black placeholder-black/40 focus:outline-none focus:bg-[#f9c937]/20 resize-none"
              placeholder="Descripción detallada del episodio..."
            />
          </div>

          {/* Platform & Duration row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-archivo-black uppercase text-sm text-black mb-2 tracking-wide">
                Plataforma *
              </label>
              <select
                value={form.platformType}
                onChange={(e) => setForm({ ...form, platformType: e.target.value as Episode['platformType'] })}
                className="w-full px-4 py-3 bg-white border-4 border-black font-archivo-black text-black uppercase focus:outline-none focus:bg-[#f9c937]/20 cursor-pointer"
              >
                <option value="YOUTUBE">YouTube</option>
                <option value="SPOTIFY">Spotify</option>
                <option value="OTHER">Otro</option>
              </select>
            </div>

            <div>
              <label className="block font-archivo-black uppercase text-sm text-black mb-2 tracking-wide">
                Duración (minutos)
              </label>
              <input
                type="number"
                value={form.durationSeconds}
                onChange={(e) => setForm({ ...form, durationSeconds: e.target.value })}
                className="w-full px-4 py-3 bg-white border-4 border-black font-plus-jakarta text-black placeholder-black/40 focus:outline-none focus:bg-[#f9c937]/20"
                placeholder="Ej: 45"
              />
            </div>
          </div>

          {/* Content URL & Thumbnail URL row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-archivo-black uppercase text-sm text-black mb-2 tracking-wide">
                URL del Contenido
              </label>
              <input
                type="url"
                value={form.contentUrl}
                onChange={(e) => setForm({ ...form, contentUrl: e.target.value })}
                className="w-full px-4 py-3 bg-white border-4 border-black font-plus-jakarta text-black placeholder-black/40 focus:outline-none focus:bg-[#f9c937]/20"
                placeholder="https://youtube.com/..."
              />
            </div>

            <div>
              <label className="block font-archivo-black uppercase text-sm text-black mb-2 tracking-wide">
                URL del Thumbnail
              </label>
              <input
                type="url"
                value={form.thumbnailUrl}
                onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
                className="w-full px-4 py-3 bg-white border-4 border-black font-plus-jakarta text-black placeholder-black/40 focus:outline-none focus:bg-[#f9c937]/20"
                placeholder="https://picsum.photos/..."
              />
            </div>
          </div>

          {/* Published At */}
          <div>
            <label className="block font-archivo-black uppercase text-sm text-black mb-2 tracking-wide">
              Fecha de Publicación
            </label>
            <input
              type="datetime-local"
              value={form.publishedAt ? form.publishedAt.slice(0, 16) : ''}
              onChange={(e) => setForm({ ...form, publishedAt: new Date(e.target.value).toISOString() })}
              className="w-full px-4 py-3 bg-white border-4 border-black font-plus-jakarta text-black focus:outline-none focus:bg-[#f9c937]/20"
            />
          </div>

          {/* Exclusive checkbox */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isExclusive"
              checked={form.isExclusive}
              onChange={(e) => setForm({ ...form, isExclusive: e.target.checked })}
              className="w-6 h-6 bg-white border-4 border-black cursor-pointer accent-[#f9c937]"
            />
            <label htmlFor="isExclusive" className="font-archivo-black uppercase text-sm text-black cursor-pointer">
              Episodio Exclusivo
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="p-6 bg-black/[0.03] border-t-4 border-black">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.push('/dashboard/episodes')}
              className="flex-1 py-4 bg-white text-black font-archivo-black uppercase text-sm border-4 border-black hover:bg-black/[0.05] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-4 bg-black text-[#f9c937] font-archivo-black uppercase text-sm border-4 border-black hover:bg-black/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#f9c937] border-t-transparent rounded-full animate-spin" />
                  Creando...
                </>
              ) : (
                'Crear Episodio'
              )}
            </button>
          </div>
        </div>
      </motion.form>
    </div>
  );
}