import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { tourShowsApi } from '@/services/tourShowsApi';

// Mock js-cookie
vi.mock('js-cookie', () => ({
  default: {
    get: vi.fn(() => 'fake-token'),
  },
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('tourShowsApi', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ── getTourShows ──────────────────────────────────────────────
  describe('getTourShows', () => {
    it('calls GET /tour-shows with default page and limit', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ data: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } }), { status: 200 }),
      );

      await tourShowsApi.getTourShows();

      const [url, options] = mockFetch.mock.calls[0];
      expect(options.method).toBe('GET');
      expect(url).toContain('/tour-shows?page=1&limit=10');
      expect(url).not.toContain('ticketStatus');
      expect(url).not.toContain('upcoming');
    });

    it('passes ticketStatus and upcoming filters when provided', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ data: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } }), { status: 200 }),
      );

      await tourShowsApi.getTourShows(1, 10, 'SOLD_OUT', true);

      const [url] = mockFetch.mock.calls[0];
      expect(url).toContain('ticketStatus=SOLD_OUT');
      expect(url).toContain('upcoming=true');
    });

    it('passes search parameter when provided', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ data: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } }), { status: 200 }),
      );

      await tourShowsApi.getTourShows(1, 10, undefined, undefined, 'Buenos Aires');

      const [url] = mockFetch.mock.calls[0];
      expect(url).toContain('search=Buenos+Aires');
    });

    it('returns paginated data on success', async () => {
      const mockShows = [
        { id: '1', city: 'Buenos Aires', country: 'Argentina', venueName: 'Estadio', showDate: '2026-06-15T00:00:00Z', ticketUrl: 'http://x.com', ticketStatus: 'AVAILABLE', images: [] },
      ];
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ data: mockShows, meta: { page: 1, limit: 10, total: 1, totalPages: 1 } }), { status: 200 }),
      );

      const result = await tourShowsApi.getTourShows();

      expect(result.data).toEqual(mockShows);
      expect(result.meta.total).toBe(1);
    });

    it('throws on non-ok response', async () => {
      mockFetch.mockResolvedValueOnce(new Response(null, { status: 500 }));

      await expect(tourShowsApi.getTourShows()).rejects.toThrow('Error al cargar fechas de tour');
    });
  });

  // ── getTourShowById ───────────────────────────────────────────
  describe('getTourShowById', () => {
    it('calls GET /tour-shows/:id', async () => {
      const mockShow = { id: 'abc', city: 'Santiago', country: 'Chile', venueName: 'X', showDate: '2026-01-01', ticketUrl: 'http://x.com', ticketStatus: 'AVAILABLE', images: [] };
      mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(mockShow), { status: 200 }));

      await tourShowsApi.getTourShowById('abc');

      const [url, options] = mockFetch.mock.calls[0];
      expect(options.method).toBe('GET');
      expect(url).toContain('/tour-shows/abc');
    });

    it('returns the show on success', async () => {
      const mockShow = { id: 'xyz', city: 'Lima', country: 'Peru', venueName: 'V', showDate: '2026-02-01', ticketUrl: 'http://t.com', ticketStatus: 'FEW_TICKETS', images: [] };
      mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(mockShow), { status: 200 }));

      const result = await tourShowsApi.getTourShowById('xyz');
      expect(result.city).toBe('Lima');
    });

    it('throws on non-ok response', async () => {
      mockFetch.mockResolvedValueOnce(new Response(null, { status: 404 }));

      await expect(tourShowsApi.getTourShowById('bad-id')).rejects.toThrow('Error al cargar fecha de tour');
    });
  });

  // ── createTourShow ────────────────────────────────────────────
  describe('createTourShow', () => {
    it('sends POST with FormData and no Content-Type header', async () => {
      const mockShow = { id: 'new-1', city: 'Bogota', country: 'Colombia', venueName: 'X', showDate: '2026-03-01', ticketUrl: 'http://x.com', ticketStatus: 'AVAILABLE', images: [] };
      mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(mockShow), { status: 201 }));

      const formData = new FormData();
      formData.append('city', 'Bogota');
      formData.append('country', 'Colombia');

      await tourShowsApi.createTourShow(formData);

      const [_url, options] = mockFetch.mock.calls[0];
      expect(options.method).toBe('POST');
      expect(options.body).toBe(formData);
      expect(options.headers).not.toHaveProperty('Content-Type');
    });

    it('returns created show on success', async () => {
      const mockShow = { id: 'new-2', city: 'Quito', country: 'Ecuador', venueName: 'A', showDate: '2026-04-01', ticketUrl: 'http://u.com', ticketStatus: 'AVAILABLE', images: [] };
      mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(mockShow), { status: 201 }));

      const formData = new FormData();
      const result = await tourShowsApi.createTourShow(formData);
      expect(result.city).toBe('Quito');
    });

    it('throws on non-ok response with server message', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ message: 'City is required' }), { status: 400 }),
      );

      const formData = new FormData();
      await expect(tourShowsApi.createTourShow(formData)).rejects.toThrow('City is required');
    });
  });

  // ── updateTourShow ────────────────────────────────────────────
  describe('updateTourShow', () => {
    it('sends PATCH with FormData and no Content-Type header', async () => {
      const mockShow = { id: 'edit-1', city: 'Updated', country: 'Brazil', venueName: 'X', showDate: '2026-05-01', ticketUrl: 'http://x.com', ticketStatus: 'AVAILABLE', images: [] };
      mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(mockShow), { status: 200 }));

      const formData = new FormData();
      formData.append('city', 'Updated');

      await tourShowsApi.updateTourShow('edit-1', formData);

      const [url, options] = mockFetch.mock.calls[0];
      expect(options.method).toBe('PATCH');
      expect(url).toContain('/tour-shows/edit-1');
      expect(options.body).toBe(formData);
      expect(options.headers).not.toHaveProperty('Content-Type');
    });

    it('returns updated show on success', async () => {
      const mockShow = { id: 'edit-2', city: 'Recife', country: 'Brazil', venueName: 'Z', showDate: '2026-06-01', ticketUrl: 'http://z.com', ticketStatus: 'SOLD_OUT', images: [] };
      mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(mockShow), { status: 200 }));

      const formData = new FormData();
      const result = await tourShowsApi.updateTourShow('edit-2', formData);
      expect(result.ticketStatus).toBe('SOLD_OUT');
    });

    it('throws on non-ok response', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ message: 'Not found' }), { status: 404 }),
      );

      const formData = new FormData();
      await expect(tourShowsApi.updateTourShow('bad-id', formData)).rejects.toThrow('Not found');
    });
  });

  // ── deleteTourShow ────────────────────────────────────────────
  describe('deleteTourShow', () => {
    it('sends DELETE /tour-shows/:id', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ data: { success: true } }), { status: 200 }),
      );

      await tourShowsApi.deleteTourShow('delete-1');

      const [url, options] = mockFetch.mock.calls[0];
      expect(options.method).toBe('DELETE');
      expect(url).toContain('/tour-shows/delete-1');
    });

    it('resolves on successful deletion', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ data: { success: true } }), { status: 200 }),
      );

      await expect(tourShowsApi.deleteTourShow('delete-2')).resolves.toBeDefined();
    });

    it('throws on non-ok response', async () => {
      mockFetch.mockResolvedValueOnce(new Response(null, { status: 500 }));

      await expect(tourShowsApi.deleteTourShow('delete-3')).rejects.toThrow('Error al eliminar fecha de tour');
    });
  });
});
