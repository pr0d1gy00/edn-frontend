import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useEpisodeGuests } from '@/hooks/useEpisodeGuests';

const API_BASE = 'http://localhost:3000';

describe('useEpisodeGuests', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns loading true and empty guests initially', () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify([]), { status: 200 }),
    );

    const { result } = renderHook(() => useEpisodeGuests('ep-1'));

    expect(result.current.guests).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('fetches from GET /episodes/{id}/guests and returns guests after loading', async () => {
    const mockGuests = [
      { id: 'g1', name: 'Alice', bio: 'Comedian', twitterHandle: 'alice' },
      { id: 'g2', name: 'Bob', bio: 'Musician' },
    ];

    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify(mockGuests), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const { result } = renderHook(() => useEpisodeGuests('ep-1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.guests).toEqual(mockGuests);
    expect(result.current.error).toBeNull();

    // Verify fetch was called with correct URL (public endpoint, no auth)
    expect(fetch).toHaveBeenCalledWith(
      `${API_BASE}/episodes/ep-1/guests`,
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('returns error state when fetch fails', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useEpisodeGuests('ep-1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.guests).toEqual([]);
    expect(result.current.error).toBe('Network error');
  });

  it('handles empty guest list from API', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const { result } = renderHook(() => useEpisodeGuests('ep-1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.guests).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('handles non-OK HTTP response as error', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ message: 'Not found' }), { status: 404 }),
    );

    const { result } = renderHook(() => useEpisodeGuests('ep-1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Error al cargar invitados del episodio');
  });

  it('re-fetches when episodeId changes', async () => {
    const mockGuests1 = [{ id: 'g1', name: 'Alice', bio: 'Comedian' }];
    const mockGuests2 = [{ id: 'g2', name: 'Bob', bio: 'Musician' }];

    vi.mocked(fetch)
      .mockResolvedValueOnce(
        new Response(JSON.stringify(mockGuests1), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify(mockGuests2), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

    const { result, rerender } = renderHook(
      ({ episodeId }) => useEpisodeGuests(episodeId),
      { initialProps: { episodeId: 'ep-1' } },
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.guests).toEqual(mockGuests1);

    rerender({ episodeId: 'ep-2' });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.guests).toEqual(mockGuests2);
  });
});
