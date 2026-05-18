import { useState, useEffect } from 'react';
import type { Guest } from '@/types/guest';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface UseGuestsOptions {
  page?: number;
  limit?: number;
  search?: string;
}

interface UseGuestsReturn {
  guests: Guest[];
  loading: boolean;
  error: string | null;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useGuests(options: UseGuestsOptions = {}): UseGuestsReturn {
  const { page = 1, limit = 10, search = '' } = options;
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<UseGuestsReturn['meta']>();

  useEffect(() => {
    let cancelled = false;

    const fetchGuests = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        params.set('page', page.toString());
        params.set('limit', limit.toString());
        if (search.trim()) {
          params.set('search', search.trim());
        }

        const response = await fetch(`${API_BASE}/guests?${params.toString()}`, {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Error al cargar invitados');
        }

        const data = await response.json();

        if (!cancelled) {
          // Handle both array response and paginated response
          if (Array.isArray(data)) {
            setGuests(data);
          } else {
            setGuests(data.data || []);
            if (data.meta) {
              setMeta(data.meta);
            }
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Error al cargar invitados');
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
  }, [page, limit, search]);

  return { guests, loading, error, meta };
}
