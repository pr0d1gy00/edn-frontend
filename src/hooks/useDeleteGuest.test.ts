import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDeleteGuest } from '@/hooks/useDeleteGuest';

const API_BASE = 'http://localhost:3000';
const MOCK_TOKEN = 'test-jwt-token';

vi.mock('@/stores/authStore', () => ({
  useAuthStore: {
    getState: () => ({
      getAccessToken: () => MOCK_TOKEN,
    }),
  },
}));

describe('useDeleteGuest', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns a deleteGuest function with initial idle state', () => {
    const { result } = renderHook(() => useDeleteGuest());

    expect(typeof result.current.deleteGuest).toBe('function');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('calls DELETE /guests/{id} with Bearer auth header', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ success: true }), { status: 200 }),
    );

    const { result } = renderHook(() => useDeleteGuest());

    await act(async () => {
      await result.current.deleteGuest('guest-1');
    });

    expect(fetch).toHaveBeenCalledWith(
      `${API_BASE}/guests/guest-1`,
      expect.objectContaining({
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${MOCK_TOKEN}`,
        },
      }),
    );
  });

  it('returns true on successful deletion', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ success: true }), { status: 200 }),
    );

    const { result } = renderHook(() => useDeleteGuest());

    let deleted: unknown;
    await act(async () => {
      deleted = await result.current.deleteGuest('guest-1');
    });

    expect(deleted).toBe(true);
  });

  it('sets error state when request fails', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useDeleteGuest());

    await act(async () => {
      await result.current.deleteGuest('guest-1');
    });

    expect(result.current.error).toBe('Network error');
  });

  it('returns false on non-OK response', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(null, { status: 500 }),
    );

    const { result } = renderHook(() => useDeleteGuest());

    let deleted: unknown;
    await act(async () => {
      deleted = await result.current.deleteGuest('guest-1');
    });

    expect(deleted).toBe(false);
  });

  it('handles 404 not found gracefully', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ message: 'Not found' }), { status: 404 }),
    );

    const { result } = renderHook(() => useDeleteGuest());

    let deleted: unknown;
    await act(async () => {
      deleted = await result.current.deleteGuest('nonexistent');
    });

    expect(deleted).toBe(false);
    expect(result.current.error).toBe('Error deleting guest');
  });
});
