import { useState } from "react";
import type { TourShow } from "@/types/tourShow";
import { tourShowsApi } from "@/services/tourShowsApi";

interface UseCreateTourShowReturn {
  createTourShow: (formData: FormData) => Promise<TourShow | null>;
  loading: boolean;
  error: string | null;
}

export function useCreateTourShow(): UseCreateTourShowReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTourShow = async (formData: FormData): Promise<TourShow | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await tourShowsApi.createTourShow(formData);
      return response;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al crear show";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createTourShow, loading, error };
}
