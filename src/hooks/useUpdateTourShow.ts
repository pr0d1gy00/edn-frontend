import { useState } from "react";
import type { TourShow } from "@/types/tourShow";
import { tourShowsApi } from "@/services/tourShowsApi";

interface UseUpdateTourShowReturn {
  updateTourShow: (id: string, formData: FormData) => Promise<TourShow | null>;
  loading: boolean;
  error: string | null;
}

export function useUpdateTourShow(): UseUpdateTourShowReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTourShow = async (
    id: string,
    formData: FormData,
  ): Promise<TourShow | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await tourShowsApi.updateTourShow(id, formData);
      return response;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al actualizar show";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateTourShow, loading, error };
}
