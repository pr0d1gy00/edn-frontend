import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useRemoveGuestFromEpisode } from '@/hooks/useRemoveGuestFromEpisode';

const API_BASE = 'http://localhost:3000';

vi.mock('@/stores/authStore', () => ({
  useAuthStore: {
    getState: vi.fn(() => ({
      getAccessToken: vi.fn(() => 'test-token'),
    })),
  },
}));

describe('useRemoveGuestFromEpisode', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns initial state with removeGuestFromEpisode function', () => {
    const { result } = renderHook(() => useRemoveGuestFromEpisode());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.removeGuestFromEpisode).toBe('function');
  });

  it('calls DELETE /episodes/{id}/guests/{guestId} with auth header', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(null, { status: 200 }),
    );

    const { result } = renderHook(() => useRemoveGuestFromEpisode());

    let success: boolean | undefined;
    await act(async () => {
      success = await result.current.removeGuestFromEpisode('ep-1', 'g-42');
    });

    expect(success).toBe(true);
    expect(fetch).toHaveBeenCalledWith(
      `${API_BASE}/episodes/ep-1/guests/g-42`,
      expect.objectContaining({
        method: 'DELETE',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token',
        }),
      }),
    );
  });

  it('sets loading true during request and false after', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(null, { status: 200 }),
    );

    const { result } = renderHook(() => useRemoveGuestFromEpisode());

    act(() => {
      result.current.removeGuestFromEpisode('ep-1', 'g-1');
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('returns false and sets error on failure', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useRemoveGuestFromEpisode());

    let success: boolean | undefined;
    await act(async () => {
      success = await result.current.removeGuestFromEpisode('ep-1', 'g-1');
    });

    expect(success).toBe(false);
    expect(result.current.error).toBe('Network error');
  });

  it('handles non-OK response as error', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ message: 'Not found' }), { status: 404 }),
    );

    const { result } = renderHook(() => useRemoveGuestFromEpisode());

    let success: boolean | undefined;
    await act(async () => {
      success = await result.current.removeGuestFromEpisode('ep-1', 'g-1');
    });

    expect(success).toBe(false);
    expect(result.current.error).toBe('Error al eliminar invitado del episodio');
  });

  it('removes guest with correct episode and guest IDs', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(null, { status: 200 }),
    );

    const { result } = renderHook(() => useRemoveGuestFromEpisode());

    await act(async () => {
      await result.current.removeGuestFromEpisode('ep-99', 'g-123');
    });

    const fetchCall = vi.mocked(fetch).mock.calls[0];
    const url = fetchCall[0] as string;
    expect(url).toContain('/episodes/ep-99/guests/g-123');
  });
});
