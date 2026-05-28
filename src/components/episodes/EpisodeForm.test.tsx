import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import EpisodeForm from '@/components/episodes/EpisodeForm';

const API_BASE =`${process.env.NEXT_PUBLIC_API_URL_LOCAL}`;

// Mock dependencies
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

vi.mock('@/stores/authStore', () => ({
  useAuthStore: {
    getState: vi.fn(() => ({
      getAccessToken: vi.fn(() => 'test-token'),
    })),
  },
}));

describe('EpisodeForm', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders form fields for episode creation', () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify([]), { status: 200 }),
    );

    render(<EpisodeForm mode="create" />);

    expect(screen.getByLabelText(/título/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/descripción/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /crear episodio/i }),
    ).toBeInTheDocument();
  });

  it('shows Invitados section with GuestSelect', () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify([]), { status: 200 }),
    );

    render(<EpisodeForm mode="create" />);

    expect(screen.getByText('INVITADOS')).toBeInTheDocument();
    expect(
      screen.getByText('Buscar invitados...'),
    ).toBeInTheDocument();
  });

  it('in edit mode, loads existing episode guests', async () => {
    const mockGuests = [
      { id: 'g1', name: 'Alice', bio: 'Comedian', twitterHandle: 'alice' },
    ];

    const mockEpisode = {
      id: 'ep-1',
      episodeNumber: 101,
      title: 'Test Episode',
      description: 'A test episode',
      platformType: 'YOUTUBE' as const,
      publishedAt: '2025-01-01T00:00:00Z',
      isExclusive: false,
      guests: mockGuests,
    };

    // Mock the guests endpoint response
    vi.mocked(fetch).mockImplementation((input) => {
      const url = String(input);
      if (url.includes(`/episodes/ep-1/guests`)) {
        return Promise.resolve(
          new Response(JSON.stringify(mockGuests), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }),
        );
      }
      return Promise.resolve(
        new Response(JSON.stringify([]), { status: 200 }),
      );
    });

    render(<EpisodeForm mode="edit" initialData={mockEpisode} />);

    // Wait for existing guests to load
    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
    });

    // Verify fetch was called for episode guests
    expect(fetch).toHaveBeenCalledWith(
      `${API_BASE}/episodes/ep-1/guests`,
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('shows selected guests with remove buttons', async () => {
    const mockGuests = [
      { id: 'g1', name: 'Alice', bio: 'Comedian' },
      { id: 'g2', name: 'Bob', bio: 'Musician' },
    ];

    const mockEpisode = {
      id: 'ep-1',
      episodeNumber: 101,
      title: 'Test',
      description: 'Test desc',
      platformType: 'YOUTUBE' as const,
      publishedAt: '2025-01-01T00:00:00Z',
      isExclusive: false,
      guests: mockGuests,
    };

    vi.mocked(fetch).mockImplementation((input) => {
      const url = String(input);
      if (url.includes(`/episodes/ep-1/guests`)) {
        return Promise.resolve(
          new Response(JSON.stringify(mockGuests), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }),
        );
      }
      return Promise.resolve(
        new Response(JSON.stringify([]), { status: 200 }),
      );
    });

    render(<EpisodeForm mode="edit" initialData={mockEpisode} />);

    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
    });

    // Both guests should be shown as chips
    expect(screen.getByText('Bob')).toBeInTheDocument();

    // Remove buttons should exist
    const removeButtons = screen.getAllByText('×');
    expect(removeButtons).toHaveLength(2);
  });

  it('removes a guest from selection when X is clicked', async () => {
    const mockGuests = [
      { id: 'g1', name: 'Alice', bio: 'Comedian' },
    ];

    const mockEpisode = {
      id: 'ep-1',
      episodeNumber: 101,
      title: 'Test',
      description: 'Test desc',
      platformType: 'YOUTUBE' as const,
      publishedAt: '2025-01-01T00:00:00Z',
      isExclusive: false,
      guests: mockGuests,
    };

    vi.mocked(fetch).mockImplementation((input) => {
      const url = String(input);
      if (url.includes(`/episodes/ep-1/guests`)) {
        return Promise.resolve(
          new Response(JSON.stringify(mockGuests), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }),
        );
      }
      return Promise.resolve(
        new Response(JSON.stringify([]), { status: 200 }),
      );
    });

    render(<EpisodeForm mode="edit" initialData={mockEpisode} />);

    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
    });

    // Click the remove button
    const removeButton = screen.getByText('×');
    fireEvent.click(removeButton);

    // Alice should be removed from the display
    await waitFor(() => {
      expect(screen.queryByText('Alice')).not.toBeInTheDocument();
    });
  });
});
