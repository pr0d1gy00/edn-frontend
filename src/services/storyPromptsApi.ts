import Cookies from "js-cookie";
import type { StoryPrompt } from "@/types/storyPrompt";
import type { Story } from "@/types/storyPrompt";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

function getAuthHeaders(): HeadersInit {
  const token = Cookies.get("accessToken");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export const storyPromptsApi = {
  // GET /story-prompts — fetch public/open prompts for voting
  getStoryPrompts: async (
    page = 1,
    limit = 10,
  ): Promise<PaginatedResponse<StoryPrompt>> => {
    const response = await fetch(
      `${API_BASE}/story-prompts?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      },
    );

    if (!response.ok) throw new Error("Error al cargar story prompts");
    return response.json();
  },

  // GET /story-prompts/:id — single prompt
  getStoryPromptById: async (id: string): Promise<StoryPrompt> => {
    const response = await fetch(`${API_BASE}/story-prompts/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error("Error al cargar story prompt");
    const data = await response.json();
    return data.data ?? data;
  },

  // GET /stories — fetch approved stories
  getStories: async (
    page = 1,
    limit = 10,
  ): Promise<PaginatedResponse<Story>> => {
    const response = await fetch(
      `${API_BASE}/stories?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      },
    );

    if (!response.ok) throw new Error("Error al cargar historias");
    return response.json();
  },

  // GET /stories/:id — single story
  getStoryById: async (id: string): Promise<Story> => {
    const response = await fetch(`${API_BASE}/stories/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error("Error al cargar historia");
    const data = await response.json();
    return data.data ?? data;
  },

  // ============================================
  // ADMIN OPERATIONS (Require Bearer Token)
  // ============================================

  // GET /story-prompts/all?includeAll=true — get all prompts for admin
  getAllPrompts: async (params: { includeAll?: boolean }): Promise<ApiResponse<StoryPrompt[]>> => {
    try {
      const response = await fetch(`${API_BASE}/story-prompts/all?includeAll=${params.includeAll}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, error: data.error || "Error al cargar prompts" };
      return { success: true, data: data.data ?? data };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Error de red" };
    }
  },

  // POST /story-prompts — create a new prompt (ADMIN only)
  createPrompt: async (prompt: {
    title: string;
    description: string;
    isPublic?: boolean;
  }): Promise<ApiResponse<StoryPrompt>> => {
    try {
      const response = await fetch(`${API_BASE}/story-prompts`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(prompt),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, error: data.error || "Error al crear prompt" };
      return { success: true, data: data.data ?? data };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Error de red" };
    }
  },

  // PATCH /story-prompts/:id — update a prompt (ADMIN only)
  updatePrompt: async (
    id: string,
    updates: {
      title?: string;
      description?: string;
      isPublic?: boolean;
    }
  ): Promise<ApiResponse<StoryPrompt>> => {
    try {
      const response = await fetch(`${API_BASE}/story-prompts/${id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, error: data.error || "Error al actualizar prompt" };
      return { success: true, data: data.data ?? data };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Error de red" };
    }
  },

  // POST /story-prompts/:id/open — open voting (ADMIN only)
  openVoting: async (id: string): Promise<ApiResponse<StoryPrompt>> => {
    try {
      const response = await fetch(`${API_BASE}/story-prompts/${id}/open`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, error: data.error || "Error al abrir voting" };
      return { success: true, data: data.data ?? data };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Error de red" };
    }
  },

  // POST /story-prompts/:id/close — close voting (ADMIN only)
  closeVoting: async (id: string): Promise<ApiResponse<StoryPrompt>> => {
    try {
      const response = await fetch(`${API_BASE}/story-prompts/${id}/close`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, error: data.error || "Error al cerrar voting" };
      return { success: true, data: data.data ?? data };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Error de red" };
    }
  },

  // POST /story-prompts/:id/publish — make public (ADMIN only)
  publishPrompt: async (id: string): Promise<ApiResponse<StoryPrompt>> => {
    try {
      const response = await fetch(`${API_BASE}/story-prompts/${id}/publish`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, error: data.error || "Error al publicar prompt" };
      return { success: true, data: data.data ?? data };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Error de red" };
    }
  },

  // POST /story-prompts/:id/unpublish — make private (ADMIN only)
  unpublishPrompt: async (id: string): Promise<ApiResponse<StoryPrompt>> => {
    try {
      const response = await fetch(`${API_BASE}/story-prompts/${id}/unpublish`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, error: data.error || "Error al despublicar prompt" };
      return { success: true, data: data.data ?? data };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Error de red" };
    }
  },

  // DELETE /story-prompts/:id — delete permanently (ADMIN only)
  deletePrompt: async (id: string): Promise<ApiResponse<void>> => {
    try {
      const response = await fetch(`${API_BASE}/story-prompts/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        const data = await response.json();
        return { success: false, error: data.error || "Error al eliminar prompt" };
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Error de red" };
    }
  },
};
