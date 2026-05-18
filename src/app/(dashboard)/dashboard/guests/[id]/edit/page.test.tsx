import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import EditGuestPage from './page';

const { mockUseGuestById, mockUseUpdateGuest, mockPush } = vi.hoisted(() => ({
  mockUseGuestById: vi.fn(),
  mockUseUpdateGuest: vi.fn(),
  mockPush: vi.fn(),
}));

vi.mock('@/hooks/useGuestById', () => ({
  useGuestById: mockUseGuestById,
}));

vi.mock('@/hooks/useUpdateGuest', () => ({
  useUpdateGuest: mockUseUpdateGuest,
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useParams: () => ({ id: '1' }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

const mockGuest = {
  id: '1',
  name: 'Pablo Molinari',
  bio: 'Comediante argentino',
  twitterHandle: 'pablomolinari',
  instagramHandle: 'pablomolinariok',
};

describe('EditGuestPage', () => {
  beforeEach(() => {
    mockUseGuestById.mockReturnValue({ guest: null, loading: true, error: null });
    mockUseUpdateGuest.mockReturnValue({
      updateGuest: vi.fn().mockResolvedValue({ id: '1', name: 'Test', bio: '' }),
      loading: false,
      error: null,
    });
    mockPush.mockClear();
  });

  it('shows loading state while fetching guest data', () => {
    mockUseGuestById.mockReturnValue({ guest: null, loading: true, error: null });
    render(<EditGuestPage />);
    // Should show a loading spinner
    const spinners = document.querySelectorAll('.animate-spin');
    expect(spinners.length).toBeGreaterThan(0);
  });

  it('renders the page title "Editar Invitado" when data is loaded', () => {
    mockUseGuestById.mockReturnValue({ guest: mockGuest, loading: false, error: null });
    render(<EditGuestPage />);
    expect(screen.getByText('Editar Invitado')).toBeInTheDocument();
  });

  it('renders GuestForm with pre-filled name when data is loaded', () => {
    mockUseGuestById.mockReturnValue({ guest: mockGuest, loading: false, error: null });
    render(<EditGuestPage />);
    const nameInput = screen.getByLabelText(/Nombre/) as HTMLInputElement;
    expect(nameInput.value).toBe('Pablo Molinari');
  });

  it('renders GuestForm with pre-filled bio when data is loaded', () => {
    mockUseGuestById.mockReturnValue({ guest: mockGuest, loading: false, error: null });
    render(<EditGuestPage />);
    const bioInput = screen.getByLabelText(/Bio/) as HTMLTextAreaElement;
    expect(bioInput.value).toBe('Comediante argentino');
  });

  it('renders "Guardar cambios" submit button', () => {
    mockUseGuestById.mockReturnValue({ guest: mockGuest, loading: false, error: null });
    render(<EditGuestPage />);
    expect(screen.getByText('Guardar cambios')).toBeInTheDocument();
  });

  it('shows error when guest is not found', () => {
    mockUseGuestById.mockReturnValue({ guest: null, loading: false, error: 'Invitado no encontrado' });
    render(<EditGuestPage />);
    expect(screen.getByText(/Invitado no encontrado/)).toBeInTheDocument();
  });
});
