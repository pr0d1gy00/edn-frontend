import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useGuests } from '@/hooks/useGuests';

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL_LOCAL}`;

describe('useGuests', () => {
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

    const { result } = renderHook(() => useGuests());

    expect(result.current.loading).toBe(true);
    expect(result.current.guests).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('fetches from GET /guests and returns data after loading', async () => {
    const mockGuests = [
      { id: '1', name: 'Alice', bio: 'Comedian', twitterHandle: 'alice' },
      { id: '2', name: 'Bob', bio: 'Musician' },
    ];

    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify(mockGuests), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const { result } = renderHook(() => useGuests());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.guests).toEqual(mockGuests);
    expect(result.current.error).toBeNull();

    // Verify fetch was called with correct URL and no auth (public endpoint)
    expect(fetch).toHaveBeenCalledWith(
      `${API_BASE}/guests`,
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('returns error state when fetch fails', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useGuests());

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

    const { result } = renderHook(() => useGuests());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.guests).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('handles non-OK HTTP response as error', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ message: 'Server error' }), { status: 500 }),
    );

    const { result } = renderHook(() => useGuests());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Error fetching guests');
  });
});
