import { useState } from "react";
import type { User } from "@/types/user";
import type { CreateUserInput } from "@/types/user";
import { usersApi } from "@/services/usersApi";

interface UseCreateUserReturn {
  createUser: (input: CreateUserInput) => Promise<User | null>;
  loading: boolean;
  error: string | null;
}

export function useCreateUser(): UseCreateUserReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUser = async (input: CreateUserInput): Promise<User | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await usersApi.createUser(input);
      return response;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al crear usuario";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createUser, loading, error };
}
