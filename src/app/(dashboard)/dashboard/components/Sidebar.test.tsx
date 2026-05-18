import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Sidebar from './Sidebar';

const { mockUsePathname, mockPush } = vi.hoisted(() => ({
  mockUsePathname: vi.fn(() => '/'),
  mockPush: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: mockUsePathname,
  useSearchParams: () => new URLSearchParams(),
}));

describe('Sidebar', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/');
    mockPush.mockClear();
  });

  it('renders "Invitados" link with href /dashboard/guests', () => {
    render(<Sidebar />);
    const link = screen.getByText('Invitados');
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', '/dashboard/guests');
  });

  it('shows number badge "06" for the Invitados item', () => {
    render(<Sidebar />);
    const badge = screen.getByText('06');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('font-archivo-black');
  });

  it('highlights Invitados when pathname is /dashboard/guests', () => {
    mockUsePathname.mockReturnValue('/dashboard/guests');
    render(<Sidebar />);

    const link = screen.getByText('Invitados').closest('a')!;
    expect(link.className).toContain('bg-black');
    expect(link.className).toContain('text-[#f9c937]');
  });

  it('does not highlight Invitados when on a different route', () => {
    mockUsePathname.mockReturnValue('/dashboard/episodes');
    render(<Sidebar />);

    const link = screen.getByText('Invitados').closest('a')!;
    expect(link.className).toContain('bg-white');
  });
});
