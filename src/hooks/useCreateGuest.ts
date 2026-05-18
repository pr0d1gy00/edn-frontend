import { useState } from "react";
import type { Guest } from "@/types/guest";
import type { CreateGuestInput } from "@/types/guest";
import { useAuthStore } from "@/stores/authStore";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface UseCreateGuestReturn {
  createGuest: (input: CreateGuestInput) => Promise<Guest | null>;
  loading: boolean;
  error: string | null;
}

export function useCreateGuest(): UseCreateGuestReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createGuest = async (
    input: CreateGuestInput,
  ): Promise<Guest | null> => {
    setLoading(true);
    setError(null);

    try {
      const token = useAuthStore.getState().getAccessToken();
      console.log("token", token);
      const response = await fetch(`${API_BASE}/guests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || "Error al crear invitado");
      }

      const data: Guest = await response.json();
      return data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al crear invitado";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createGuest, loading, error };
}
