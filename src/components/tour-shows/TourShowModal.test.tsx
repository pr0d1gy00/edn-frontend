import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TourShowModal from './TourShowModal';
import type { TourShow } from '@/types/tourShow';

const mockUseTourShowById = vi.fn();

vi.mock('@/hooks/useTourShowById', () => ({
  useTourShowById: (id: string) => mockUseTourShowById(id),
}));

const baseShow: TourShow = {
  id: 'show-1',
  city: 'Buenos Aires',
  country: 'Argentina',
  venueName: 'Estadio Monumental',
  showDate: '2025-08-15T20:00:00Z',
  ticketUrl: 'https://tickets.example.com',
  ticketStatus: 'AVAILABLE',
  latitude: -34.545,
  longitude: -58.449,
  images: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'],
  createdAt: '2025-01-15T10:00:00Z',
  updatedAt: '2025-06-01T15:30:00Z',
};

const soldOutShow: TourShow = {
  ...baseShow,
  ticketStatus: 'SOLD_OUT',
};

describe('TourShowModal', () => {
  beforeEach(() => {
    mockUseTourShowById.mockReset();
  });

  it('returns null when isOpen is false', () => {
    mockUseTourShowById.mockReturnValue({ tourShow: null, loading: true, error: null });
    const { container } = render(
      <TourShowModal showId="show-1" isOpen={false} onClose={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders loading skeleton when loading', () => {
    mockUseTourShowById.mockReturnValue({ tourShow: null, loading: true, error: null });
    render(<TourShowModal showId="show-1" isOpen={true} onClose={vi.fn()} />);

    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders error message when fetch fails', () => {
    mockUseTourShowById.mockReturnValue({ tourShow: null, loading: false, error: 'Error al cargar fecha de tour' });
    render(<TourShowModal showId="show-1" isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('Error al cargar fecha de tour')).toBeInTheDocument();
  });

  it('renders show details when data is loaded', async () => {
    mockUseTourShowById.mockReturnValue({ tourShow: baseShow, loading: false, error: null });
    render(<TourShowModal showId="show-1" isOpen={true} onClose={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('Buenos Aires')).toBeInTheDocument();
    });

    expect(screen.getByText('Argentina')).toBeInTheDocument();
    expect(screen.getByText('Estadio Monumental')).toBeInTheDocument();
  });

  it('renders ticket status badge', async () => {
    mockUseTourShowById.mockReturnValue({ tourShow: baseShow, loading: false, error: null });
    render(<TourShowModal showId="show-1" isOpen={true} onClose={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('DISPONIBLE')).toBeInTheDocument();
    });
  });

  it('renders images as thumbnails when show has images', async () => {
    mockUseTourShowById.mockReturnValue({ tourShow: baseShow, loading: false, error: null });
    render(<TourShowModal showId="show-1" isOpen={true} onClose={vi.fn()} />);

    await waitFor(() => {
      const images = screen.getAllByRole('img');
      // Should have at least the thumbnail images
      expect(images.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('shows city initial fallback when no images', async () => {
    const showNoImages = { ...baseShow, images: [] };
    mockUseTourShowById.mockReturnValue({ tourShow: showNoImages, loading: false, error: null });
    render(<TourShowModal showId="show-1" isOpen={true} onClose={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('B')).toBeInTheDocument();
    });
  });

  it('shows COMPRAR ENTRADAS button when tickets available and ticketUrl exists', async () => {
    mockUseTourShowById.mockReturnValue({ tourShow: baseShow, loading: false, error: null });
    render(<TourShowModal showId="show-1" isOpen={true} onClose={vi.fn()} />);

    await waitFor(() => {
      const buyButton = screen.getByText(/COMPRAR ENTRADAS/i);
      expect(buyButton).toBeInTheDocument();
      expect(buyButton.closest('a')).toHaveAttribute('href', 'https://tickets.example.com');
    });
  });

  it('does not show COMPRAR button for SOLD_OUT shows', async () => {
    mockUseTourShowById.mockReturnValue({ tourShow: soldOutShow, loading: false, error: null });
    render(<TourShowModal showId="show-1" isOpen={true} onClose={vi.fn()} />);

    await waitFor(() => {
      expect(screen.queryByText(/COMPRAR ENTRADAS/i)).not.toBeInTheDocument();
    });
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    mockUseTourShowById.mockReturnValue({ tourShow: baseShow, loading: false, error: null });
    render(<TourShowModal showId="show-1" isOpen={true} onClose={onClose} />);

    await waitFor(() => {
      expect(screen.getByText('Buenos Aires')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('✕'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', async () => {
    const onClose = vi.fn();
    mockUseTourShowById.mockReturnValue({ tourShow: baseShow, loading: false, error: null });
    const { container } = render(
      <TourShowModal showId="show-1" isOpen={true} onClose={onClose} />
    );

    await waitFor(() => {
      expect(screen.getByText('Buenos Aires')).toBeInTheDocument();
    });

    const backdrop = container.firstChild as HTMLElement;
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
