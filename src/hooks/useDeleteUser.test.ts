import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDeleteUser } from '@/hooks/useDeleteUser';

const mockDeleteUser = vi.fn();

vi.mock('@/services/usersApi', () => ({
  usersApi: {
    deleteUser: (id: string) => mockDeleteUser(id),
  },
}));

describe('useDeleteUser', () => {
  beforeEach(() => {
    mockDeleteUser.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns a deleteUser function with initial idle state', () => {
    const { result } = renderHook(() => useDeleteUser());

    expect(typeof result.current.deleteUser).toBe('function');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('calls usersApi.deleteUser with correct id', async () => {
    mockDeleteUser.mockResolvedValue({ data: { success: true } });

    const { result } = renderHook(() => useDeleteUser());

    await act(async () => {
      await result.current.deleteUser('user-1');
    });

    expect(mockDeleteUser).toHaveBeenCalledWith('user-1');
  });

  it('returns true on successful deletion', async () => {
    mockDeleteUser.mockResolvedValue({ data: { success: true } });

    const { result } = renderHook(() => useDeleteUser());

    let deleted: unknown;
    await act(async () => {
      deleted = await result.current.deleteUser('user-1');
    });

    expect(deleted).toBe(true);
  });

  it('sets error state when API throws', async () => {
    mockDeleteUser.mockRejectedValue(new Error('Error al eliminar usuario'));

    const { result } = renderHook(() => useDeleteUser());

    await act(async () => {
      await result.current.deleteUser('user-1');
    });

    expect(result.current.error).toBe('Error al eliminar usuario');
  });

  it('returns false on API error', async () => {
    mockDeleteUser.mockRejectedValue(new Error('Network failure'));

    const { result } = renderHook(() => useDeleteUser());

    let deleted: unknown;
    await act(async () => {
      deleted = await result.current.deleteUser('user-1');
    });

    expect(deleted).toBe(false);
  });

  it('returns false on non-Error throw', async () => {
    mockDeleteUser.mockRejectedValue('Unknown error');

    const { result } = renderHook(() => useDeleteUser());

    let deleted: unknown;
    await act(async () => {
      deleted = await result.current.deleteUser('user-1');
    });

    expect(deleted).toBe(false);
    expect(result.current.error).toBe('Error al eliminar usuario');
  });
});
