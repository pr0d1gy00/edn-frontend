import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUpdateGuest } from '@/hooks/useUpdateGuest';

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL_LOCAL}`;
const MOCK_TOKEN = 'test-jwt-token';

vi.mock('@/stores/authStore', () => ({
  useAuthStore: {
    getState: () => ({
      getAccessToken: () => MOCK_TOKEN,
    }),
  },
}));

describe('useUpdateGuest', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns an updateGuest function with initial idle state', () => {
    const { result } = renderHook(() => useUpdateGuest());

    expect(typeof result.current.updateGuest).toBe('function');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('calls PATCH /guests/{id} with partial body and Bearer auth', async () => {
    const mockResponse = { id: 'guest-1', name: 'Updated', bio: 'New bio' };
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify(mockResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const { result } = renderHook(() => useUpdateGuest());

    await act(async () => {
      await result.current.updateGuest('guest-1', { bio: 'New bio' });
    });

    expect(fetch).toHaveBeenCalledWith(
      `${API_BASE}/guests/guest-1`,
      expect.objectContaining({
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${MOCK_TOKEN}`,
        },
        body: JSON.stringify({ bio: 'New bio' }),
      }),
    );
  });

  it('returns the updated guest on success', async () => {
    const mockResponse = {
      id: 'guest-1',
      name: 'Alice Updated',
      bio: 'Changed bio',
      twitterHandle: 'alice_new',
    };
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify(mockResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const { result } = renderHook(() => useUpdateGuest());

    let updated: unknown;
    await act(async () => {
      updated = await result.current.updateGuest('guest-1', {
        name: 'Alice Updated',
        bio: 'Changed bio',
        twitterHandle: 'alice_new',
      });
    });

    expect(updated).toEqual(mockResponse);
  });

  it('sets error state when request fails', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useUpdateGuest());

    await act(async () => {
      await result.current.updateGuest('guest-1', { name: 'Fail' });
    });

    expect(result.current.error).toBe('Network error');
  });

  it('handles 404 not found as error', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ message: 'Not found' }), { status: 404 }),
    );

    const { result } = renderHook(() => useUpdateGuest());

    await act(async () => {
      await result.current.updateGuest('nonexistent', { name: 'X' });
    });

    expect(result.current.error).toBe('Error updating guest');
  });
});
