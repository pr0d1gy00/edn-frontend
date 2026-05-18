import { useState } from 'react';
import { usersApi } from '@/services/usersApi';

interface UseDeleteUserReturn {
  deleteUser: (id: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export function useDeleteUser(): UseDeleteUserReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteUser = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await usersApi.deleteUser(id);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar usuario';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteUser, loading, error };
}
