import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import StoriesList from './StoriesList';
import type { Story } from '@/types/storyPrompt';

const mockStory: Story = {
  id: 'story-1',
  title: 'El origen del fuego',
  content: 'Hace mucho tiempo...',
  authorId: 'user-1',
  promptId: 'prompt-1',
  isApproved: true,
  createdAt: '2025-01-15T10:00:00Z',
  updatedAt: '2025-01-15T10:00:00Z',
};

const mockStory2: Story = {
  id: 'story-2',
  title: 'La leyenda del río',
  content: 'En el principio...',
  authorId: 'user-2',
  promptId: 'prompt-1',
  isApproved: true,
  createdAt: '2025-01-16T10:00:00Z',
  updatedAt: '2025-01-16T10:00:00Z',
};

const mockStoryDifferentPrompt: Story = {
  id: 'story-3',
  title: 'Otra historia',
  content: 'Contenido diferente...',
  authorId: 'user-3',
  promptId: 'prompt-2',
  isApproved: true,
  createdAt: '2025-01-17T10:00:00Z',
  updatedAt: '2025-01-17T10:00:00Z',
};

const originalFetch = globalThis.fetch;

function mockFetchResponse(data: unknown) {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(data),
  });
}

beforeEach(() => {
  globalThis.fetch = originalFetch;
});

describe('StoriesList', () => {
  it('shows loading skeleton while fetching stories', () => {
    globalThis.fetch = vi.fn().mockImplementation(
      () => new Promise(() => {}), // never resolves
    );
    render(<StoriesList promptId="prompt-1" />);
    expect(screen.getByTestId('stories-loading')).toBeInTheDocument();
  });

  it('renders stories filtered by promptId', async () => {
    mockFetchResponse({
      data: [mockStory, mockStory2, mockStoryDifferentPrompt],
      meta: { page: 1, limit: 10, total: 3, totalPages: 1 },
    });
    render(<StoriesList promptId="prompt-1" />);

    await waitFor(() => {
      expect(screen.getByText('El origen del fuego')).toBeInTheDocument();
    });
    expect(screen.getByText('La leyenda del río')).toBeInTheDocument();
    // story-3 has prompt-2, should not appear
    expect(screen.queryByText('Otra historia')).not.toBeInTheDocument();
  });

  it('renders empty state when no stories match the prompt', async () => {
    mockFetchResponse({
      data: [mockStoryDifferentPrompt],
      meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
    });
    render(<StoriesList promptId="prompt-1" />);

    await waitFor(() => {
      expect(screen.getByText(/no hay historias/i)).toBeInTheDocument();
    });
  });

  it('renders error state when fetch fails', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
    });
    render(<StoriesList promptId="prompt-1" />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('renders story content preview in each card', async () => {
    mockFetchResponse({
      data: [mockStory],
      meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
    });
    render(<StoriesList promptId="prompt-1" />);

    await waitFor(() => {
      // Story title should appear
      expect(screen.getByText('El origen del fuego')).toBeInTheDocument();
      // Content preview should be truncated
      expect(screen.getByText(/Hace mucho tiempo/)).toBeInTheDocument();
    });
  });

  it('renders long content truncated with ellipsis', async () => {
    const longStory: Story = {
      id: 'story-long',
      title: 'La historia interminable',
      content:
        'A'.repeat(300) +
        ' texto que será cortado porque excede el límite de caracteres visibles en la tarjeta de presentación',
      authorId: 'user-4',
      promptId: 'prompt-1',
      isApproved: true,
    };
    mockFetchResponse({
      data: [longStory],
      meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
    });
    render(<StoriesList promptId="prompt-1" />);

    await waitFor(() => {
      const textElement = screen.getByText(/…$/);
      expect(textElement).toBeInTheDocument();
      // The displayed text should be shorter than the original
      expect(textElement.textContent!.length).toBeLessThan(200);
    });
  });

  it('applies limit prop to restrict visible stories', async () => {
    mockFetchResponse({
      data: [mockStory, mockStory2],
      meta: { page: 1, limit: 10, total: 2, totalPages: 1 },
    });
    render(<StoriesList promptId="prompt-1" limit={1} />);

    await waitFor(() => {
      expect(screen.getByText('El origen del fuego')).toBeInTheDocument();
    });
    // Only one story should render
    expect(screen.queryByText('La leyenda del río')).not.toBeInTheDocument();
  });
});
