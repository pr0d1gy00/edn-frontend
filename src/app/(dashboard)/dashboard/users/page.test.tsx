import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import UsersPage from './page';

const { mockUseUsers, mockUseUserById, mockUseDeleteUser, mockPush } = vi.hoisted(() => ({
  mockUseUsers: vi.fn(),
  mockUseUserById: vi.fn(),
  mockUseDeleteUser: vi.fn(),
  mockPush: vi.fn(),
}));

vi.mock('@/hooks/useUsers', () => ({
  useUsers: mockUseUsers,
}));

vi.mock('@/hooks/useUserById', () => ({
  useUserById: mockUseUserById,
}));

vi.mock('@/hooks/useDeleteUser', () => ({
  useDeleteUser: mockUseDeleteUser,
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

const mockUsers = [
  { id: '1', email: 'pablo@example.com', username: 'Pablo Molinari', role: 'USER' as const },
  { id: '2', email: 'juan@example.com', username: 'Juan Perez', role: 'USER' as const },
];

describe('UsersPage', () => {
  beforeEach(() => {
    mockUseUsers.mockReturnValue({ users: [], loading: false, error: null });
    mockUseUserById.mockReturnValue({ user: null, loading: true, error: null });
    mockUseDeleteUser.mockReturnValue({ deleteUser: vi.fn().mockResolvedValue(true), loading: false, error: null });
    mockPush.mockClear();
  });

  it('renders empty state "No hay usuarios registrados" when no users exist', () => {
    mockUseUsers.mockReturnValue({ users: [], loading: false, error: null });
    render(<UsersPage />);
    expect(screen.getByText('No hay usuarios registrados')).toBeInTheDocument();
  });

  it('renders user names when data is loaded', () => {
    mockUseUsers.mockReturnValue({ users: mockUsers, loading: false, error: null });
    render(<UsersPage />);
    expect(screen.getByText('Pablo Molinari')).toBeInTheDocument();
    expect(screen.getByText('Juan Perez')).toBeInTheDocument();
  });

  it('shows loading skeletons when users are loading', () => {
    mockUseUsers.mockReturnValue({ users: [], loading: true, error: null });
    render(<UsersPage />);
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('displays error message when fetch fails', () => {
    mockUseUsers.mockReturnValue({ users: [], loading: false, error: 'Error al cargar usuarios' });
    render(<UsersPage />);
    expect(screen.getByText(/Error al cargar usuarios/)).toBeInTheDocument();
  });

  it('navigates to /dashboard/users/new when "Crear usuario" is clicked in empty state', () => {
    mockUseUsers.mockReturnValue({ users: [], loading: false, error: null });
    render(<UsersPage />);
    fireEvent.click(screen.getByText('Crear usuario'));
    expect(mockPush).toHaveBeenCalledWith('/dashboard/users/new');
  });

  it('opens UserModal showing user details when a user card is clicked', async () => {
    mockUseUsers.mockReturnValue({ users: mockUsers, loading: false, error: null });
    mockUseUserById.mockReturnValue({
      user: mockUsers[0],
      loading: false,
      error: null,
    });

    render(<UsersPage />);
    const card = screen.getByText('Pablo Molinari').closest('article')!;
    fireEvent.click(card);

    // Modal should show "Editar" link (unique to the modal)
    const editLink = await screen.findByText('Editar');
    expect(editLink).toBeInTheDocument();
  });

  it('renders the page title "Usuarios"', () => {
    mockUseUsers.mockReturnValue({ users: mockUsers, loading: false, error: null });
    render(<UsersPage />);
    expect(screen.getByText('Usuarios')).toBeInTheDocument();
  });

  it('renders "+ Nuevo Usuario" CTA button in page header', () => {
    mockUseUsers.mockReturnValue({ users: mockUsers, loading: false, error: null });
    render(<UsersPage />);
    expect(screen.getByText('+ Nuevo Usuario')).toBeInTheDocument();
  });

  it('navigates to new page when header CTA is clicked', () => {
    mockUseUsers.mockReturnValue({ users: [], loading: false, error: null });
    render(<UsersPage />);
    fireEvent.click(screen.getByText('+ Nuevo Usuario'));
    expect(mockPush).toHaveBeenCalledWith('/dashboard/users/new');
  });
});
