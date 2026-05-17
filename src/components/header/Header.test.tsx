import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from '@/components/header/Header';

describe('Header', () => {
  it('renders a header element', () => {
    render(<Header />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('renders the EDN logo as a link to home', () => {
    render(<Header />);
    // Logo link has image with alt="EDN Logo"
    const logoLink = screen.getByRole('link', { name: 'EDN Logo' });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('contains navigation links from Navigation component', () => {
    render(<Header />);
    // Verify Navigation is rendered by checking its links are present
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    const links = screen.getAllByRole('link');
    // Logo (EDN) + 6 nav links = 7 total
    expect(links).toHaveLength(7);
  });
});