import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GuestModal from './GuestModal';

// Mock the hook
const mockGuest = {
  id: 'guest-1',
  name: 'Pablo Molinari',
  bio: 'Comediante argentino conocido por su humor ácido. Participó en múltiples episodios de la Escuela de Nada.',
  twitterHandle: 'pablomolinari',
  instagramHandle: 'pablomolinariok',
};

vi.mock('@/hooks/useGuestById', () => ({
  useGuestById: vi.fn(),
}));

import { useGuestById } from '@/hooks/useGuestById';

describe('GuestModal', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render when isOpen is false', () => {
    (useGuestById as ReturnType<typeof vi.fn>).mockReturnValue({
      guest: null,
      loading: false,
      error: null,
    });
    render(<GuestModal guestId="guest-1" isOpen={false} onClose={mockOnClose} />);
    expect(screen.queryByText('Pablo Molinari')).not.toBeInTheDocument();
  });

  it('shows loading skeleton when fetching guest data', () => {
    (useGuestById as ReturnType<typeof vi.fn>).mockReturnValue({
      guest: null,
      loading: true,
      error: null,
    });
    render(<GuestModal guestId="guest-1" isOpen={true} onClose={mockOnClose} />);
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('shows guest name when data is loaded', async () => {
    (useGuestById as ReturnType<typeof vi.fn>).mockReturnValue({
      guest: mockGuest,
      loading: false,
      error: null,
    });
    render(<GuestModal guestId="guest-1" isOpen={true} onClose={mockOnClose} />);
    await waitFor(() => {
      expect(screen.getByText('Pablo Molinari')).toBeInTheDocument();
    });
  });

  it('shows full bio without truncation', async () => {
    (useGuestById as ReturnType<typeof vi.fn>).mockReturnValue({
      guest: mockGuest,
      loading: false,
      error: null,
    });
    render(<GuestModal guestId="guest-1" isOpen={true} onClose={mockOnClose} />);
    await waitFor(() => {
      expect(screen.getByText(/Comediante argentino conocido por su humor ácido/)).toBeInTheDocument();
    });
  });

  it('shows twitter handle with @ prefix', async () => {
    (useGuestById as ReturnType<typeof vi.fn>).mockReturnValue({
      guest: mockGuest,
      loading: false,
      error: null,
    });
    render(<GuestModal guestId="guest-1" isOpen={true} onClose={mockOnClose} />);
    await waitFor(() => {
      expect(screen.getByText('@pablomolinari')).toBeInTheDocument();
    });
  });

  it('shows instagram handle with @ prefix', async () => {
    (useGuestById as ReturnType<typeof vi.fn>).mockReturnValue({
      guest: mockGuest,
      loading: false,
      error: null,
    });
    render(<GuestModal guestId="guest-1" isOpen={true} onClose={mockOnClose} />);
    await waitFor(() => {
      expect(screen.getByText('@pablomolinariok')).toBeInTheDocument();
    });
  });

  it('shows error message when fetch fails', async () => {
    (useGuestById as ReturnType<typeof vi.fn>).mockReturnValue({
      guest: null,
      loading: false,
      error: 'Error al cargar detalles',
    });
    render(<GuestModal guestId="guest-1" isOpen={true} onClose={mockOnClose} />);
    await waitFor(() => {
      expect(screen.getByText('Error al cargar detalles')).toBeInTheDocument();
    });
  });

  it('calls onClose when close button is clicked', async () => {
    (useGuestById as ReturnType<typeof vi.fn>).mockReturnValue({
      guest: mockGuest,
      loading: false,
      error: null,
    });
    render(<GuestModal guestId="guest-1" isOpen={true} onClose={mockOnClose} />);
    const closeButton = screen.getByText('✕');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', async () => {
    (useGuestById as ReturnType<typeof vi.fn>).mockReturnValue({
      guest: mockGuest,
      loading: false,
      error: null,
    });
    render(<GuestModal guestId="guest-1" isOpen={true} onClose={mockOnClose} />);
    // Click on the backdrop (first div with onClick)
    const backdrop = document.querySelector('.fixed.inset-0')!;
    fireEvent.click(backdrop);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('contains edit link pointing to correct URL', async () => {
    (useGuestById as ReturnType<typeof vi.fn>).mockReturnValue({
      guest: mockGuest,
      loading: false,
      error: null,
    });
    render(<GuestModal guestId="guest-1" isOpen={true} onClose={mockOnClose} />);
    await waitFor(() => {
      const editLink = screen.getByText('Editar');
      expect(editLink.closest('a')).toHaveAttribute('href', '/dashboard/guests/guest-1/edit');
    });
  });

  it('does not show edit button for guest without id', async () => {
    (useGuestById as ReturnType<typeof vi.fn>).mockReturnValue({
      guest: { ...mockGuest, id: '' },
      loading: false,
      error: null,
    });
    render(<GuestModal guestId="" isOpen={true} onClose={mockOnClose} />);
    await waitFor(() => {
      expect(screen.queryByText('Editar')).not.toBeInTheDocument();
    });
  });

  it('passes the correct guestId to useGuestById hook', () => {
    (useGuestById as ReturnType<typeof vi.fn>).mockReturnValue({
      guest: null,
      loading: true,
      error: null,
    });
    render(<GuestModal guestId="specific-id" isOpen={true} onClose={mockOnClose} />);
    expect(useGuestById).toHaveBeenCalledWith('specific-id');
  });
});
