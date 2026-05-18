import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import UserCard from './UserCard';
import type { User } from '@/types/user';

const baseUser: User = {
  id: 'user-1',
  email: 'pablo@example.com',
  username: 'Pablo Molinari',
  role: 'USER',
};

const adminUser: User = {
  id: 'admin-1',
  email: 'admin@example.com',
  username: 'Admin User',
  role: 'ADMIN',
};

describe('UserCard', () => {
  it('renders the user username', () => {
    render(<UserCard user={baseUser} index={0} onClick={vi.fn()} />);
    expect(screen.getByText('Pablo Molinari')).toBeInTheDocument();
  });

  it('renders the user email', () => {
    render(<UserCard user={baseUser} index={0} onClick={vi.fn()} />);
    expect(screen.getByText('pablo@example.com')).toBeInTheDocument();
  });

  it('renders initials for avatar', () => {
    render(<UserCard user={baseUser} index={0} onClick={vi.fn()} />);
    expect(screen.getByText('PM')).toBeInTheDocument();
  });

  it('renders correct initials for single-word username', () => {
    const user: User = { ...baseUser, username: 'Milo' };
    render(<UserCard user={user} index={0} onClick={vi.fn()} />);
    expect(screen.getByText('M')).toBeInTheDocument();
  });

  it('renders initials for three-word username', () => {
    const user: User = { ...baseUser, username: 'Juan Pablo Perez' };
    render(<UserCard user={user} index={0} onClick={vi.fn()} />);
    expect(screen.getByText('JP')).toBeInTheDocument();
  });

  it('renders USER role badge with gray styling', () => {
    render(<UserCard user={baseUser} index={0} onClick={vi.fn()} />);
    const badge = screen.getByText('USER');
    expect(badge).toBeInTheDocument();
  });

  it('renders ADMIN role badge with gold styling', () => {
    render(<UserCard user={adminUser} index={0} onClick={vi.fn()} />);
    const badge = screen.getByText('ADMIN');
    expect(badge).toBeInTheDocument();
  });

  it('calls onClick when card is clicked', () => {
    const onClick = vi.fn();
    render(<UserCard user={baseUser} index={0} onClick={onClick} />);
    const card = screen.getByRole('article');
    fireEvent.click(card);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('applies animation delay based on index', () => {
    render(<UserCard user={baseUser} index={3} onClick={vi.fn()} />);
    const card = screen.getByRole('article');
    expect(card).toBeInTheDocument();
  });
});
