import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import EditUserPage from './page';

const mockPush = vi.fn();
const mockUseUserById = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useParams: () => ({ id: 'user-1' }),
}));

vi.mock('@/hooks/useUserById', () => ({
  useUserById: (id: string) => mockUseUserById(id),
}));

vi.mock('@/hooks/useUpdateUser', () => ({
  useUpdateUser: () => ({
    updateUser: vi.fn(),
    loading: false,
    error: null,
  }),
}));

const mockUser = {
  id: 'user-1',
  email: 'edit@example.com',
  username: 'Edit User',
  role: 'USER' as const,
};

describe('EditUserPage', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockUseUserById.mockReset();
  });

  it('renders loading spinner while fetching user', () => {
    mockUseUserById.mockReturnValue({ user: null, loading: true, error: null });
    render(<EditUserPage />);

    const spinners = document.querySelectorAll('.animate-spin');
    expect(spinners.length).toBeGreaterThan(0);
  });

  it('renders error message when user fetch fails', () => {
    mockUseUserById.mockReturnValue({ user: null, loading: false, error: 'Error al cargar usuario' });
    render(<EditUserPage />);

    expect(screen.getByText('Error al cargar usuario')).toBeInTheDocument();
  });

  it('renders "Usuario no encontrado" when user is null without error', () => {
    mockUseUserById.mockReturnValue({ user: null, loading: false, error: null });
    render(<EditUserPage />);

    expect(screen.getByText('Usuario no encontrado')).toBeInTheDocument();
  });

  it('renders "Volver" button', () => {
    mockUseUserById.mockReturnValue({ user: mockUser, loading: false, error: null });
    render(<EditUserPage />);

    expect(screen.getByText('Volver')).toBeInTheDocument();
  });

  it('renders page title "Editar Usuario"', () => {
    mockUseUserById.mockReturnValue({ user: mockUser, loading: false, error: null });
    render(<EditUserPage />);

    expect(screen.getByText('Editar Usuario')).toBeInTheDocument();
  });

  it('renders UserForm in edit mode with pre-filled data', () => {
    mockUseUserById.mockReturnValue({ user: mockUser, loading: false, error: null });
    render(<EditUserPage />);

    expect(screen.getByLabelText(/Email/i)).toHaveValue('edit@example.com');
    expect(screen.getByLabelText(/Usuario/i)).toHaveValue('Edit User');
  });
});
