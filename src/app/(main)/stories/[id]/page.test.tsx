import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import StoryPromptDetailPage from './page';

const mockBack = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ back: mockBack }),
  useParams: () => ({ id: 'prompt-1' }),
}));

const mockPrompt = {
  id: 'prompt-1',
  title: 'El Origen del Fuego',
  description:
    'Escribí una historia sobre cómo el fuego llegó a la humanidad. Explorá mitos, leyendas y creencias ancestrales.',
  isPublic: true,
  isOpen: true,
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-15T00:00:00Z',
};

const mockStoriesResponse = {
  data: [],
  meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
};

const originalFetch = globalThis.fetch;

function mockFetchResponses(promptData: unknown, storiesData: unknown) {
  let callCount = 0;
  globalThis.fetch = vi.fn().mockImplementation(() => {
    callCount++;
    if (callCount === 1) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(promptData),
      });
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(storiesData),
    });
  });
}

beforeEach(() => {
  globalThis.fetch = originalFetch;
  mockBack.mockClear();
});

describe('StoryPromptDetailPage', () => {
  it('shows loading state while fetching', () => {
    globalThis.fetch = vi
      .fn()
      .mockImplementation(() => new Promise(() => {})); // never resolves
    render(<StoryPromptDetailPage />);
    expect(screen.getByTestId('detail-loading')).toBeInTheDocument();
  });

  it('renders prompt title on successful fetch', async () => {
    mockFetchResponses(mockPrompt, mockStoriesResponse);
    render(<StoryPromptDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('El Origen del Fuego')).toBeInTheDocument();
    });
  });

  it('renders ABIERTO badge when prompt is open', async () => {
    mockFetchResponses(mockPrompt, mockStoriesResponse);
    render(<StoryPromptDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('ABIERTO')).toBeInTheDocument();
    });
  });

  it('renders CERRADO badge when prompt is closed', async () => {
    mockFetchResponses(
      { ...mockPrompt, isOpen: false },
      mockStoriesResponse,
    );
    render(<StoryPromptDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('CERRADO')).toBeInTheDocument();
    });
  });

  it('renders full description text', async () => {
    mockFetchResponses(mockPrompt, mockStoriesResponse);
    render(<StoryPromptDetailPage />);

    await waitFor(() => {
      expect(
        screen.getByText(/cómo el fuego llegó a la humanidad/),
      ).toBeInTheDocument();
    });
  });

  it('renders back navigation link', async () => {
    mockFetchResponses(mockPrompt, mockStoriesResponse);
    render(<StoryPromptDetailPage />);

    await waitFor(() => {
      const backLink = screen.getByText(/volver a historias/i);
      expect(backLink).toBeInTheDocument();
      expect(backLink.closest('a')).toHaveAttribute('href', '/stories');
    });
  });

  it('renders error state on fetch failure', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: false });
    render(<StoryPromptDetailPage />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('renders stories section heading when prompt loaded', async () => {
    mockFetchResponses(mockPrompt, mockStoriesResponse);
    render(<StoryPromptDetailPage />);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Historias' }),
      ).toBeInTheDocument();
    });
  });
});
