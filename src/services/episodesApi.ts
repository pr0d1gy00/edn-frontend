import Cookies from 'js-cookie';
import type { Episode } from '@/types/episode';
import type { Guest } from '@/types/episode';
import type { InsideJoke } from '@/types/episode';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

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

interface EpisodeResponse {
  id: string;
  episodeNumber: number;
  title: string;
  description: string;
  platformType: 'YOUTUBE' | 'SPOTIFY' | 'OTHER';
  contentUrl?: string;
  thumbnailUrl?: string;
  publishedAt: string;
  isExclusive: boolean;
  durationSeconds?: number;
  guests?: Guest[];
  insideJokes?: InsideJoke[];
}

interface CreateEpisodeDto {
  episodeNumber: number;
  title: string;
  description: string;
  platformType: 'YOUTUBE' | 'SPOTIFY' | 'OTHER';
  contentUrl?: string;
  thumbnailUrl?: string;
  publishedAt: string;
  isExclusive: boolean;
  durationSeconds?: number;
}

interface UpdateEpisodeDto extends Partial<CreateEpisodeDto> {}

interface AddGuestDto {
  name: string;
  bio: string;
  twitterHandle?: string;
  instagramHandle?: string;
}

// Get auth headers with access token
function getAuthHeaders(): HeadersInit {
  const token = Cookies.get('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// Episodes API
export const episodesApi = {
  // GET /episodes - List all episodes with pagination
  getEpisodes: async (page = 1, limit = 10): Promise<PaginatedResponse<EpisodeResponse>> => {
    const response = await fetch(`${API_BASE}/episodes?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error fetching episodes');
    return response.json();
  },

  // GET /episodes/:id - Get single episode by ID
  getEpisodeById: async (id: string): Promise<ApiResponse<EpisodeResponse>> => {
    const response = await fetch(`${API_BASE}/episodes/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error fetching episode');
    return response.json();
  },

  // POST /episodes - Create new episode
  createEpisode: async (episode: CreateEpisodeDto): Promise<ApiResponse<EpisodeResponse>> => {
    const response = await fetch(`${API_BASE}/episodes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(episode),
    });
    if (!response.ok) throw new Error('Error creating episode');
    return response.json();
  },

  // PATCH /episodes/:id - Update episode
  updateEpisode: async (id: string, episode: UpdateEpisodeDto): Promise<ApiResponse<EpisodeResponse>> => {
    const response = await fetch(`${API_BASE}/episodes/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(episode),
    });
    if (!response.ok) throw new Error('Error updating episode');
    return response.json();
  },

  // DELETE /episodes/:id - Delete episode
  deleteEpisode: async (id: string): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await fetch(`${API_BASE}/episodes/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error deleting episode');
    return response.json();
  },

  // POST /episodes/:id/guests - Add guest to episode
  addGuest: async (episodeId: string, guest: AddGuestDto): Promise<ApiResponse<Guest>> => {
    const response = await fetch(`${API_BASE}/episodes/${episodeId}/guests`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(guest),
    });
    if (!response.ok) throw new Error('Error adding guest');
    return response.json();
  },

  // DELETE /episodes/:id/guests/:guestId - Remove guest from episode
  removeGuest: async (episodeId: string, guestId: string): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await fetch(`${API_BASE}/episodes/${episodeId}/guests/${guestId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error removing guest');
    return response.json();
  },

  // POST /episodes/:id/inside-jokes - Add inside joke to episode
  addInsideJoke: async (
    episodeId: string,
    joke: { startTimeStamp: string; endTimeStamp: string; keyConcept: string; transcriptContext: string }
  ): Promise<ApiResponse<InsideJoke>> => {
    const response = await fetch(`${API_BASE}/episodes/${episodeId}/inside-jokes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(joke),
    });
    if (!response.ok) throw new Error('Error adding inside joke');
    return response.json();
  },

  // DELETE /episodes/:id/inside-jokes/:jokeId - Remove inside joke
  removeInsideJoke: async (episodeId: string, jokeId: string): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await fetch(`${API_BASE}/episodes/${episodeId}/inside-jokes/${jokeId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error removing inside joke');
    return response.json();
  },
};