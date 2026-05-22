import Cookies from 'js-cookie';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface VoteResponse {
  success: boolean;
  data?: {
    score: number;
    userVote: 1 | -1 | 0;
  };
  error?: string;
}

interface ScoreResponse {
  success: boolean;
  data?: {
    score: number;
  };
  error?: string;
}

interface UserVoteResponse {
  success: boolean;
  data?: {
    voteValue: 1 | -1;
  } | null;
  error?: string;
}

export async function vote(storyId: string, voteValue: 1 | -1): Promise<VoteResponse> {
  const accessToken = Cookies.get('accessToken');
  const votesValueConvert = voteValue.toString()
  if (!accessToken) {
    return { success: false, error: 'No autenticado' };
  }

  try {
    const response = await fetch(`${API_BASE}/stories/${storyId}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({  voteValue: votesValueConvert }),
    });

    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data.error || 'Error al votar' };
    }
    return {
      success: true,
      data: {
        score: data?.score ?? data.score,
        userVote: data?.voteValue ?? voteValue,
      },
    };
  } catch (error) {
    console.error('Vote error:', error);
    return { success: false, error: 'Error de red' };
  }
}

export async function removeVote(storyId: string): Promise<VoteResponse> {
  const accessToken = Cookies.get('accessToken');

  if (!accessToken) {
    return { success: false, error: 'No autenticado' };
  }

  try {
    const response = await fetch(`${API_BASE}/stories/${storyId}/vote`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    // DELETE returns 204 No Content on success
    if (!response.ok && response.status !== 204) {
      const data = await response.json();
      return { success: false, error: data.error || 'Error al eliminar voto' };
    }

    return {
      success: true,
      data: {
        score: 0, // Score se actualiza via optimistic update
        userVote: 0,
      },
    };
  } catch (error) {
    console.error('Remove vote error:', error);
    return { success: false, error: 'Error de red' };
  }
}

export async function getScore(storyId: string): Promise<ScoreResponse> {
  try {
    const response = await fetch(`${API_BASE}/stories/${storyId}/vote/score`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data.error || 'Error al obtener score' };
    }

    return {
      success: true,
      data: {
        score: data.score ?? data.score ?? 0,
      },
    };
  } catch (error) {
    console.error('Get score error:', error);
    return { success: false, error: 'Error de red' };
  }
}

export async function getUserVote(storyId: string): Promise<UserVoteResponse> {
  const accessToken = Cookies.get('accessToken');

  if (!accessToken) {
    return { success: true, data: null }; // Not authenticated = no vote
  }

  try {
    const response = await fetch(`${API_BASE}/stories/${storyId}/vote`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    // 404 means no vote yet, which is fine
    if (response.status === 404) {
      return { success: true, data: null };
    }

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Error al obtener voto' };
    }

    return {
      success: true,
      data: {
        voteValue: data.data?.voteValue ?? data.voteValue,
      },
    };
  } catch (error) {
    console.error('Get user vote error:', error);
    return { success: false, error: 'Error de red' };
  }
}