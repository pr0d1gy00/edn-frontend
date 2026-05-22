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
};
