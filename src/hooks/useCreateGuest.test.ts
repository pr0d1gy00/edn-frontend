import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useCreateGuest } from '@/hooks/useCreateGuest';

const API_BASE = 'http://localhost:3000';
const MOCK_TOKEN = 'test-jwt-token';

vi.mock('@/stores/authStore', () => ({
  useAuthStore: {
    getState: () => ({
      getAccessToken: () => MOCK_TOKEN,
    }),
  },
}));

describe('useCreateGuest', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns a createGuest function with initial idle state', () => {
    const { result } = renderHook(() => useCreateGuest());

    expect(typeof result.current.createGuest).toBe('function');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('calls POST /guests with correct body and Bearer auth header', async () => {
    const mockResponse = { id: 'new-1', name: 'New Guest', bio: 'Bio' };
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify(mockResponse), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const { result } = renderHook(() => useCreateGuest());

    await act(async () => {
      await result.current.createGuest({ name: 'New Guest', bio: 'Bio' });
    });

    expect(fetch).toHaveBeenCalledWith(
      `${API_BASE}/guests`,
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${MOCK_TOKEN}`,
        },
        body: JSON.stringify({ name: 'New Guest', bio: 'Bio' }),
      }),
    );
  });

  it('returns the created guest on success', async () => {
    const mockResponse = {
      id: 'new-1',
      name: 'Jane',
      bio: 'Musician',
      twitterHandle: 'jane',
    };
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify(mockResponse), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const { result } = renderHook(() => useCreateGuest());

    let createdGuest: unknown;
    await act(async () => {
      createdGuest = await result.current.createGuest({
        name: 'Jane',
        bio: 'Musician',
        twitterHandle: 'jane',
      });
    });

    expect(createdGuest).toEqual(mockResponse);
  });

  it('sets error state when request fails', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useCreateGuest());

    await act(async () => {
      await result.current.createGuest({ name: 'Fail' });
    });

    expect(result.current.error).toBe('Network error');
  });

  it('sets loading to true during request and false after', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ id: '1', name: 'Test', bio: 'Test' }), {
        status: 201,
      }),
    );

    const { result } = renderHook(() => useCreateGuest());

    let promise: Promise<unknown>;
    await act(async () => {
      promise = result.current.createGuest({ name: 'Test', bio: 'Test' });
    });

    // loading should be false after completion
    await act(async () => {
      await promise;
    });

    expect(result.current.loading).toBe(false);
  });
});
