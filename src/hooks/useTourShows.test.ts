import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useTourShows } from '@/hooks/useTourShows';

const mockGetTourShows = vi.fn();

vi.mock('@/services/tourShowsApi', () => ({
  tourShowsApi: {
    getTourShows: (...args: unknown[]) => mockGetTourShows(...args),
  },
}));

describe('useTourShows', () => {
  beforeEach(() => {
    mockGetTourShows.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns loading true and empty tourShows initially', () => {
    mockGetTourShows.mockResolvedValue({
      data: [],
      meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
    });

    const { result } = renderHook(() => useTourShows());

    expect(result.current.loading).toBe(true);
    expect(result.current.tourShows).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('fetches from tourShowsApi.getTourShows and returns data after loading', async () => {
    const mockShows = [
      { id: '1', city: 'Buenos Aires', country: 'Argentina', venueName: 'Estadio', showDate: '2026-06-15T00:00:00Z', ticketUrl: 'http://t.com', ticketStatus: 'AVAILABLE' as const, images: [] },
      { id: '2', city: 'Santiago', country: 'Chile', venueName: 'Nacional', showDate: '2026-07-01T00:00:00Z', ticketUrl: 'http://t2.com', ticketStatus: 'SOLD_OUT' as const, images: [] },
    ];
    mockGetTourShows.mockResolvedValue({
      data: mockShows,
      meta: { page: 1, limit: 10, total: 2, totalPages: 1 },
    });

    const { result } = renderHook(() => useTourShows());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.tourShows).toEqual(mockShows);
    expect(result.current.error).toBeNull();
    expect(result.current.meta).toEqual({ page: 1, limit: 10, total: 2, totalPages: 1 });
  });

  it('passes page, limit, ticketStatus, upcoming, and search params to API', async () => {
    mockGetTourShows.mockResolvedValue({
      data: [],
      meta: { page: 2, limit: 5, total: 0, totalPages: 0 },
    });

    renderHook(() =>
      useTourShows({
        page: 2,
        limit: 5,
        ticketStatus: 'SOLD_OUT',
        upcoming: true,
        search: 'Buenos Aires',
      }),
    );

    await waitFor(() => {
      expect(mockGetTourShows).toHaveBeenCalledWith(2, 5, 'SOLD_OUT', true, 'Buenos Aires');
    });
  });

  it('passes only page and limit when no filters set', async () => {
    mockGetTourShows.mockResolvedValue({
      data: [],
      meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
    });

    renderHook(() => useTourShows());

    await waitFor(() => {
      expect(mockGetTourShows).toHaveBeenCalledWith(1, 10, undefined, undefined, "");
    });
  });

  it('returns error state when API throws', async () => {
    mockGetTourShows.mockRejectedValue(new Error('Error al cargar fechas de tour'));

    const { result } = renderHook(() => useTourShows());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.tourShows).toEqual([]);
    expect(result.current.error).toBe('Error al cargar fechas de tour');
  });

  it('sets default error message when non-Error is thrown', async () => {
    mockGetTourShows.mockRejectedValue('Network error');

    const { result } = renderHook(() => useTourShows());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Error al cargar shows');
  });

  it('handles empty show list from API', async () => {
    mockGetTourShows.mockResolvedValue({
      data: [],
      meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
    });

    const { result } = renderHook(() => useTourShows());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.tourShows).toEqual([]);
    expect(result.current.error).toBeNull();
  });
});
