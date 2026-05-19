import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import EditTourShowPage from './page';

const mockPush = vi.fn();
const mockUseTourShowById = vi.fn();
const mockDeleteTourShow = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useParams: () => ({ id: 'show-1' }),
}));

vi.mock('@/hooks/useTourShowById', () => ({
  useTourShowById: (id: string) => mockUseTourShowById(id),
}));

vi.mock('@/hooks/useUpdateTourShow', () => ({
  useUpdateTourShow: () => ({
    updateTourShow: vi.fn(),
    loading: false,
    error: null,
  }),
}));

vi.mock('@/hooks/useDeleteTourShow', () => ({
  useDeleteTourShow: () => ({
    deleteTourShow: mockDeleteTourShow,
    loading: false,
    error: null,
  }),
}));

const mockTourShow = {
  id: 'show-1',
  city: 'Buenos Aires',
  country: 'Argentina',
  venueName: 'Estadio Monumental',
  showDate: '2025-08-15T20:00:00Z',
  ticketUrl: 'https://tickets.com/1',
  ticketStatus: 'AVAILABLE' as const,
  images: [],
};

describe('EditTourShowPage', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockDeleteTourShow.mockClear();
    mockUseTourShowById.mockReset();
  });

  it('renders loading spinner while fetching tour show', () => {
    mockUseTourShowById.mockReturnValue({ tourShow: null, loading: true, error: null });
    render(<EditTourShowPage />);

    const spinners = document.querySelectorAll('.animate-spin');
    expect(spinners.length).toBeGreaterThan(0);
  });

  it('renders error message when tour show fetch fails', () => {
    mockUseTourShowById.mockReturnValue({ tourShow: null, loading: false, error: 'Error al cargar show' });
    render(<EditTourShowPage />);

    expect(screen.getByText('Error al cargar show')).toBeInTheDocument();
  });

  it('renders "Fecha no encontrada" when tour show is null without error', () => {
    mockUseTourShowById.mockReturnValue({ tourShow: null, loading: false, error: null });
    render(<EditTourShowPage />);

    expect(screen.getByText('Fecha no encontrada')).toBeInTheDocument();
  });

  it('renders "Volver" button', () => {
    mockUseTourShowById.mockReturnValue({ tourShow: mockTourShow, loading: false, error: null });
    render(<EditTourShowPage />);

    expect(screen.getByText('Volver')).toBeInTheDocument();
  });

  it('renders page title "Editar Show"', () => {
    mockUseTourShowById.mockReturnValue({ tourShow: mockTourShow, loading: false, error: null });
    render(<EditTourShowPage />);

    expect(screen.getByText('Editar Show')).toBeInTheDocument();
  });

  it('renders TourShowForm in edit mode with pre-filled city data', () => {
    mockUseTourShowById.mockReturnValue({ tourShow: mockTourShow, loading: false, error: null });
    render(<EditTourShowPage />);

    expect(screen.getByLabelText(/Ciudad/)).toHaveValue('Buenos Aires');
    expect(screen.getByLabelText(/País/)).toHaveValue('Argentina');
    expect(screen.getByLabelText(/Lugar/)).toHaveValue('Estadio Monumental');
  });

  it('renders delete button with Spanish label', () => {
    mockUseTourShowById.mockReturnValue({ tourShow: mockTourShow, loading: false, error: null });
    render(<EditTourShowPage />);

    expect(screen.getByRole('button', { name: /Eliminar show/i })).toBeInTheDocument();
  });

  it('does not show delete button when tour show is still loading', () => {
    mockUseTourShowById.mockReturnValue({ tourShow: null, loading: true, error: null });
    render(<EditTourShowPage />);

    expect(screen.queryByRole('button', { name: /Eliminar show/i })).not.toBeInTheDocument();
  });
});
