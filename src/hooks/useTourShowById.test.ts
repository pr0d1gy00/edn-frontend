import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useTourShowById } from '@/hooks/useTourShowById';

const mockGetTourShowById = vi.fn();

vi.mock('@/services/tourShowsApi', () => ({
  tourShowsApi: {
    getTourShowById: (id: string) => mockGetTourShowById(id),
  },
}));

describe('useTourShowById', () => {
  beforeEach(() => {
    mockGetTourShowById.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns loading true and null tourShow initially', () => {
    mockGetTourShowById.mockResolvedValue(null);

    const { result } = renderHook(() => useTourShowById('show-1'));

    expect(result.current.loading).toBe(true);
    expect(result.current.tourShow).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('fetches show and returns data after loading', async () => {
    const mockShow = {
      id: 'show-1',
      city: 'Buenos Aires',
      country: 'Argentina',
      venueName: 'Estadio Monumental',
      showDate: '2026-06-15T20:00:00Z',
      ticketUrl: 'https://tickets.example.com',
      ticketStatus: 'AVAILABLE' as const,
      images: [{ id: 'img-1', url: 'https://cdn.example.com/img1.jpg', isPrimary: true, sortOrder: 0 }],
    };
    mockGetTourShowById.mockResolvedValue(mockShow);

    const { result } = renderHook(() => useTourShowById('show-1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.tourShow).toEqual(mockShow);
    expect(result.current.error).toBeNull();
  });

  it('passes id to API', async () => {
    const mockShow = { id: 'abc', city: 'X', country: 'Y', venueName: 'Z', showDate: '2026-01-01', ticketUrl: 'http://x.com', ticketStatus: 'AVAILABLE' as const, images: [] };
    mockGetTourShowById.mockResolvedValue(mockShow);

    renderHook(() => useTourShowById('abc'));

    await waitFor(() => {
      expect(mockGetTourShowById).toHaveBeenCalledWith('abc');
    });
  });

  it('returns error state when API throws', async () => {
    mockGetTourShowById.mockRejectedValue(new Error('Error al cargar fecha de tour'));

    const { result } = renderHook(() => useTourShowById('bad-id'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.tourShow).toBeNull();
    expect(result.current.error).toBe('Error al cargar fecha de tour');
  });

  it('sets default error message when non-Error is thrown', async () => {
    mockGetTourShowById.mockRejectedValue('Boom');

    const { result } = renderHook(() => useTourShowById('x'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Error al cargar show');
  });

  it('refetches when id changes', async () => {
    const show1 = { id: '1', city: 'A', country: 'B', venueName: 'C', showDate: '2026-01-01', ticketUrl: 'http://x.com', ticketStatus: 'AVAILABLE' as const, images: [] };
    const show2 = { id: '2', city: 'D', country: 'E', venueName: 'F', showDate: '2026-02-01', ticketUrl: 'http://y.com', ticketStatus: 'SOLD_OUT' as const, images: [] };

    mockGetTourShowById.mockResolvedValueOnce(show1);
    const { result, rerender } = renderHook(
      ({ id }: { id: string }) => useTourShowById(id),
      { initialProps: { id: '1' } },
    );

    await waitFor(() => {
      expect(result.current.tourShow).toEqual(show1);
    });

    mockGetTourShowById.mockResolvedValueOnce(show2);
    rerender({ id: '2' });

    await waitFor(() => {
      expect(result.current.tourShow).toEqual(show2);
    });

    expect(mockGetTourShowById).toHaveBeenCalledTimes(2);
  });
});
