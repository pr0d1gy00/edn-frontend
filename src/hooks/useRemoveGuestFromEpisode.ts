import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface UseRemoveGuestFromEpisodeReturn {
  removeGuestFromEpisode: (episodeId: string, guestId: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export function useRemoveGuestFromEpisode(): UseRemoveGuestFromEpisodeReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const removeGuestFromEpisode = async (
    episodeId: string,
    guestId: string,
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const token = useAuthStore.getState().getAccessToken();

      const response = await fetch(`${API_BASE}/episodes/${episodeId}/guests/${guestId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error('Error al eliminar invitado del episodio');
      }

      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al eliminar invitado del episodio';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { removeGuestFromEpisode, loading, error };
}
