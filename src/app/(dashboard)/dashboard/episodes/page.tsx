'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import type { Episode } from '@/types/episode';

export default function EpisodesAdminPage() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - in production this would come from the API
    const mockEpisodes: Episode[] = [
      {
        id: '1',
        episodeNumber: 100,
        title: 'Episode 100: Gran invitado especial',
        description: 'Descripción del episodio 100',
        platformType: 'YOUTUBE',
        contentUrl: 'https://youtube.com',
        thumbnailUrl: 'https://picsum.photos/seed/1/400/225',
        publishedAt: '2026-05-17T00:00:00.000Z',
        isExclusive: true,
        durationSeconds: 3000,
        guests: [
          { id: '1', name: 'Guest 1', bio: 'Bio', twitterHandle: 'guest1' }
        ],
        insideJokes: [
          { id: '1', episodeId: '1', startTimeStamp: '00:10:00', endTimeStamp: '00:12:00', keyConcept: 'Chiste interno', transcriptContext: 'Contexto' }
        ]
      },
      {
        id: '2',
        episodeNumber: 99,
        title: 'Episode 99: Gran invitado especial',
        description: 'Descripción del episodio 99',
        platformType: 'SPOTIFY',
        contentUrl: 'https://spotify.com',
        thumbnailUrl: 'https://picsum.photos/seed/2/400/225',
        publishedAt: '2026-05-10T00:00:00.000Z',
        isExclusive: false,
        durationSeconds: 3100,
        guests: [],
        insideJokes: []
      },
      {
        id: '3',
        episodeNumber: 98,
        title: 'Episode 98: Gran invitado especial',
        description: 'Descripción del episodio 98',
        platformType: 'YOUTUBE',
        thumbnailUrl: 'https://picsum.photos/seed/3/400/225',
        publishedAt: '2026-05-03T00:00:00.000Z',
        isExclusive: false,
        durationSeconds: 2800,
        guests: [],
        insideJokes: []
      },
    ];

    setTimeout(() => {
      setEpisodes(mockEpisodes);
      setLoading(false);
    }, 500);
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '-';
    const mins = Math.floor(seconds / 60);
    const hrs = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return hrs > 0 ? `${hrs}h ${remainingMins}m` : `${mins}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-edn-neon-yellow border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-syne font-extrabold text-3xl text-white uppercase tracking-tight">
            Episodios
          </h1>
          <p className="font-plus-jakarta text-white/60 mt-1">
            Gestiona todos los episodios del podcast
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="
            px-6 py-3 bg-edn-neon-yellow text-black font-archivo-black uppercase text-sm
            border-4 border-black rounded-md
            shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
            hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
            hover:translate-x-[-2px] hover:translate-y-[-2px]
            transition-all duration-150
          "
        >
          + Nuevo Episodio
        </motion.button>
      </div>

      {/* Table */}
      <div className="bg-white border-4 border-black rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-black text-edn-neon-yellow">
              <th className="px-4 py-3 font-archivo-black text-xs uppercase text-left">#</th>
              <th className="px-4 py-3 font-archivo-black text-xs uppercase text-left">Título</th>
              <th className="px-4 py-3 font-archivo-black text-xs uppercase text-left">Plataforma</th>
              <th className="px-4 py-3 font-archivo-black text-xs uppercase text-left">Fecha</th>
              <th className="px-4 py-3 font-archivo-black text-xs uppercase text-left">Duración</th>
              <th className="px-4 py-3 font-archivo-black text-xs uppercase text-left">Invitados</th>
              <th className="px-4 py-3 font-archivo-black text-xs uppercase text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {episodes.map((episode, index) => (
              <motion.tr
                key={episode.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-t-2 border-black hover:bg-edn-neon-yellow/10 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="w-10 h-10 bg-black text-edn-neon-yellow font-archivo-black text-sm flex items-center justify-center rounded-sm">
                    {episode.episodeNumber}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {episode.thumbnailUrl && (
                      <div className="relative w-16 h-10 bg-edn-neon-yellow rounded-sm overflow-hidden border-2 border-black flex-shrink-0">
                        <Image
                          src={episode.thumbnailUrl}
                          alt={episode.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-syne font-bold text-black text-sm uppercase leading-tight">
                        {episode.title}
                      </p>
                      {episode.isExclusive && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-edn-neon-yellow text-black font-archivo-black text-xs uppercase rounded-sm border border-black">
                          ★ Exclusivo
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`
                    inline-block px-2 py-1 font-archivo-black text-xs uppercase rounded-sm
                    ${episode.platformType === 'YOUTUBE' ? 'bg-red-600 text-white' : ''}
                    ${episode.platformType === 'SPOTIFY' ? 'bg-green-500 text-white' : ''}
                    ${episode.platformType === 'OTHER' ? 'bg-gray-500 text-white' : ''}
                  `}>
                    {episode.platformType}
                  </span>
                </td>
                <td className="px-4 py-3 font-plus-jakarta text-sm text-black/70">
                  {formatDate(episode.publishedAt)}
                </td>
                <td className="px-4 py-3 font-archivo-black text-sm text-black/70">
                  {formatDuration(episode.durationSeconds)}
                </td>
                <td className="px-4 py-3">
                  {episode.guests && episode.guests.length > 0 ? (
                    <div className="flex gap-1">
                      {episode.guests.slice(0, 2).map((guest) => (
                        <span
                          key={guest.id}
                          className="px-2 py-1 bg-black text-edn-neon-yellow font-archivo-black text-xs rounded-sm"
                          title={guest.name}
                        >
                          {guest.name.slice(0, 8)}
                        </span>
                      ))}
                      {episode.guests.length > 2 && (
                        <span className="px-2 py-1 bg-black/30 text-black/70 font-archivo-black text-xs rounded-sm">
                          +{episode.guests.length - 2}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-black/40">-</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="p-2 bg-black text-edn-neon-yellow font-archivo-black text-xs uppercase rounded-sm border-2 border-black hover:bg-black/80 transition-colors">
                      Editar
                    </button>
                    <button className="p-2 bg-white text-red-600 font-archivo-black text-xs uppercase rounded-sm border-2 border-black hover:bg-red-600 hover:text-white transition-colors">
                      Eliminar
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}