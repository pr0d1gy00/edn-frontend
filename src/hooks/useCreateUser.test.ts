import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCreateUser } from '@/hooks/useCreateUser';

const mockCreateUser = vi.fn();

vi.mock('@/services/usersApi', () => ({
  usersApi: {
    createUser: (input: unknown) => mockCreateUser(input),
  },
}));

describe('useCreateUser', () => {
  beforeEach(() => {
    mockCreateUser.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns a createUser function with initial idle state', () => {
    const { result } = renderHook(() => useCreateUser());

    expect(typeof result.current.createUser).toBe('function');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('calls usersApi.createUser with correct input', async () => {
    const mockResponse = {
      data: { id: 'new-1', email: 'new@example.com', username: 'newuser', role: 'USER' as const },
    };
    mockCreateUser.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useCreateUser());

    await act(async () => {
      await result.current.createUser({
        email: 'new@example.com',
        username: 'newuser',
        password: 'password123',
      });
    });

    expect(mockCreateUser).toHaveBeenCalledWith({
      email: 'new@example.com',
      username: 'newuser',
      password: 'password123',
    });
  });

  it('returns the created user on success', async () => {
    const mockResponse = {
      data: { id: 'new-1', email: 'jane@example.com', username: 'jane', role: 'USER' as const },
    };
    mockCreateUser.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useCreateUser());

    let createdUser: unknown;
    await act(async () => {
      createdUser = await result.current.createUser({
        email: 'jane@example.com',
        username: 'jane',
        password: 'securepass',
      });
    });

    expect(createdUser).toEqual(mockResponse.data);
  });

  it('sets error state when API throws', async () => {
    mockCreateUser.mockRejectedValue(new Error('Error al crear usuario'));

    const { result } = renderHook(() => useCreateUser());

    await act(async () => {
      await result.current.createUser({
        email: 'fail@example.com',
        username: 'fail',
        password: '123456',
      });
    });

    expect(result.current.error).toBe('Error al crear usuario');
  });

  it('sets loading to true during request and false after', async () => {
    mockCreateUser.mockResolvedValue({
      data: { id: '1', email: 'test@example.com', username: 'test', role: 'USER' as const },
    });

    const { result } = renderHook(() => useCreateUser());

    let promise: Promise<unknown>;
    await act(async () => {
      promise = result.current.createUser({
        email: 'test@example.com',
        username: 'test',
        password: 'test1234',
      });
    });

    await act(async () => {
      await promise;
    });

    expect(result.current.loading).toBe(false);
  });

  it('returns null on API error and sets error message', async () => {
    mockCreateUser.mockRejectedValue(new Error('El email ya está registrado'));

    const { result } = renderHook(() => useCreateUser());

    let createdUser: unknown;
    await act(async () => {
      createdUser = await result.current.createUser({
        email: 'dup@example.com',
        username: 'dup',
        password: '123456',
      });
    });

    expect(createdUser).toBeNull();
    expect(result.current.error).toBe('El email ya está registrado');
  });
});
