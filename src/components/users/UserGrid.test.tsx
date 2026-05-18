import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import UserGrid from './UserGrid';
import type { User } from '@/types/user';

const mockUsers: User[] = [
  { id: '1', email: 'pablo@example.com', username: 'Pablo Molinari', role: 'USER' },
  { id: '2', email: 'juan@example.com', username: 'Juan Perez', role: 'USER' },
  { id: '3', email: 'maria@example.com', username: 'Maria Lopez', role: 'ADMIN' },
];

describe('UserGrid', () => {
  it('renders loading skeletons when isLoading is true', () => {
    render(
      <UserGrid
        users={[]}
        isLoading={true}
        error={null}
        onUserClick={vi.fn()}
        onAddClick={vi.fn()}
      />
    );
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders empty state when users array is empty and not loading', () => {
    render(
      <UserGrid
        users={[]}
        isLoading={false}
        error={null}
        onUserClick={vi.fn()}
        onAddClick={vi.fn()}
      />
    );
    expect(screen.getByText('No hay usuarios registrados')).toBeInTheDocument();
  });

  it('renders "Crear usuario" button in empty state', () => {
    render(
      <UserGrid
        users={[]}
        isLoading={false}
        error={null}
        onUserClick={vi.fn()}
        onAddClick={vi.fn()}
      />
    );
    expect(screen.getByText('Crear usuario')).toBeInTheDocument();
  });

  it('calls onAddClick when "Crear usuario" button is clicked', () => {
    const onAddClick = vi.fn();
    render(
      <UserGrid
        users={[]}
        isLoading={false}
        error={null}
        onUserClick={vi.fn()}
        onAddClick={onAddClick}
      />
    );
    fireEvent.click(screen.getByText('Crear usuario'));
    expect(onAddClick).toHaveBeenCalledTimes(1);
  });

  it('renders UserCards when users data is provided', () => {
    render(
      <UserGrid
        users={mockUsers}
        isLoading={false}
        error={null}
        onUserClick={vi.fn()}
        onAddClick={vi.fn()}
      />
    );
    expect(screen.getByText('Pablo Molinari')).toBeInTheDocument();
    expect(screen.getByText('Juan Perez')).toBeInTheDocument();
    expect(screen.getByText('Maria Lopez')).toBeInTheDocument();
  });

  it('shows error message when error is present', () => {
    render(
      <UserGrid
        users={[]}
        isLoading={false}
        error="Error de conexión"
        onUserClick={vi.fn()}
        onAddClick={vi.fn()}
      />
    );
    expect(screen.getByText(/Error de conexión/)).toBeInTheDocument();
  });

  it('calls onUserClick with user when a card is clicked', () => {
    const onUserClick = vi.fn();
    render(
      <UserGrid
        users={mockUsers}
        isLoading={false}
        error={null}
        onUserClick={onUserClick}
        onAddClick={vi.fn()}
      />
    );
    const card = screen.getByText('Pablo Molinari').closest('article')!;
    fireEvent.click(card);
    expect(onUserClick).toHaveBeenCalledWith(mockUsers[0]);
  });

  it('renders correct number of user cards', () => {
    render(
      <UserGrid
        users={mockUsers}
        isLoading={false}
        error={null}
        onUserClick={vi.fn()}
        onAddClick={vi.fn()}
      />
    );
    const cards = document.querySelectorAll('article');
    expect(cards.length).toBe(3);
  });
});
