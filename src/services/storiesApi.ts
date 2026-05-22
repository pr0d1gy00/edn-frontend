import Cookies from 'js-cookie';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface StoryAdmin {
  id: string;
  title: string;
  content: string;
  authorId: string;
  promptId: string;
  isApproved: boolean;
  createdAt?: string;
  updatedAt?: string;
  author?: {
    id: string;
    username: string;
    email: string;
    avatarUrl?: string;
  };
  prompt?: {
    id: string;
    title: string;
  };
  _count?: {
    votes: number;
  };
  score?: number;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

function getAuthHeaders(): HeadersInit {
  const accessToken = Cookies.get('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
  };
}

export async function getAllStories(): Promise<ApiResponse<StoryAdmin[]>> {
  try {
    const response = await fetch(`${API_BASE}/stories/all`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Error al obtener historias' };
    }

    return {
      success: true,
      data: Array.isArray(data) ? data : (data.data || []),
    };
  } catch (error) {
    console.error('Get all stories error:', error);
    return { success: false, error: 'Error de red' };
  }
}

export async function getStoryById(id: string): Promise<ApiResponse<StoryAdmin>> {
  try {
    const response = await fetch(`${API_BASE}/stories/${id}/admin`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Error al obtener historia' };
    }

    return {
      success: true,
      data: data.data || data,
    };
  } catch (error) {
    console.error('Get story by id error:', error);
    return { success: false, error: 'Error de red' };
  }
}

export async function approveStory(id: string): Promise<ApiResponse<StoryAdmin>> {
  try {
    const response = await fetch(`${API_BASE}/stories/${id}/approve`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Error al aprobar historia' };
    }

    return {
      success: true,
      data: data.data || data,
    };
  } catch (error) {
    console.error('Approve story error:', error);
    return { success: false, error: 'Error de red' };
  }
}

export async function rejectStory(id: string): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`${API_BASE}/stories/${id}/reject`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok && response.status !== 204) {
      const data = await response.json();
      return { success: false, error: data.error || 'Error al rechazar historia' };
    }

    return { success: true };
  } catch (error) {
    console.error('Reject story error:', error);
    return { success: false, error: 'Error de red' };
  }
}

export async function deleteStory(id: string): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`${API_BASE}/stories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok && response.status !== 204) {
      const data = await response.json();
      return { success: false, error: data.error || 'Error al eliminar historia' };
    }

    return { success: true };
  } catch (error) {
    console.error('Delete story error:', error);
    return { success: false, error: 'Error de red' };
  }
}

export async function updateStory(
  id: string,
  data: { title?: string; content?: string }
): Promise<ApiResponse<StoryAdmin>> {
  try {
    const response = await fetch(`${API_BASE}/stories/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.error || 'Error al actualizar historia' };
    }

    return {
      success: true,
      data: result.data || result,
    };
  } catch (error) {
    console.error('Update story error:', error);
    return { success: false, error: 'Error de red' };
  }
}