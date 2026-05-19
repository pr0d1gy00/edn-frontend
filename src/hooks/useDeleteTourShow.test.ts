import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDeleteTourShow } from '@/hooks/useDeleteTourShow';

const mockDeleteTourShow = vi.fn();

vi.mock('@/services/tourShowsApi', () => ({
  tourShowsApi: {
    deleteTourShow: (id: string) => mockDeleteTourShow(id),
  },
}));

describe('useDeleteTourShow', () => {
  beforeEach(() => {
    mockDeleteTourShow.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns a deleteTourShow function with initial idle state', () => {
    const { result } = renderHook(() => useDeleteTourShow());

    expect(typeof result.current.deleteTourShow).toBe('function');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('calls tourShowsApi.deleteTourShow with correct id', async () => {
    mockDeleteTourShow.mockResolvedValue({ data: { success: true } });

    const { result } = renderHook(() => useDeleteTourShow());

    await act(async () => {
      await result.current.deleteTourShow('show-1');
    });

    expect(mockDeleteTourShow).toHaveBeenCalledWith('show-1');
  });

  it('returns true on successful deletion', async () => {
    mockDeleteTourShow.mockResolvedValue({ data: { success: true } });

    const { result } = renderHook(() => useDeleteTourShow());

    let deleted: unknown;
    await act(async () => {
      deleted = await result.current.deleteTourShow('show-1');
    });

    expect(deleted).toBe(true);
  });

  it('sets error state when API throws', async () => {
    mockDeleteTourShow.mockRejectedValue(new Error('Error al eliminar fecha de tour'));

    const { result } = renderHook(() => useDeleteTourShow());

    await act(async () => {
      await result.current.deleteTourShow('show-1');
    });

    expect(result.current.error).toBe('Error al eliminar fecha de tour');
  });

  it('returns false on API error', async () => {
    mockDeleteTourShow.mockRejectedValue(new Error('Network failure'));

    const { result } = renderHook(() => useDeleteTourShow());

    let deleted: unknown;
    await act(async () => {
      deleted = await result.current.deleteTourShow('show-1');
    });

    expect(deleted).toBe(false);
  });

  it('returns false on non-Error throw and sets default message', async () => {
    mockDeleteTourShow.mockRejectedValue('Unknown error');

    const { result } = renderHook(() => useDeleteTourShow());

    let deleted: unknown;
    await act(async () => {
      deleted = await result.current.deleteTourShow('show-1');
    });

    expect(deleted).toBe(false);
    expect(result.current.error).toBe('Error al eliminar show');
  });
});
