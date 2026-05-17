import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Navigation from '@/components/header/Navigation';

describe('Navigation', () => {
  it('renders a nav element', () => {
    render(<Navigation />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders all 7 navigation links', () => {
    render(<Navigation />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(7);
  });

  it('renders each link with correct label and href', () => {
    render(<Navigation />);
    const expectedLinks = [
      { label: 'Inicio', href: '/' },
      { label: 'Tour', href: '/#tour-carousel' },
      { label: 'Episodios', href: '/#episodes' },
      { label: 'Ver Todos', href: '/all-episodes' },
      { label: 'Bromas Internas', href: '/bromas' },
      { label: 'Historias', href: '/historias' },
      { label: 'Login', href: '/login' },
    ];

    for (const { label, href } of expectedLinks) {
      const link = screen.getByRole('link', { name: label });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', href);
    }
  });

  it('renders Login link with distinguishing attribute', () => {
    render(<Navigation />);
    const loginLink = screen.getByTestId('nav-login');
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveTextContent('Login');
    expect(loginLink).toHaveAttribute('href', '/login');
  });
});
