import { useState } from "react";
import { tourShowsApi } from "@/services/tourShowsApi";

interface UseDeleteTourShowReturn {
  deleteTourShow: (id: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export function useDeleteTourShow(): UseDeleteTourShowReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteTourShow = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await tourShowsApi.deleteTourShow(id);
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al eliminar show";
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteTourShow, loading, error };
}
