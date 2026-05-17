import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Navigation from '@/components/header/Navigation';

describe('Navigation', () => {
  it('renders a nav element', () => {
    render(<Navigation />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders all 6 navigation links', () => {
    render(<Navigation />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(6);
  });

  it('renders each link with correct label and href', () => {
    render(<Navigation />);
    const expectedLinks = [
      { label: 'Inicio', href: '/' },
      { label: 'Tour', href: '/tour' },
      { label: 'Episodios', href: '/episodios' },
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
