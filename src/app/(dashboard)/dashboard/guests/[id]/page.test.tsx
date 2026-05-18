import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import GuestDetailPage from './page';

const { mockUseGuestById, mockPush } = vi.hoisted(() => ({
  mockUseGuestById: vi.fn(),
  mockPush: vi.fn(),
}));

vi.mock('@/hooks/useGuestById', () => ({
  useGuestById: mockUseGuestById,
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useParams: () => ({ id: '1' }),
  usePathname: () => '/dashboard/guests/1',
  useSearchParams: () => new URLSearchParams(),
}));

const mockGuest = {
  id: '1',
  name: 'Pablo Molinari',
  bio: 'Comediante argentino, creador de contenido y host del podcast EDN.',
  twitterHandle: 'pablomolinari',
  instagramHandle: 'pablomolinariok',
};

describe('GuestDetailPage', () => {
  beforeEach(() => {
    mockUseGuestById.mockReturnValue({ guest: null, loading: true, error: null });
    mockPush.mockClear();
  });

  it('shows loading state when guest data is being fetched', () => {
    mockUseGuestById.mockReturnValue({ guest: null, loading: true, error: null });
    render(<GuestDetailPage />);
    // The modal shows skeleton loading
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('shows guest name in modal when data is loaded', () => {
    mockUseGuestById.mockReturnValue({ guest: mockGuest, loading: false, error: null });
    render(<GuestDetailPage />);
    expect(screen.getByText('Pablo Molinari')).toBeInTheDocument();
  });

  it('shows full guest bio in modal', () => {
    mockUseGuestById.mockReturnValue({ guest: mockGuest, loading: false, error: null });
    render(<GuestDetailPage />);
    expect(screen.getByText(/Comediante argentino/)).toBeInTheDocument();
  });

  it('shows social handles in modal', () => {
    mockUseGuestById.mockReturnValue({ guest: mockGuest, loading: false, error: null });
    render(<GuestDetailPage />);
    // Both handles should be visible
    const handles = screen.getAllByText(/@pablomolinari/);
    expect(handles.length).toBe(2);
    expect(handles[0].textContent).toContain('@pablomolinari');
  });

  it('renders "Editar" link pointing to edit page', () => {
    mockUseGuestById.mockReturnValue({ guest: mockGuest, loading: false, error: null });
    render(<GuestDetailPage />);
    const editLink = screen.getByText('Editar');
    expect(editLink.closest('a')).toHaveAttribute('href', '/dashboard/guests/1/edit');
  });

  it('shows error message when fetch fails', () => {
    mockUseGuestById.mockReturnValue({ guest: null, loading: false, error: 'Error al cargar detalles' });
    render(<GuestDetailPage />);
    expect(screen.getByText(/Error al cargar detalles/)).toBeInTheDocument();
  });
});
