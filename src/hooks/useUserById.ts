import { useState, useEffect } from "react";
import type { User } from "@/types/user";
import { usersApi } from "@/services/usersApi";

interface UseUserByIdReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export function useUserById(id: string): UseUserByIdReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchUser = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await usersApi.getUserById(id);

        if (!cancelled) {
          setUser(response);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Error al cargar usuario",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchUser();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { user, loading, error };
}
