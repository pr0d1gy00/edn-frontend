import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserModal from './UserModal';
import type { User } from '@/types/user';

const mockUseUserById = vi.fn();

vi.mock('@/hooks/useUserById', () => ({
  useUserById: (id: string) => mockUseUserById(id),
}));

const baseUser: User = {
  id: 'user-1',
  email: 'pablo@example.com',
  username: 'Pablo Molinari',
  role: 'USER',
  createdAt: '2025-01-15T10:00:00Z',
  updatedAt: '2025-06-01T15:30:00Z',
};

describe('UserModal', () => {
  beforeEach(() => {
    mockUseUserById.mockReset();
  });

  it('returns null when isOpen is false', () => {
    mockUseUserById.mockReturnValue({ user: null, loading: true, error: null });
    const { container } = render(
      <UserModal userId="user-1" isOpen={false} onClose={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders loading skeleton when loading', () => {
    mockUseUserById.mockReturnValue({ user: null, loading: true, error: null });
    render(<UserModal userId="user-1" isOpen={true} onClose={vi.fn()} />);

    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders error message when fetch fails', () => {
    mockUseUserById.mockReturnValue({ user: null, loading: false, error: 'Error al cargar usuario' });
    render(<UserModal userId="user-1" isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('Error al cargar usuario')).toBeInTheDocument();
  });

  it('renders user details when data is loaded', async () => {
    mockUseUserById.mockReturnValue({ user: baseUser, loading: false, error: null });
    render(<UserModal userId="user-1" isOpen={true} onClose={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('Pablo Molinari')).toBeInTheDocument();
    });

    expect(screen.getByText('pablo@example.com')).toBeInTheDocument();
  });

  it('renders role badge for USER role', async () => {
    mockUseUserById.mockReturnValue({ user: baseUser, loading: false, error: null });
    render(<UserModal userId="user-1" isOpen={true} onClose={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('USER')).toBeInTheDocument();
    });
  });

  it('renders role badge for ADMIN role with distinct styling', async () => {
    const adminUser = { ...baseUser, role: 'ADMIN' as const };
    mockUseUserById.mockReturnValue({ user: adminUser, loading: false, error: null });
    render(<UserModal userId="admin-1" isOpen={true} onClose={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('ADMIN')).toBeInTheDocument();
    });
  });

  it('renders user initials avatar', async () => {
    mockUseUserById.mockReturnValue({ user: baseUser, loading: false, error: null });
    render(<UserModal userId="user-1" isOpen={true} onClose={vi.fn()} />);

    await waitFor(() => {
      const initials = screen.getAllByText('PM');
      expect(initials.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('renders edit link pointing to the user edit page', async () => {
    mockUseUserById.mockReturnValue({ user: baseUser, loading: false, error: null });
    render(<UserModal userId="user-1" isOpen={true} onClose={vi.fn()} />);

    await waitFor(() => {
      const editLink = screen.getByText('Editar');
      expect(editLink).toBeInTheDocument();
      expect(editLink.closest('a')).toHaveAttribute('href', '/dashboard/users/user-1');
    });
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    mockUseUserById.mockReturnValue({ user: baseUser, loading: false, error: null });
    render(<UserModal userId="user-1" isOpen={true} onClose={onClose} />);

    await waitFor(() => {
      expect(screen.getByText('Pablo Molinari')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('✕'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', async () => {
    const onClose = vi.fn();
    mockUseUserById.mockReturnValue({ user: baseUser, loading: false, error: null });
    const { container } = render(
      <UserModal userId="user-1" isOpen={true} onClose={onClose} />
    );

    await waitFor(() => {
      expect(screen.getByText('Pablo Molinari')).toBeInTheDocument();
    });

    // Click the outermost backdrop div
    const backdrop = container.firstChild as HTMLElement;
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
