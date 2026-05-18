import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GuestCard from './GuestCard';

const baseGuest = {
  id: 'guest-1',
  name: 'Pablo Molinari',
  bio: 'Comediante argentino conocido por su humor ácido y su participación en la Escuela de Nada. Ha trabajado en numerosos proyectos de comedia.',
  twitterHandle: 'pablomolinari',
  instagramHandle: 'pablomolinariok',
};

describe('GuestCard', () => {
  it('renders the guest name', () => {
    render(<GuestCard guest={baseGuest} index={0} onClick={vi.fn()} />);
    expect(screen.getByText('Pablo Molinari')).toBeInTheDocument();
  });

  it('renders bio truncated to 100 characters', () => {
    render(<GuestCard guest={baseGuest} index={0} onClick={vi.fn()} />);
    const bio = screen.getByText(/Comediante argentino/);
    expect(bio).toBeInTheDocument();
    // Verify truncation: full bio is ~130 chars, display should be ≤100 + "..."
    expect(bio.textContent!.length).toBeLessThanOrEqual(104); // 100 + "..."
  });

  it('renders twitter handle with @ prefix', () => {
    render(<GuestCard guest={baseGuest} index={0} onClick={vi.fn()} />);
    expect(screen.getByText('@pablomolinari')).toBeInTheDocument();
  });

  it('renders instagram handle with @ prefix', () => {
    render(<GuestCard guest={baseGuest} index={0} onClick={vi.fn()} />);
    expect(screen.getByText('@pablomolinariok')).toBeInTheDocument();
  });

  it('does not render twitter badge when guest has no twitterHandle', () => {
    const guest = { ...baseGuest, twitterHandle: undefined };
    render(<GuestCard guest={guest} index={0} onClick={vi.fn()} />);
    expect(screen.queryByText('@pablomolinari')).not.toBeInTheDocument();
  });

  it('does not render instagram badge when guest has no instagramHandle', () => {
    const guest = { ...baseGuest, instagramHandle: undefined };
    render(<GuestCard guest={guest} index={0} onClick={vi.fn()} />);
    expect(screen.queryByText('@pablomolinariok')).not.toBeInTheDocument();
  });

  it('renders guest initials avatar', () => {
    render(<GuestCard guest={baseGuest} index={0} onClick={vi.fn()} />);
    expect(screen.getByText('PM')).toBeInTheDocument();
  });

  it('renders short bio without truncation when under 100 chars', () => {
    const guest = { ...baseGuest, bio: 'Comediante argentino.' };
    render(<GuestCard guest={guest} index={0} onClick={vi.fn()} />);
    const bio = screen.getByText('Comediante argentino.');
    expect(bio).toBeInTheDocument();
    expect(bio.textContent).toBe('Comediante argentino.');
  });

  it('renders correct initials for single-word name', () => {
    const guest = { ...baseGuest, name: 'Milo' };
    render(<GuestCard guest={guest} index={0} onClick={vi.fn()} />);
    expect(screen.getByText('M')).toBeInTheDocument();
  });

  it('renders correct initials for three-word name', () => {
    const guest = { ...baseGuest, name: 'Juan Pablo Perez' };
    render(<GuestCard guest={guest} index={0} onClick={vi.fn()} />);
    expect(screen.getByText('JP')).toBeInTheDocument();
  });

  it('renders with neither social handle without error', () => {
    const guest = { ...baseGuest, twitterHandle: undefined, instagramHandle: undefined };
    render(<GuestCard guest={guest} index={0} onClick={vi.fn()} />);
    expect(screen.getByText('Pablo Molinari')).toBeInTheDocument();
  });

  it('renders only twitter badge when instagram is missing', () => {
    const guest = { ...baseGuest, instagramHandle: undefined };
    render(<GuestCard guest={guest} index={0} onClick={vi.fn()} />);
    expect(screen.getByText('@pablomolinari')).toBeInTheDocument();
    expect(screen.queryByText('@pablomolinariok')).not.toBeInTheDocument();
  });

  it('renders only instagram badge when twitter is missing', () => {
    const guest = { ...baseGuest, twitterHandle: undefined };
    render(<GuestCard guest={guest} index={0} onClick={vi.fn()} />);
    expect(screen.getByText('@pablomolinariok')).toBeInTheDocument();
    expect(screen.queryByText('@pablomolinari')).not.toBeInTheDocument();
  });

  it('calls onClick when card article is clicked', () => {
    const onClick = vi.fn();
    render(<GuestCard guest={baseGuest} index={0} onClick={onClick} />);
    const card = screen.getByRole('article');
    fireEvent.click(card);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
