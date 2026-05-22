import Cookies from "js-cookie";
import type { Episode } from "@/types/episode";
import type { Guest } from "@/types/episode";
import type { InsideJoke } from "@/types/episode";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface ApiResponse<T> {
  data: T;
  message?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface EpisodeImageResponse {
  id: string;
  url: string;
}

interface EpisodeResponse {
  id: string;
  episodeNumber: number;
  title: string;
  description: string;
  platformType: "YOUTUBE" | "SPOTIFY" | "PATREON" | "OTHER";
  contentUrl?: string;
  thumbnailUrl?: string;
  publishedAt: string;
  isExclusive: boolean;
  durationSeconds?: number;
  guests?: Guest[];
  insideJokes?: InsideJoke[];
  images?: EpisodeImageResponse[];
}

interface CreateEpisodeDto {
  episodeNumber: number;
  title: string;
  description: string;
  platformType: "YOUTUBE" | "SPOTIFY" | "PATREON" | "OTHER";
  contentUrl?: string;
  thumbnailUrl?: string;
  publishedAt: string;
  isExclusive: boolean;
  durationSeconds?: number;
  images?: File[];
  existingImagesIds?: string[];
}

interface UpdateEpisodeDto extends Partial<CreateEpisodeDto> {}

interface AddGuestDto {
  name: string;
  bio: string;
  twitterHandle?: string;
  instagramHandle?: string;
}

// Get auth headers with access token
function getAuthHeaders(json = true): HeadersInit {
  const token = Cookies.get("accessToken");
  if (!json) {
    // For FormData, don't set Content-Type (browser sets it with boundary)
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// Episodes API
export const episodesApi = {
  // GET /episodes - List all episodes with pagination
  getEpisodes: async (
    page = 1,
    limit = 10,
  ): Promise<PaginatedResponse<EpisodeResponse>> => {
    const response = await fetch(
      `${API_BASE}/episodes?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      },
    );
    if (!response.ok) throw new Error("Error fetching episodes");
    return response.json();
  },

  // GET /episodes/:id - Get single episode by ID
  getEpisodeById: async (id: string): Promise<EpisodeResponse> => {
    const response = await fetch(`${API_BASE}/episodes/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error fetching episode");
    return response.json();
  },

  // POST /episodes - Create new episode
  createEpisode: async (
    episode: CreateEpisodeDto,
  ): Promise<ApiResponse<EpisodeResponse>> => {
    const formData = new FormData();
    formData.append("episodeNumber", episode.episodeNumber.toString());
    formData.append("title", episode.title);
    formData.append("description", episode.description);
    formData.append("platformType", episode.platformType);
    formData.append("publishedAt", episode.publishedAt);
    formData.append("isExclusive", episode.isExclusive.toString());

    if (episode.contentUrl) formData.append("contentUrl", episode.contentUrl);
    if (episode.thumbnailUrl)
      formData.append("thumbnailUrl", episode.thumbnailUrl);
    if (episode.durationSeconds)
      formData.append("durationSeconds", episode.durationSeconds.toString());

    if (episode.images && episode.images.length > 0) {
      episode.images.forEach((file) => {
        formData.append("files", file);
      });
    }

    const response = await fetch(`${API_BASE}/episodes`, {
      method: "POST",
      headers: getAuthHeaders(false),
      body: formData,
    });
    if (!response.ok) {
      console.log(response);
      const error = await response.json();
      const message = error.message || "Error creating episode";
      throw new Error(message);
    }
    return response.json();
  },

  // PATCH /episodes/:id - Update episode
  updateEpisode: async (
    id: string,
    episode: UpdateEpisodeDto,
  ): Promise<ApiResponse<EpisodeResponse>> => {
    // Always use FormData to avoid JSON serialization issues
    const formData = new FormData();

    // Only append fields that have values
    if (episode.title) formData.append("title", episode.title);
    if (episode.description)
      formData.append("description", episode.description);
    if (episode.platformType)
      formData.append("platformType", episode.platformType);
    if (episode.contentUrl) formData.append("contentUrl", episode.contentUrl);
    if (episode.thumbnailUrl)
      formData.append("thumbnailUrl", episode.thumbnailUrl);
    if (episode.publishedAt)
      formData.append("publishedAt", episode.publishedAt);
    if (episode.isExclusive !== undefined)
      formData.append("isExclusive", episode.isExclusive.toString());
    if (episode.durationSeconds)
      formData.append("durationSeconds", episode.durationSeconds.toString());
    if (episode.episodeNumber)
      formData.append("episodeNumber", episode.episodeNumber.toString());

    if (episode.images && episode.images.length > 0) {
      episode.images.forEach((file) => {
        formData.append("files", file);
      });
    }
    episode.existingImagesIds ? formData.append("existingImageIds", JSON.stringify(episode.existingImagesIds)) : null;
    const response = await fetch(`${API_BASE}/episodes/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(false),
      body: formData,
    });
    if (!response.ok) {
      const error = await response.json();
      const message = error.message || "Error updating episode";
      throw new Error(message);
    }
    return response.json();
  },

  // DELETE /episodes/:id - Delete episode
  deleteEpisode: async (
    id: string,
  ): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await fetch(`${API_BASE}/episodes/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error deleting episode");
    return response.json();
  },

  // POST /episodes/:id/guests - Add guest to episode
  addGuest: async (
    episodeId: string,
    guest: AddGuestDto,
  ): Promise<ApiResponse<Guest>> => {
    const response = await fetch(`${API_BASE}/episodes/${episodeId}/guests`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(guest),
    });
    if (!response.ok) throw new Error("Error adding guest");
    return response.json();
  },

  // DELETE /episodes/:id/guests/:guestId - Remove guest from episode
  removeGuest: async (
    episodeId: string,
    guestId: string,
  ): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await fetch(
      `${API_BASE}/episodes/${episodeId}/guests/${guestId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      },
    );
    if (!response.ok) throw new Error("Error removing guest");
    return response.json();
  },

  // POST /episodes/:id/inside-jokes - Add inside joke to episode
  addInsideJoke: async (joke: {
    episodeId: string;
    startTimeStamp: string;
    endTimeStamp: string;
    keyConcept: string;
    transcriptContext: string;
  }): Promise<ApiResponse<InsideJoke>> => {
    const response = await fetch(`${API_BASE}/inside-jokes`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(joke),
    });
    if (!response.ok) throw new Error("Error adding inside joke");
    return response.json();
  },

  // DELETE /episodes/:id/inside-jokes/:jokeId - Remove inside joke
  removeInsideJoke: async (jokeId: string) => {
    const response = await fetch(`${API_BASE}/inside-jokes/${jokeId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error removing inside joke");
    return response.json();
  },

  // POST /episodes/:id/images - Add images to episode
  addImage: async (
    episodeId: string,
    imageUrl: string,
  ): Promise<ApiResponse<EpisodeImageResponse>> => {
    const response = await fetch(`${API_BASE}/episodes/${episodeId}/images`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ url: imageUrl }),
    });
    if (!response.ok) throw new Error("Error adding image");
    return response.json();
  },

  // DELETE /episodes/:id/images/:imageId - Remove image from episode
  removeImage: async (
    episodeId: string,
    imageId: string,
  ): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await fetch(
      `${API_BASE}/episodes/${episodeId}/images/${imageId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      },
    );
    if (!response.ok) throw new Error("Error removing image");
    return response.json();
  },
};
