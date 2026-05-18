import { useState, useEffect } from "react";
import type { User } from "@/types/user";
import { usersApi } from "@/services/usersApi";

interface UseUsersOptions {
  page?: number;
  limit?: number;
  search?: string;
}

interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useUsers(options: UseUsersOptions = {}): UseUsersReturn {
  const { page = 1, limit = 10, search = "" } = options;
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<UseUsersReturn["meta"]>();

  useEffect(() => {
    let cancelled = false;

    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await usersApi.getUsers(page, limit, search);

        if (!cancelled) {
          setUsers(response.data || []);
          if (response.meta) {
            setMeta(response.meta);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Error al cargar usuarios",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      cancelled = true;
    };
  }, [page, limit, search]);

  return { users, loading, error, meta };
}
