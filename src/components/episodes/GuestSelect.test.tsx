import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import GuestSelect from '@/components/episodes/GuestSelect';

const API_BASE = 'http://localhost:3000';

describe('GuestSelect pure helpers', () => {
  it('formatGuestOption maps guest to select option', async () => {
    const { formatGuestOption } = await import(
      '@/components/episodes/GuestSelect'
    );

    const guest = {
      id: 'g1',
      name: 'Alice',
      bio: 'Comedian',
      twitterHandle: 'alice_tweets',
    };

    const option = formatGuestOption(guest);

    expect(option.value).toBe('g1');
    expect(option.label).toBe('Alice');
    expect(option.data.twitterHandle).toBe('alice_tweets');
    expect(option.data.id).toBe('g1');
  });

  it('formatGuestOption handles guest without social handles', async () => {
    const { formatGuestOption } = await import(
      '@/components/episodes/GuestSelect'
    );

    const guest = {
      id: 'g2',
      name: 'Bob',
      bio: 'Musician',
    };

    const option = formatGuestOption(guest);

    expect(option.value).toBe('g2');
    expect(option.label).toBe('Bob');
    expect(option.data.twitterHandle).toBeUndefined();
    expect(option.data.instagramHandle).toBeUndefined();
  });
});

describe('GuestSelect', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders the select with placeholder', () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify([]), { status: 200 }),
    );

    render(<GuestSelect onSelect={vi.fn()} selectedIds={[]} />);

    expect(
      screen.getByText('Buscar invitados...'),
    ).toBeInTheDocument();
  });

  it('loads guest options from API with search query', async () => {
    const mockGuests = [
      { id: 'g1', name: 'Alice', bio: 'Comedian', twitterHandle: 'alice' },
      { id: 'g2', name: 'Bob', bio: 'Musician' },
    ];

    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify(mockGuests), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    render(<GuestSelect onSelect={vi.fn()} selectedIds={[]} />);

    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'Ali' } });
    fireEvent.keyDown(input, { key: 'ArrowDown' });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`${API_BASE}/guests?q=Ali`),
        expect.objectContaining({ method: 'GET' }),
      );
    });
  });

  it('shows no options message for short input', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify([]), { status: 200 }),
    );

    render(<GuestSelect onSelect={vi.fn()} selectedIds={[]} />);

    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'A' } });
    fireEvent.keyDown(input, { key: 'ArrowDown' });

    await waitFor(() => {
      expect(
        screen.getByText('Escribe al menos 2 caracteres'),
      ).toBeInTheDocument();
    });
  });
});
