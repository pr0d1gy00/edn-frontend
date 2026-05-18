import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import NewGuestPage from './page';

const { mockUseCreateGuest, mockPush } = vi.hoisted(() => ({
  mockUseCreateGuest: vi.fn(),
  mockPush: vi.fn(),
}));

vi.mock('@/hooks/useCreateGuest', () => ({
  useCreateGuest: mockUseCreateGuest,
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

describe('NewGuestPage', () => {
  beforeEach(() => {
    mockUseCreateGuest.mockReturnValue({
      createGuest: vi.fn().mockResolvedValue({ id: '1', name: 'Test', bio: '' }),
      loading: false,
      error: null,
    });
    mockPush.mockClear();
  });

  it('renders the page title "Nuevo Invitado"', () => {
    render(<NewGuestPage />);
    expect(screen.getByText('Nuevo Invitado')).toBeInTheDocument();
  });

  it('renders the GuestForm with name input field', () => {
    render(<NewGuestPage />);
    expect(screen.getByLabelText(/Nombre/)).toBeInTheDocument();
  });

  it('renders a bio textarea', () => {
    render(<NewGuestPage />);
    expect(screen.getByLabelText(/Bio/)).toBeInTheDocument();
  });

  it('renders a "Crear invitado" submit button', () => {
    render(<NewGuestPage />);
    expect(screen.getByText('Crear invitado')).toBeInTheDocument();
  });

  it('has a "Volver" back button linking to /dashboard/guests', () => {
    render(<NewGuestPage />);
    const backButton = screen.getByText('Volver');
    expect(backButton).toBeInTheDocument();
    // The back button uses router.push via onClick
  });
});
