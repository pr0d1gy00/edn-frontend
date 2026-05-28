import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAddGuestToEpisode } from '@/hooks/useAddGuestToEpisode';

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL_LOCAL}`;

// Mock the auth store
vi.mock('@/stores/authStore', () => ({
  useAuthStore: {
    getState: vi.fn(() => ({
      getAccessToken: vi.fn(() => 'test-token'),
    })),
  },
}));

describe('useAddGuestToEpisode', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns initial state with addGuestToEpisode function', () => {
    const { result } = renderHook(() => useAddGuestToEpisode());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.addGuestToEpisode).toBe('function');
  });

  it('calls POST /episodes/{id}/guests/{guestId} with auth header', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(null, { status: 200 }),
    );

    const { result } = renderHook(() => useAddGuestToEpisode());

    let success: boolean | undefined;
    await act(async () => {
      success = await result.current.addGuestToEpisode('ep-1', 'g-42');
    });

    expect(success).toBe(true);
    expect(fetch).toHaveBeenCalledWith(
      `${API_BASE}/episodes/ep-1/guests/g-42`,
      expect.objectContaining({
        method: 'POST',
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

    const { result } = renderHook(() => useAddGuestToEpisode());

    act(() => {
      result.current.addGuestToEpisode('ep-1', 'g-1');
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('returns false and sets error on failure', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useAddGuestToEpisode());

    let success: boolean | undefined;
    await act(async () => {
      success = await result.current.addGuestToEpisode('ep-1', 'g-1');
    });

    expect(success).toBe(false);
    expect(result.current.error).toBe('Network error');
  });

  it('handles non-OK response as error', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ message: 'Guest already assigned' }), { status: 409 }),
    );

    const { result } = renderHook(() => useAddGuestToEpisode());

    let success: boolean | undefined;
    await act(async () => {
      success = await result.current.addGuestToEpisode('ep-1', 'g-1');
    });

    expect(success).toBe(false);
    expect(result.current.error).toBe('Error al agregar invitado al episodio');
  });

  it('sends request without body', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(null, { status: 200 }),
    );

    const { result } = renderHook(() => useAddGuestToEpisode());

    await act(async () => {
      await result.current.addGuestToEpisode('ep-1', 'g-1');
    });

    const fetchCall = vi.mocked(fetch).mock.calls[0];
    // No body should be sent
    const options = fetchCall[1] as RequestInit;
    expect(options.body).toBeUndefined();
  });
});
