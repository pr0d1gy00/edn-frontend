import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useUserById } from '@/hooks/useUserById';

const mockGetUserById = vi.fn();

vi.mock('@/services/usersApi', () => ({
  usersApi: {
    getUserById: (id: string) => mockGetUserById(id),
  },
}));

describe('useUserById', () => {
  beforeEach(() => {
    mockGetUserById.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns loading true and null user initially', () => {
    mockGetUserById.mockResolvedValue({
      data: { id: '1', email: 'test@example.com', username: 'test', role: 'USER' },
    });

    const { result } = renderHook(() => useUserById('1'));

    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('fetches user by id and returns data after loading', async () => {
    const mockUser = { id: 'user-1', email: 'alice@example.com', username: 'alice', role: 'USER' as const };
    mockGetUserById.mockResolvedValue({
      data: mockUser,
    });

    const { result } = renderHook(() => useUserById('user-1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.error).toBeNull();
    expect(mockGetUserById).toHaveBeenCalledWith('user-1');
  });

  it('returns error state when API throws', async () => {
    mockGetUserById.mockRejectedValue(new Error('Error al cargar usuario'));

    const { result } = renderHook(() => useUserById('bad-id'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.error).toBe('Error al cargar usuario');
  });

  it('returns generic error message for non-Error throws', async () => {
    mockGetUserById.mockRejectedValue('Unknown failure');

    const { result } = renderHook(() => useUserById('1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Error al cargar usuario');
  });
});
