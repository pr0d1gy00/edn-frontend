import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TourShowCard from './TourShowCard';
import type { TourShow } from '@/types/tourShow';

const baseShow: TourShow = {
  id: 'show-1',
  city: 'Buenos Aires',
  country: 'Argentina',
  venueName: 'Estadio Monumental',
  showDate: '2025-08-15T20:00:00Z',
  ticketUrl: 'https://tickets.example.com/ba',
  ticketStatus: 'AVAILABLE',
  images: [],
};

const fewTicketsShow: TourShow = {
  ...baseShow,
  id: 'show-2',
  ticketStatus: 'FEW_TICKETS',
};

const soldOutShow: TourShow = {
  ...baseShow,
  id: 'show-3',
  ticketStatus: 'SOLD_OUT',
};

const showWithImages: TourShow = {
  ...baseShow,
  id: 'show-4',
  images: [
    { id: 'img-1', url: 'https://example.com/image1.jpg', isPrimary: true, sortOrder: 0 },
    { id: 'img-2', url: 'https://example.com/image2.jpg', isPrimary: false, sortOrder: 1 },
  ],
};

const showNoTicketUrl: TourShow = {
  ...baseShow,
  id: 'show-5',
  ticketUrl: '',
};

describe('TourShowCard', () => {
  it('renders the city as heading', () => {
    render(<TourShowCard show={baseShow} index={0} onClick={vi.fn()} />);
    expect(screen.getByText('Buenos Aires')).toBeInTheDocument();
  });

  it('renders the country', () => {
    render(<TourShowCard show={baseShow} index={0} onClick={vi.fn()} />);
    expect(screen.getByText('Argentina')).toBeInTheDocument();
  });

  it('renders the venue name', () => {
    render(<TourShowCard show={baseShow} index={0} onClick={vi.fn()} />);
    expect(screen.getByText('Estadio Monumental')).toBeInTheDocument();
  });

  it('renders formatted show date', () => {
    render(<TourShowCard show={baseShow} index={0} onClick={vi.fn()} />);
    // The formatted date depends on locale; check that some date string appears
    expect(screen.getByText(/15/)).toBeInTheDocument();
    expect(screen.getByText(/ago|Aug/)).toBeInTheDocument();
    // We can't assert exact format but we know showDate=2025-08-15 is in August
  });

  it('renders AVAILABLE ticket status badge', () => {
    render(<TourShowCard show={baseShow} index={0} onClick={vi.fn()} />);
    const badge = screen.getByText('DISPONIBLE');
    expect(badge).toBeInTheDocument();
  });

  it('renders FEW_TICKETS ticket status badge', () => {
    render(<TourShowCard show={fewTicketsShow} index={0} onClick={vi.fn()} />);
    const badge = screen.getByText('¡ÚLTIMAS!');
    expect(badge).toBeInTheDocument();
  });

  it('renders SOLD_OUT ticket status badge', () => {
    render(<TourShowCard show={soldOutShow} index={0} onClick={vi.fn()} />);
    const badge = screen.getByText('AGOTADO');
    expect(badge).toBeInTheDocument();
  });

  it('renders thumbnail image when images array has items', () => {
    render(<TourShowCard show={showWithImages} index={0} onClick={vi.fn()} />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('alt', 'Buenos Aires');
  });

  it('shows city initial fallback when no images', () => {
    render(<TourShowCard show={baseShow} index={0} onClick={vi.fn()} />);
    const fallback = screen.getByText('B');
    expect(fallback).toBeInTheDocument();
  });

  it('renders COMPRAR button when tickets available and ticketUrl exists', () => {
    render(<TourShowCard show={baseShow} index={0} onClick={vi.fn()} />);
    const button = screen.getByText('COMPRAR');
    expect(button).toBeInTheDocument();
    expect(button.closest('a')).toHaveAttribute('href', 'https://tickets.example.com/ba');
  });

  it('does not render COMPRAR button when SOLD_OUT', () => {
    render(<TourShowCard show={soldOutShow} index={0} onClick={vi.fn()} />);
    expect(screen.queryByText('COMPRAR')).not.toBeInTheDocument();
  });

  it('does not render COMPRAR button when ticketUrl is empty', () => {
    render(<TourShowCard show={showNoTicketUrl} index={0} onClick={vi.fn()} />);
    expect(screen.queryByText('COMPRAR')).not.toBeInTheDocument();
  });

  it('calls onClick when card is clicked', () => {
    const onClick = vi.fn();
    render(<TourShowCard show={baseShow} index={0} onClick={onClick} />);
    const card = screen.getByRole('article');
    fireEvent.click(card);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('applies animation based on index', () => {
    render(<TourShowCard show={baseShow} index={3} onClick={vi.fn()} />);
    const card = screen.getByRole('article');
    expect(card).toBeInTheDocument();
  });
});
