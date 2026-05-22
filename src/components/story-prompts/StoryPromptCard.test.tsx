import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import StoryPromptCard from './StoryPromptCard';
import type { StoryPrompt } from '@/types/storyPrompt';

const openPrompt: StoryPrompt = {
  id: 'prompt-1',
  title: 'El Origen del Fuego',
  description: 'Escribí una historia sobre cómo el fuego llegó a la humanidad.',
  isPublic: true,
  isOpen: true,
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
};

const closedPrompt: StoryPrompt = {
  id: 'prompt-2',
  title: 'La Leyenda Perdida',
  description: 'Una historia que ya no acepta más votos.',
  isPublic: true,
  isOpen: false,
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
};

describe('StoryPromptCard', () => {
  it('renders as a link pointing to /stories/{id}', () => {
    render(<StoryPromptCard prompt={openPrompt} index={0} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/stories/prompt-1');
  });

  it('renders open prompt title', () => {
    render(<StoryPromptCard prompt={openPrompt} index={0} />);
    expect(screen.getByText('El Origen del Fuego')).toBeInTheDocument();
  });

  it('renders ABIERTO badge for open prompts', () => {
    render(<StoryPromptCard prompt={openPrompt} index={0} />);
    expect(screen.getByText('ABIERTO')).toBeInTheDocument();
  });

  it('renders CERRADO badge for closed prompts', () => {
    render(<StoryPromptCard prompt={closedPrompt} index={0} />);
    expect(screen.getByText('CERRADO')).toBeInTheDocument();
  });

  it('renders truncated description', () => {
    render(<StoryPromptCard prompt={openPrompt} index={0} />);
    expect(
      screen.getByText(/Escribí una historia sobre cómo el fuego/),
    ).toBeInTheDocument();
  });

  it('calls onClick when provided and card is clicked', () => {
    const onClick = vi.fn();
    render(
      <StoryPromptCard prompt={openPrompt} index={0} onClick={onClick} />,
    );
    const article = screen.getByRole('article');
    fireEvent.click(article);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('has cursor-pointer class for clickability', () => {
    render(<StoryPromptCard prompt={openPrompt} index={0} />);
    const article = screen.getByRole('article');
    expect(article.className).toContain('cursor-pointer');
  });
});
