import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GuestGrid from './GuestGrid';

const mockGuests = [
  { id: '1', name: 'Pablo Molinari', bio: 'Comediante argentino', twitterHandle: 'pablomolinari', instagramHandle: 'pablomolinariok' },
  { id: '2', name: 'Juan Perez', bio: 'Músico invitado', twitterHandle: 'juanperez', instagramHandle: undefined },
  { id: '3', name: 'Maria Lopez', bio: 'Actriz', twitterHandle: undefined, instagramHandle: 'marialopez' },
];

describe('GuestGrid', () => {
  it('renders loading skeletons when isLoading is true', () => {
    render(
      <GuestGrid
        guests={[]}
        isLoading={true}
        error={null}
        onGuestClick={vi.fn()}
        onAddClick={vi.fn()}
      />
    );
    // Should have skeleton elements (animate-pulse divs)
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders empty state when guests array is empty and not loading', () => {
    render(
      <GuestGrid
        guests={[]}
        isLoading={false}
        error={null}
        onGuestClick={vi.fn()}
        onAddClick={vi.fn()}
      />
    );
    expect(screen.getByText('No hay invitados registrados')).toBeInTheDocument();
  });

  it('renders "Agregar invitado" button in empty state', () => {
    render(
      <GuestGrid
        guests={[]}
        isLoading={false}
        error={null}
        onGuestClick={vi.fn()}
        onAddClick={vi.fn()}
      />
    );
    const addButton = screen.getByText('Agregar invitado');
    expect(addButton).toBeInTheDocument();
  });

  it('calls onAddClick when "Agregar invitado" button is clicked', () => {
    const onAddClick = vi.fn();
    render(
      <GuestGrid
        guests={[]}
        isLoading={false}
        error={null}
        onGuestClick={vi.fn()}
        onAddClick={onAddClick}
      />
    );
    fireEvent.click(screen.getByText('Agregar invitado'));
    expect(onAddClick).toHaveBeenCalledTimes(1);
  });

  it('renders GuestCards when guests data is provided', () => {
    render(
      <GuestGrid
        guests={mockGuests}
        isLoading={false}
        error={null}
        onGuestClick={vi.fn()}
        onAddClick={vi.fn()}
      />
    );
    expect(screen.getByText('Pablo Molinari')).toBeInTheDocument();
    expect(screen.getByText('Juan Perez')).toBeInTheDocument();
    expect(screen.getByText('Maria Lopez')).toBeInTheDocument();
  });

  it('shows error message when error is present', () => {
    render(
      <GuestGrid
        guests={[]}
        isLoading={false}
        error="Error de conexión"
        onGuestClick={vi.fn()}
        onAddClick={vi.fn()}
      />
    );
    expect(screen.getByText(/Error de conexión/)).toBeInTheDocument();
  });

  it('calls onGuestClick with guest when a card is clicked', () => {
    const onGuestClick = vi.fn();
    render(
      <GuestGrid
        guests={mockGuests}
        isLoading={false}
        error={null}
        onGuestClick={onGuestClick}
        onAddClick={vi.fn()}
      />
    );
    // Click on the first guest card
    const card = screen.getByText('Pablo Molinari').closest('article')!;
    fireEvent.click(card);
    expect(onGuestClick).toHaveBeenCalledWith(mockGuests[0]);
  });

  it('renders grids for multiple guests', () => {
    render(
      <GuestGrid
        guests={mockGuests}
        isLoading={false}
        error={null}
        onGuestClick={vi.fn()}
        onAddClick={vi.fn()}
      />
    );
    // Should render 3 cards
    const cards = document.querySelectorAll('article');
    expect(cards.length).toBe(3);
  });
});
