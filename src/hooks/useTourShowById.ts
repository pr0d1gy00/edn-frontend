import { useState, useEffect } from "react";
import type { TourShow } from "@/types/tourShow";
import { tourShowsApi } from "@/services/tourShowsApi";

interface UseTourShowByIdReturn {
  tourShow: TourShow | null;
  loading: boolean;
  error: string | null;
}

export function useTourShowById(id: string): UseTourShowByIdReturn {
  const [tourShow, setTourShow] = useState<TourShow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchShow = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await tourShowsApi.getTourShowById(id);

        if (!cancelled) {
          setTourShow(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Error al cargar show",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchShow();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { tourShow, loading, error };
}
