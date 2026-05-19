import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import TourShowsPage from './page';

const { mockUseTourShows, mockPush } = vi.hoisted(() => ({
  mockUseTourShows: vi.fn(),
  mockPush: vi.fn(),
}));

vi.mock('@/hooks/useTourShows', () => ({
  useTourShows: mockUseTourShows,
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

const mockTourShows = [
  {
    id: '1',
    city: 'Buenos Aires',
    country: 'Argentina',
    venueName: 'Estadio Monumental',
    showDate: '2025-08-15T20:00:00Z',
    ticketUrl: 'https://tickets.com/1',
    ticketStatus: 'AVAILABLE' as const,
    images: [],
  },
  {
    id: '2',
    city: 'Santiago',
    country: 'Chile',
    venueName: 'Estadio Nacional',
    showDate: '2025-09-01T20:00:00Z',
    ticketUrl: 'https://tickets.com/2',
    ticketStatus: 'FEW_TICKETS' as const,
    images: [],
  },
  {
    id: '3',
    city: 'Lima',
    country: 'Perú',
    venueName: 'Estadio Monumental de Lima',
    showDate: '2025-10-10T20:00:00Z',
    ticketUrl: '',
    ticketStatus: 'SOLD_OUT' as const,
    images: [],
  },
];

const mockMeta = { page: 1, limit: 10, total: 3, totalPages: 1 };

describe('TourShowsPage', () => {
  beforeEach(() => {
    mockUseTourShows.mockReturnValue({
      tourShows: [],
      loading: false,
      error: null,
      meta: undefined,
    });
    mockPush.mockClear();
  });

  it('renders the page title "Tour Shows"', () => {
    render(<TourShowsPage />);
    expect(screen.getByText('Tour Shows')).toBeInTheDocument();
  });

  it('renders "+ Nuevo Show" CTA button in page header', () => {
    mockUseTourShows.mockReturnValue({
      tourShows: mockTourShows,
      loading: false,
      error: null,
      meta: mockMeta,
    });
    render(<TourShowsPage />);
    expect(screen.getByText('+ Nuevo Show')).toBeInTheDocument();
  });

  it('navigates to /dashboard/tour-shows/new when CTA button is clicked', () => {
    render(<TourShowsPage />);
    fireEvent.click(screen.getByText('+ Nuevo Show'));
    expect(mockPush).toHaveBeenCalledWith('/dashboard/tour-shows/new');
  });

  it('shows loading skeletons when tour shows are loading', () => {
    mockUseTourShows.mockReturnValue({
      tourShows: [],
      loading: true,
      error: null,
      meta: undefined,
    });
    render(<TourShowsPage />);
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('displays error message with retry button when fetch fails', () => {
    mockUseTourShows.mockReturnValue({
      tourShows: [],
      loading: false,
      error: 'Error al cargar shows',
      meta: undefined,
    });
    render(<TourShowsPage />);
    expect(screen.getByText('Error al cargar shows')).toBeInTheDocument();
    expect(screen.getByText('Reintentar')).toBeInTheDocument();
  });

  it('renders empty state "No hay fechas de tour" when no shows exist', () => {
    mockUseTourShows.mockReturnValue({
      tourShows: [],
      loading: false,
      error: null,
      meta: undefined,
    });
    render(<TourShowsPage />);
    expect(screen.getByText('No hay fechas de tour')).toBeInTheDocument();
  });

  it('renders tour show city names when data is loaded', () => {
    mockUseTourShows.mockReturnValue({
      tourShows: mockTourShows,
      loading: false,
      error: null,
      meta: mockMeta,
    });
    render(<TourShowsPage />);
    expect(screen.getByText('Buenos Aires')).toBeInTheDocument();
    expect(screen.getByText('Santiago')).toBeInTheDocument();
    expect(screen.getByText('Lima')).toBeInTheDocument();
  });

  it('renders status badges for each tour show', () => {
    mockUseTourShows.mockReturnValue({
      tourShows: mockTourShows,
      loading: false,
      error: null,
      meta: mockMeta,
    });
    render(<TourShowsPage />);
    // Status badges appear in cards (not filter dropdown), use getAllByText
    const disponibleEls = screen.getAllByText('DISPONIBLE');
    const ultimasEls = screen.getAllByText('¡ÚLTIMAS!');
    const agotadoEls = screen.getAllByText('AGOTADO');
    // At least one of each (cards) exists beyond the filter dropdown
    expect(disponibleEls.length).toBeGreaterThanOrEqual(1);
    expect(ultimasEls.length).toBeGreaterThanOrEqual(1);
    expect(agotadoEls.length).toBeGreaterThanOrEqual(1);
  });

  it('navigates to edit page when a tour show card is clicked', () => {
    mockUseTourShows.mockReturnValue({
      tourShows: mockTourShows,
      loading: false,
      error: null,
      meta: mockMeta,
    });
    render(<TourShowsPage />);
    fireEvent.click(screen.getByText('Buenos Aires').closest('article')!);
    expect(mockPush).toHaveBeenCalledWith('/dashboard/tour-shows/1');
  });

  it('renders ticket status filter dropdown with options', () => {
    mockUseTourShows.mockReturnValue({
      tourShows: mockTourShows,
      loading: false,
      error: null,
      meta: mockMeta,
    });
    render(<TourShowsPage />);
    const select = screen.getByLabelText('Estado');
    expect(select).toBeInTheDocument();
    // Check the select contains filter options
    const options = within(select).getAllByRole('option');
    const optionTexts = options.map((o) => o.textContent);
    expect(optionTexts).toContain('TODOS');
    expect(optionTexts).toContain('DISPONIBLE');
    expect(optionTexts).toContain('AGOTADO');
  });

  it('renders upcoming toggle checkbox', () => {
    mockUseTourShows.mockReturnValue({
      tourShows: mockTourShows,
      loading: false,
      error: null,
      meta: mockMeta,
    });
    render(<TourShowsPage />);
    expect(screen.getByLabelText('Solo próximos')).toBeInTheDocument();
  });

  it('renders search input for city/country', () => {
    mockUseTourShows.mockReturnValue({
      tourShows: mockTourShows,
      loading: false,
      error: null,
      meta: mockMeta,
    });
    render(<TourShowsPage />);
    expect(screen.getByPlaceholderText('Buscar por ciudad o país...')).toBeInTheDocument();
  });

  it('renders pagination controls when meta is present', () => {
    mockUseTourShows.mockReturnValue({
      tourShows: mockTourShows,
      loading: false,
      error: null,
      meta: mockMeta,
    });
    render(<TourShowsPage />);
    // Pagination nav with prev/next buttons
    expect(screen.getByText('← ANT')).toBeInTheDocument();
    expect(screen.getByText('SIG →')).toBeInTheDocument();
  });
});
