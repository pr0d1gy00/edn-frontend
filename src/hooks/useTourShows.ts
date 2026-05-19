import { useState, useEffect } from "react";
import type { TourShow } from "@/types/tourShow";
import { tourShowsApi } from "@/services/tourShowsApi";

interface UseTourShowsOptions {
  page?: number;
  limit?: number;
  ticketStatus?: string;
  upcoming?: boolean;
  search?: string;
}

interface UseTourShowsReturn {
  tourShows: TourShow[];
  loading: boolean;
  error: string | null;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useTourShows(
  options: UseTourShowsOptions = {},
): UseTourShowsReturn {
  const { page = 1, limit = 10, ticketStatus, upcoming, search = "" } = options;

  const [tourShows, setTourShows] = useState<TourShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<UseTourShowsReturn["meta"]>();

  useEffect(() => {
    let cancelled = false;

    const fetchTourShows = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await tourShowsApi.getTourShows(
          page,
          limit,
          ticketStatus,
          upcoming,
          search,
        );

        if (!cancelled) {
          setTourShows(response.data || []);
          if (response.meta) {
            setMeta(response.meta);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Error al cargar shows",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchTourShows();

    return () => {
      cancelled = true;
    };
  }, [page, limit, ticketStatus, upcoming, search]);

  return { tourShows, loading, error, meta };
}
