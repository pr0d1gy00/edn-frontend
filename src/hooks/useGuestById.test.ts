import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useGuestById } from '@/hooks/useGuestById';

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL_LOCAL}`;

describe('useGuestById', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns loading true and null guest initially', () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({}), { status: 200 }),
    );

    const { result } = renderHook(() => useGuestById('guest-1'));

    expect(result.current.loading).toBe(true);
    expect(result.current.guest).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('fetches GET /guests/{id} and returns guest after loading', async () => {
    const mockGuest = {
      id: 'guest-1',
      name: 'Alice',
      bio: 'A comedian',
      twitterHandle: 'alice_comedy',
      instagramHandle: 'alice_ig',
    };

    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify(mockGuest), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const { result } = renderHook(() => useGuestById('guest-1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.guest).toEqual(mockGuest);
    expect(result.current.error).toBeNull();

    expect(fetch).toHaveBeenCalledWith(
      `${API_BASE}/guests/guest-1`,
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('returns error when fetch fails', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useGuestById('guest-1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.guest).toBeNull();
    expect(result.current.error).toBe('Network error');
  });

  it('handles non-OK HTTP response as error', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ message: 'Not found' }), { status: 404 }),
    );

    const { result } = renderHook(() => useGuestById('nonexistent'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Error fetching guest');
  });
});
