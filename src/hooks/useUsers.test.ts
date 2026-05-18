import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useUsers } from '@/hooks/useUsers';

const mockGetUsers = vi.fn();

vi.mock('@/services/usersApi', () => ({
  usersApi: {
    getUsers: (...args: unknown[]) => mockGetUsers(...args),
  },
}));

describe('useUsers', () => {
  beforeEach(() => {
    mockGetUsers.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns loading true and empty users initially', () => {
    mockGetUsers.mockResolvedValue({
      data: [],
      meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
    });

    const { result } = renderHook(() => useUsers());

    expect(result.current.loading).toBe(true);
    expect(result.current.users).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('fetches from usersApi.getUsers and returns data after loading', async () => {
    const mockUsers = [
      { id: '1', email: 'alice@example.com', username: 'alice', role: 'USER' as const },
      { id: '2', email: 'bob@example.com', username: 'bob', role: 'ADMIN' as const },
    ];
    mockGetUsers.mockResolvedValue({
      data: mockUsers,
      meta: { page: 1, limit: 10, total: 2, totalPages: 1 },
    });

    const { result } = renderHook(() => useUsers());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.users).toEqual(mockUsers);
    expect(result.current.error).toBeNull();
    expect(result.current.meta).toEqual({ page: 1, limit: 10, total: 2, totalPages: 1 });
  });

  it('passes page, limit, and search params to usersApi.getUsers', async () => {
    mockGetUsers.mockResolvedValue({
      data: [],
      meta: { page: 2, limit: 5, total: 0, totalPages: 0 },
    });

    renderHook(() => useUsers({ page: 2, limit: 5, search: 'alice' }));

    await waitFor(() => {
      expect(mockGetUsers).toHaveBeenCalledWith(2, 5, 'alice');
    });
  });

  it('returns error state when usersApi.getUsers throws', async () => {
    mockGetUsers.mockRejectedValue(new Error('Error al cargar usuarios'));

    const { result } = renderHook(() => useUsers());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.users).toEqual([]);
    expect(result.current.error).toBe('Error al cargar usuarios');
  });

  it('handles empty user list from API', async () => {
    mockGetUsers.mockResolvedValue({
      data: [],
      meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
    });

    const { result } = renderHook(() => useUsers());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.users).toEqual([]);
    expect(result.current.error).toBeNull();
  });
});
