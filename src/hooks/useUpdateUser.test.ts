import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUpdateUser } from '@/hooks/useUpdateUser';

const mockUpdateUser = vi.fn();

vi.mock('@/services/usersApi', () => ({
  usersApi: {
    updateUser: (id: string, input: unknown) => mockUpdateUser(id, input),
  },
}));

describe('useUpdateUser', () => {
  beforeEach(() => {
    mockUpdateUser.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns an updateUser function with initial idle state', () => {
    const { result } = renderHook(() => useUpdateUser());

    expect(typeof result.current.updateUser).toBe('function');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('calls usersApi.updateUser with correct id and input', async () => {
    const mockResponse = {
      data: { id: 'user-1', email: 'updated@example.com', username: 'updated', role: 'USER' as const },
    };
    mockUpdateUser.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useUpdateUser());

    await act(async () => {
      await result.current.updateUser('user-1', { email: 'updated@example.com' });
    });

    expect(mockUpdateUser).toHaveBeenCalledWith('user-1', { email: 'updated@example.com' });
  });

  it('returns the updated user on success', async () => {
    const mockResponse = {
      data: { id: 'user-1', email: 'changed@example.com', username: 'changed', role: 'ADMIN' as const },
    };
    mockUpdateUser.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useUpdateUser());

    let updatedUser: unknown;
    await act(async () => {
      updatedUser = await result.current.updateUser('user-1', { role: 'ADMIN' });
    });

    expect(updatedUser).toEqual(mockResponse.data);
  });

  it('sets error state when API throws', async () => {
    mockUpdateUser.mockRejectedValue(new Error('Error al actualizar usuario'));

    const { result } = renderHook(() => useUpdateUser());

    await act(async () => {
      await result.current.updateUser('user-1', { username: 'fail' });
    });

    expect(result.current.error).toBe('Error al actualizar usuario');
  });

  it('returns null on API error', async () => {
    mockUpdateUser.mockRejectedValue(new Error('Usuario no encontrado'));

    const { result } = renderHook(() => useUpdateUser());

    let updatedUser: unknown;
    await act(async () => {
      updatedUser = await result.current.updateUser('bad-id', { email: 'x@x.com' });
    });

    expect(updatedUser).toBeNull();
  });
});
