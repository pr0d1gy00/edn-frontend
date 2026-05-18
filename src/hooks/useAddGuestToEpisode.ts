import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface UseAddGuestToEpisodeReturn {
  addGuestToEpisode: (episodeId: string, guestId: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export function useAddGuestToEpisode(): UseAddGuestToEpisodeReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addGuestToEpisode = async (
    episodeId: string,
    guestId: string,
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const token = useAuthStore.getState().getAccessToken();

      const response = await fetch(`${API_BASE}/episodes/${episodeId}/guests/${guestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error('Error al agregar invitado al episodio');
      }

      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al agregar invitado al episodio';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { addGuestToEpisode, loading, error };
}
