import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TourShowModal from './TourShowModal';
import type { TourShow } from '@/types/tourShow';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockDeleteTourShow = vi.fn();
vi.mock('@/services/tourShowsApi', () => ({
  tourShowsApi: {
    deleteTourShow: (id: string) => mockDeleteTourShow(id),
  },
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
  images: [
    { id: 'img-1', url: 'https://example.com/img1.jpg', isPrimary: true, sortOrder: 0 },
    { id: 'img-2', url: 'https://example.com/img2.jpg', isPrimary: false, sortOrder: 1 },
  ],
  createdAt: '2025-01-15T10:00:00Z',
  updatedAt: '2025-06-01T15:30:00Z',
};

const soldOutShow: TourShow = {
  ...baseShow,
  ticketStatus: 'SOLD_OUT',
};

describe('TourShowModal', () => {
  beforeEach(() => {
    mockPush.mockReset();
    mockDeleteTourShow.mockReset();
  });

  it('returns null when show is null', () => {
    const { container } = render(
      <TourShowModal show={null} onClose={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders show details when data is loaded', async () => {
    render(<TourShowModal show={baseShow} onClose={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('Buenos Aires')).toBeInTheDocument();
    });

    expect(screen.getByText('Argentina')).toBeInTheDocument();
    expect(screen.getByText('Estadio Monumental')).toBeInTheDocument();
  });

  it('renders ticket status badge', async () => {
    render(<TourShowModal show={baseShow} onClose={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('DISPONIBLE')).toBeInTheDocument();
    });
  });

  it('renders image carousel when show has images', async () => {
    render(<TourShowModal show={baseShow} onClose={vi.fn()} />);

    await waitFor(() => {
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThanOrEqual(1);
      // Should show image counter
      expect(screen.getByText('1/2')).toBeInTheDocument();
    });
  });

  it('shows city initial fallback when no images', async () => {
    const showNoImages = { ...baseShow, images: [] };
    render(<TourShowModal show={showNoImages} onClose={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('B')).toBeInTheDocument();
    });
  });

  it('shows map iframe when coordinates are present', async () => {
    render(<TourShowModal show={baseShow} onClose={vi.fn()} />);

    await waitFor(() => {
      const iframe = document.querySelector('iframe');
      expect(iframe).not.toBeNull();
      expect(iframe!.getAttribute('src')).toContain('openstreetmap.org');
    });
  });

  it('shows "Ubicación no disponible" when no coordinates', async () => {
    const showNoCoords = { ...baseShow, latitude: undefined, longitude: undefined };
    render(<TourShowModal show={showNoCoords} onClose={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('Ubicación no disponible')).toBeInTheDocument();
    });
  });

  it('shows COMPRAR ENTRADAS button when tickets available and ticketUrl exists', async () => {
    render(<TourShowModal show={baseShow} onClose={vi.fn()} />);

    await waitFor(() => {
      const buyButton = screen.getByText(/COMPRAR ENTRADAS/i);
      expect(buyButton).toBeInTheDocument();
      expect(buyButton.closest('a')).toHaveAttribute('href', 'https://tickets.example.com');
    });
  });

  it('does not show COMPRAR button for SOLD_OUT shows', async () => {
    render(<TourShowModal show={soldOutShow} onClose={vi.fn()} />);

    await waitFor(() => {
      expect(screen.queryByText(/COMPRAR ENTRADAS/i)).not.toBeInTheDocument();
    });
  });

  it('shows Edit and Delete buttons', async () => {
    render(<TourShowModal show={baseShow} onClose={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('EDITAR')).toBeInTheDocument();
      expect(screen.getByText('ELIMINAR')).toBeInTheDocument();
    });
  });

  it('Edit button navigates to dashboard edit page and closes modal', async () => {
    const onClose = vi.fn();
    render(<TourShowModal show={baseShow} onClose={onClose} />);

    await waitFor(() => {
      expect(screen.getByText('EDITAR')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('EDITAR'));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/dashboard/tour-shows/show-1');
  });

  it('Delete button shows confirmation prompt', async () => {
    render(<TourShowModal show={baseShow} onClose={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('ELIMINAR')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('ELIMINAR'));

    await waitFor(() => {
      expect(screen.getByText('¿Estás seguro de eliminar este show?')).toBeInTheDocument();
      expect(screen.getByText('CONFIRMAR')).toBeInTheDocument();
    });
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    render(<TourShowModal show={baseShow} onClose={onClose} />);

    await waitFor(() => {
      expect(screen.getByText('Buenos Aires')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('✕'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', async () => {
    const onClose = vi.fn();
    const { container } = render(
      <TourShowModal show={baseShow} onClose={onClose} />
    );

    await waitFor(() => {
      expect(screen.getByText('Buenos Aires')).toBeInTheDocument();
    });

    const backdrop = container.firstChild as HTMLElement;
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
