import { useState, useEffect } from 'react';
import type { Guest } from '@/types/guest';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface UseEpisodeGuestsReturn {
  guests: Guest[];
  loading: boolean;
  error: string | null;
}

export function useEpisodeGuests(episodeId: string): UseEpisodeGuestsReturn {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchGuests = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE}/episodes/${episodeId}/guests`, {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Error al cargar invitados del episodio');
        }

        const data: Guest[] = await response.json();

        if (!cancelled) {
          setGuests(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Error al cargar invitados del episodio');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchGuests();

    return () => {
      cancelled = true;
    };
  }, [episodeId]);

  return { guests, loading, error };
}