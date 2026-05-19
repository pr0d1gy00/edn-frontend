import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCreateTourShow } from '@/hooks/useCreateTourShow';

const mockCreateTourShow = vi.fn();

vi.mock('@/services/tourShowsApi', () => ({
  tourShowsApi: {
    createTourShow: (formData: FormData) => mockCreateTourShow(formData),
  },
}));

describe('useCreateTourShow', () => {
  beforeEach(() => {
    mockCreateTourShow.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns a createTourShow function with initial idle state', () => {
    const { result } = renderHook(() => useCreateTourShow());

    expect(typeof result.current.createTourShow).toBe('function');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('calls tourShowsApi.createTourShow with FormData', async () => {
    const mockResponse = {
      id: 'new-1',
      city: 'Bogota',
      country: 'Colombia',
      venueName: 'Estadio',
      showDate: '2026-06-01T00:00:00Z',
      ticketUrl: 'http://t.com',
      ticketStatus: 'AVAILABLE' as const,
      images: [],
    };
    mockCreateTourShow.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useCreateTourShow());
    const formData = new FormData();
    formData.append('city', 'Bogota');
    formData.append('country', 'Colombia');

    let created: unknown;
    await act(async () => {
      created = await result.current.createTourShow(formData);
    });

    expect(mockCreateTourShow).toHaveBeenCalledWith(formData);
  });

  it('returns the created show on success', async () => {
    const mockResponse = {
      id: 'new-2',
      city: 'Lima',
      country: 'Peru',
      venueName: 'Nacional',
      showDate: '2026-07-01T00:00:00Z',
      ticketUrl: 'http://t2.com',
      ticketStatus: 'FEW_TICKETS' as const,
      images: ['https://cdn.example.com/img1.jpg'],
    };
    mockCreateTourShow.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useCreateTourShow());
    const formData = new FormData();

    let created: unknown;
    await act(async () => {
      created = await result.current.createTourShow(formData);
    });

    expect(created).toEqual(mockResponse);
  });

  it('sets error state when API throws', async () => {
    mockCreateTourShow.mockRejectedValue(new Error('Error al crear fecha de tour'));

    const { result } = renderHook(() => useCreateTourShow());
    const formData = new FormData();

    await act(async () => {
      await result.current.createTourShow(formData);
    });

    expect(result.current.error).toBe('Error al crear fecha de tour');
  });

  it('returns null on API error with custom message', async () => {
    mockCreateTourShow.mockRejectedValue(new Error('City is required'));

    const { result } = renderHook(() => useCreateTourShow());
    const formData = new FormData();

    let created: unknown;
    await act(async () => {
      created = await result.current.createTourShow(formData);
    });

    expect(created).toBeNull();
    expect(result.current.error).toBe('City is required');
  });

  it('sets default error message on non-Error throw', async () => {
    mockCreateTourShow.mockRejectedValue('Network failure');

    const { result } = renderHook(() => useCreateTourShow());
    const formData = new FormData();

    await act(async () => {
      await result.current.createTourShow(formData);
    });

    expect(result.current.error).toBe('Error al crear show');
  });

  it('sets loading to true during request and false after', async () => {
    mockCreateTourShow.mockResolvedValue({
      id: '1', city: 'X', country: 'Y', venueName: 'Z',
      showDate: '2026-01-01', ticketUrl: 'http://x.com',
      ticketStatus: 'AVAILABLE' as const, images: [],
    });

    const { result } = renderHook(() => useCreateTourShow());
    const formData = new FormData();

    let promise: Promise<unknown>;
    await act(async () => {
      promise = result.current.createTourShow(formData);
    });

    await act(async () => {
      await promise;
    });

    expect(result.current.loading).toBe(false);
  });
});
