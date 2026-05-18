import { useState, useEffect } from 'react';
import type { Guest } from '@/types/guest';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface UseGuestByIdReturn {
  guest: Guest | null;
  loading: boolean;
  error: string | null;
}

export function useGuestById(id: string): UseGuestByIdReturn {
  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchGuest = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE}/guests/${id}`, {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Error al cargar detalles');
        }

        const data: Guest = await response.json();

        if (!cancelled) {
          setGuest(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Error al cargar detalles');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchGuest();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { guest, loading, error };
}
