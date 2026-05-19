import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TourShowGrid from './TourShowGrid';
import type { TourShow } from '@/types/tourShow';

const mockShows: TourShow[] = [
  {
    id: '1', city: 'Buenos Aires', country: 'Argentina',
    venueName: 'Estadio Monumental', showDate: '2025-08-15T20:00:00Z',
    ticketUrl: 'https://tickets.com/1', ticketStatus: 'AVAILABLE', images: [],
  },
  {
    id: '2', city: 'Santiago', country: 'Chile',
    venueName: 'Estadio Nacional', showDate: '2025-09-01T20:00:00Z',
    ticketUrl: 'https://tickets.com/2', ticketStatus: 'FEW_TICKETS', images: [],
  },
  {
    id: '3', city: 'Lima', country: 'Perú',
    venueName: 'Estadio Monumental de Lima', showDate: '2025-10-10T20:00:00Z',
    ticketUrl: '', ticketStatus: 'SOLD_OUT', images: [],
  },
];

describe('TourShowGrid', () => {
  it('renders loading skeletons when isLoading is true', () => {
    render(
      <TourShowGrid
        shows={[]}
        isLoading={true}
        error={null}
        onTourShowClick={vi.fn()}
        onAddClick={vi.fn()}
        onRetry={vi.fn()}
      />
    );
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders empty state when shows array is empty and not loading', () => {
    render(
      <TourShowGrid
        shows={[]}
        isLoading={false}
        error={null}
        onTourShowClick={vi.fn()}
        onAddClick={vi.fn()}
        onRetry={vi.fn()}
      />
    );
    expect(screen.getByText(/No hay fechas de tour/i)).toBeInTheDocument();
  });

  it('renders "Agregar show" button in empty state', () => {
    render(
      <TourShowGrid
        shows={[]}
        isLoading={false}
        error={null}
        onTourShowClick={vi.fn()}
        onAddClick={vi.fn()}
        onRetry={vi.fn()}
      />
    );
    expect(screen.getByText(/Agregar show/i)).toBeInTheDocument();
  });

  it('calls onAddClick when "Agregar show" button is clicked', () => {
    const onAddClick = vi.fn();
    render(
      <TourShowGrid
        shows={[]}
        isLoading={false}
        error={null}
        onTourShowClick={vi.fn()}
        onAddClick={onAddClick}
        onRetry={vi.fn()}
      />
    );
    fireEvent.click(screen.getByText(/Agregar show/i));
    expect(onAddClick).toHaveBeenCalledTimes(1);
  });

  it('renders TourShowCards when shows data is provided', () => {
    render(
      <TourShowGrid
        shows={mockShows}
        isLoading={false}
        error={null}
        onTourShowClick={vi.fn()}
        onAddClick={vi.fn()}
        onRetry={vi.fn()}
      />
    );
    expect(screen.getByText('Buenos Aires')).toBeInTheDocument();
    expect(screen.getByText('Santiago')).toBeInTheDocument();
    expect(screen.getByText('Lima')).toBeInTheDocument();
  });

  it('shows error message when error is present', () => {
    render(
      <TourShowGrid
        shows={[]}
        isLoading={false}
        error="Error de conexión"
        onTourShowClick={vi.fn()}
        onAddClick={vi.fn()}
        onRetry={vi.fn()}
      />
    );
    expect(screen.getByText(/Error de conexión/)).toBeInTheDocument();
  });

  it('renders "Reintentar" button in error state', () => {
    const onRetry = vi.fn();
    render(
      <TourShowGrid
        shows={[]}
        isLoading={false}
        error="Error de conexión"
        onTourShowClick={vi.fn()}
        onAddClick={vi.fn()}
        onRetry={onRetry}
      />
    );
    expect(screen.getByText(/Reintentar/i)).toBeInTheDocument();
  });

  it('calls onRetry when "Reintentar" button is clicked', () => {
    const onRetry = vi.fn();
    render(
      <TourShowGrid
        shows={[]}
        isLoading={false}
        error="Error de conexión"
        onTourShowClick={vi.fn()}
        onAddClick={vi.fn()}
        onRetry={onRetry}
      />
    );
    fireEvent.click(screen.getByText(/Reintentar/i));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('calls onTourShowClick with show when a card is clicked', () => {
    const onTourShowClick = vi.fn();
    render(
      <TourShowGrid
        shows={mockShows}
        isLoading={false}
        error={null}
        onTourShowClick={onTourShowClick}
        onAddClick={vi.fn()}
        onRetry={vi.fn()}
      />
    );
    const card = screen.getByText('Buenos Aires').closest('article')!;
    fireEvent.click(card);
    expect(onTourShowClick).toHaveBeenCalledWith(mockShows[0]);
  });

  it('renders correct number of tour show cards', () => {
    render(
      <TourShowGrid
        shows={mockShows}
        isLoading={false}
        error={null}
        onTourShowClick={vi.fn()}
        onAddClick={vi.fn()}
        onRetry={vi.fn()}
      />
    );
    const cards = document.querySelectorAll('article');
    expect(cards.length).toBe(3);
  });
});
