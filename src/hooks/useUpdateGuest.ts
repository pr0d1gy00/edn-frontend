import { useState } from 'react';
import type { Guest } from '@/types/guest';
import type { UpdateGuestInput } from '@/types/guest';
import { useAuthStore } from '@/stores/authStore';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface UseUpdateGuestReturn {
  updateGuest: (id: string, input: UpdateGuestInput) => Promise<Guest | null>;
  loading: boolean;
  error: string | null;
}

export function useUpdateGuest(): UseUpdateGuestReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateGuest = async (id: string, input: UpdateGuestInput): Promise<Guest | null> => {
    setLoading(true);
    setError(null);

    try {
      const token = useAuthStore.getState().getAccessToken();

      const response = await fetch(`${API_BASE}/guests/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar');
      }

      const data: Guest = await response.json();
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateGuest, loading, error };
}
