import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GuestsPage from './page';

const { mockUseGuests, mockUseGuestById, mockUseDeleteGuest, mockPush } = vi.hoisted(() => ({
  mockUseGuests: vi.fn(),
  mockUseGuestById: vi.fn(),
  mockUseDeleteGuest: vi.fn(),
  mockPush: vi.fn(),
}));

vi.mock('@/hooks/useGuests', () => ({
  useGuests: mockUseGuests,
}));

vi.mock('@/hooks/useGuestById', () => ({
  useGuestById: mockUseGuestById,
}));

vi.mock('@/hooks/useDeleteGuest', () => ({
  useDeleteGuest: mockUseDeleteGuest,
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

const mockGuests = [
  { id: '1', name: 'Pablo Molinari', bio: 'Comediante argentino', twitterHandle: 'pablomolinari', instagramHandle: 'pablomolinariok' },
  { id: '2', name: 'Juan Perez', bio: 'Músico invitado', twitterHandle: 'juanperez' },
];

describe('GuestsPage', () => {
  beforeEach(() => {
    mockUseGuests.mockReturnValue({ guests: [], loading: false, error: null });
    mockUseGuestById.mockReturnValue({ guest: null, loading: true, error: null });
    mockUseDeleteGuest.mockReturnValue({ deleteGuest: vi.fn().mockResolvedValue(true), loading: false, error: null });
    mockPush.mockClear();
  });

  it('renders empty state "No hay invitados registrados" when no guests exist', () => {
    mockUseGuests.mockReturnValue({ guests: [], loading: false, error: null });
    render(<GuestsPage />);
    expect(screen.getByText('No hay invitados registrados')).toBeInTheDocument();
  });

  it('renders guest names when data is loaded', () => {
    mockUseGuests.mockReturnValue({ guests: mockGuests, loading: false, error: null });
    render(<GuestsPage />);
    expect(screen.getByText('Pablo Molinari')).toBeInTheDocument();
    expect(screen.getByText('Juan Perez')).toBeInTheDocument();
  });

  it('shows loading skeletons when guests are loading', () => {
    mockUseGuests.mockReturnValue({ guests: [], loading: true, error: null });
    render(<GuestsPage />);
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('displays error message when fetch fails', () => {
    mockUseGuests.mockReturnValue({ guests: [], loading: false, error: 'Error al cargar invitados' });
    render(<GuestsPage />);
    expect(screen.getByText(/Error al cargar invitados/)).toBeInTheDocument();
  });

  it('navigates to /dashboard/guests/new when "Agregar invitado" is clicked in empty state', () => {
    mockUseGuests.mockReturnValue({ guests: [], loading: false, error: null });
    render(<GuestsPage />);
    fireEvent.click(screen.getByText('Agregar invitado'));
    expect(mockPush).toHaveBeenCalledWith('/dashboard/guests/new');
  });

  it('opens GuestModal showing guest details when a guest card is clicked', async () => {
    mockUseGuests.mockReturnValue({ guests: mockGuests, loading: false, error: null });
    mockUseGuestById.mockReturnValue({
      guest: mockGuests[0],
      loading: false,
      error: null,
    });

    render(<GuestsPage />);
    const card = screen.getByText('Pablo Molinari').closest('article')!;
    fireEvent.click(card);

    // Modal should show the "Editar" link (unique to the modal)
    expect(await screen.findByText('Editar')).toBeInTheDocument();
  });

  it('renders the page title "Invitados"', () => {
    mockUseGuests.mockReturnValue({ guests: mockGuests, loading: false, error: null });
    render(<GuestsPage />);
    expect(screen.getByText('Invitados')).toBeInTheDocument();
  });

  it('renders "+ Nuevo Invitado" CTA button in page header', () => {
    mockUseGuests.mockReturnValue({ guests: mockGuests, loading: false, error: null });
    render(<GuestsPage />);
    expect(screen.getByText('+ Nuevo Invitado')).toBeInTheDocument();
  });
});
