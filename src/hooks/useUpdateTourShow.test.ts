import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUpdateTourShow } from '@/hooks/useUpdateTourShow';

const mockUpdateTourShow = vi.fn();

vi.mock('@/services/tourShowsApi', () => ({
  tourShowsApi: {
    updateTourShow: (id: string, formData: FormData) => mockUpdateTourShow(id, formData),
  },
}));

describe('useUpdateTourShow', () => {
  beforeEach(() => {
    mockUpdateTourShow.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns an updateTourShow function with initial idle state', () => {
    const { result } = renderHook(() => useUpdateTourShow());

    expect(typeof result.current.updateTourShow).toBe('function');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('calls tourShowsApi.updateTourShow with id and FormData', async () => {
    const mockResponse = {
      id: 'show-1',
      city: 'Updated City',
      country: 'Argentina',
      venueName: 'Estadio',
      showDate: '2026-06-15T00:00:00Z',
      ticketUrl: 'http://t.com',
      ticketStatus: 'AVAILABLE' as const,
      images: [],
    };
    mockUpdateTourShow.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useUpdateTourShow());
    const formData = new FormData();
    formData.append('city', 'Updated City');

    await act(async () => {
      await result.current.updateTourShow('show-1', formData);
    });

    expect(mockUpdateTourShow).toHaveBeenCalledWith('show-1', formData);
  });

  it('returns the updated show on success', async () => {
    const mockResponse = {
      id: 'show-1',
      city: 'Montevideo',
      country: 'Uruguay',
      venueName: 'Centenario',
      showDate: '2026-08-01T00:00:00Z',
      ticketUrl: 'http://u.com',
      ticketStatus: 'SOLD_OUT' as const,
      images: [],
    };
    mockUpdateTourShow.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useUpdateTourShow());
    const formData = new FormData();

    let updated: unknown;
    await act(async () => {
      updated = await result.current.updateTourShow('show-1', formData);
    });

    expect(updated).toEqual(mockResponse);
  });

  it('sets error state when API throws', async () => {
    mockUpdateTourShow.mockRejectedValue(new Error('Error al actualizar fecha de tour'));

    const { result } = renderHook(() => useUpdateTourShow());
    const formData = new FormData();

    await act(async () => {
      await result.current.updateTourShow('show-1', formData);
    });

    expect(result.current.error).toBe('Error al actualizar fecha de tour');
  });

  it('returns null on API error with custom message', async () => {
    mockUpdateTourShow.mockRejectedValue(new Error('Show not found'));

    const { result } = renderHook(() => useUpdateTourShow());
    const formData = new FormData();

    let updated: unknown;
    await act(async () => {
      updated = await result.current.updateTourShow('bad-id', formData);
    });

    expect(updated).toBeNull();
    expect(result.current.error).toBe('Show not found');
  });

  it('sets default error on non-Error throw', async () => {
    mockUpdateTourShow.mockRejectedValue('Unexpected error');

    const { result } = renderHook(() => useUpdateTourShow());
    const formData = new FormData();

    await act(async () => {
      await result.current.updateTourShow('x', formData);
    });

    expect(result.current.error).toBe('Error al actualizar show');
  });
});
