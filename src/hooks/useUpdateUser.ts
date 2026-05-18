import { useState } from "react";
import type { User } from "@/types/user";
import type { UpdateUserInput } from "@/types/user";
import { usersApi } from "@/services/usersApi";

interface UseUpdateUserReturn {
  updateUser: (id: string, input: UpdateUserInput) => Promise<User | null>;
  loading: boolean;
  error: string | null;
}

export function useUpdateUser(): UseUpdateUserReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUser = async (
    id: string,
    input: UpdateUserInput,
  ): Promise<User | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await usersApi.updateUser(id, input);
      return response;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al actualizar usuario";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateUser, loading, error };
}
