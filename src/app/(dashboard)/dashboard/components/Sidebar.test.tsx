import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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
    render(<Sidebar isOpen={true} onClose={vi.fn()} />);
    const link = screen.getByText('Invitados');
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', '/dashboard/guests');
  });

  it('shows number badge "06" for the Tour Shows item', () => {
    render(<Sidebar isOpen={true} onClose={vi.fn()} />);
    const badges = screen.getAllByText('06');
    expect(badges.length).toBeGreaterThanOrEqual(1);
    expect(badges[0].className).toContain('font-archivo-black');
  });

  it('highlights Invitados when pathname is /dashboard/guests', () => {
    mockUsePathname.mockReturnValue('/dashboard/guests');
    render(<Sidebar isOpen={true} onClose={vi.fn()} />);

    const link = screen.getByText('Invitados').closest('a')!;
    expect(link.className).toContain('bg-black');
    expect(link.className).toContain('text-edn-neon-yellow');
  });

  it('does not highlight Invitados when on a different route', () => {
    mockUsePathname.mockReturnValue('/dashboard/episodes');
    render(<Sidebar isOpen={true} onClose={vi.fn()} />);

    const link = screen.getByText('Invitados').closest('a')!;
    expect(link.className).toContain('bg-white');
  });

  it('renders "Tour Shows" link with href /dashboard/tour-shows', () => {
    render(<Sidebar isOpen={true} onClose={vi.fn()} />);
    const link = screen.getByText('Tour Shows');
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', '/dashboard/tour-shows');
  });

  it('highlights Tour Shows when pathname is /dashboard/tour-shows', () => {
    mockUsePathname.mockReturnValue('/dashboard/tour-shows');
    render(<Sidebar isOpen={true} onClose={vi.fn()} />);

    const link = screen.getByText('Tour Shows').closest('a')!;
    expect(link.className).toContain('bg-black');
    expect(link.className).toContain('text-edn-neon-yellow');
  });

  it('does not highlight Tour Shows when on a different route', () => {
    mockUsePathname.mockReturnValue('/dashboard/users');
    render(<Sidebar isOpen={true} onClose={vi.fn()} />);

    const link = screen.getByText('Tour Shows').closest('a')!;
    expect(link.className).toContain('bg-white');
  });

  // --- Responsive behavior tests ---

  it('renders the close button for mobile', () => {
    render(<Sidebar isOpen={true} onClose={vi.fn()} />);
    const closeButton = screen.getByLabelText('Close sidebar');
    expect(closeButton).toBeInTheDocument();
    expect(closeButton.className).toContain('md:hidden');
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<Sidebar isOpen={true} onClose={onClose} />);
    const closeButton = screen.getByLabelText('Close sidebar');
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders overlay when sidebar is open', () => {
    render(<Sidebar isOpen={true} onClose={vi.fn()} />);
    const overlay = document.querySelector('.bg-black\\/80');
    expect(overlay).toBeInTheDocument();
  });

  it('does not render overlay when sidebar is closed', () => {
    render(<Sidebar isOpen={false} onClose={vi.fn()} />);
    const overlay = document.querySelector('.bg-black\\/80');
    expect(overlay).not.toBeInTheDocument();
  });

  it('calls onClose when overlay is clicked', () => {
    const onClose = vi.fn();
    render(<Sidebar isOpen={true} onClose={onClose} />);
    const overlay = document.querySelector('.bg-black\\/80') as HTMLElement;
    fireEvent.click(overlay);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('applies -translate-x-full when sidebar is closed', () => {
    render(<Sidebar isOpen={false} onClose={vi.fn()} />);
    const aside = document.querySelector('aside');
    expect(aside?.className).toContain('-translate-x-full');
  });

  it('applies translate-x-0 when sidebar is open', () => {
    render(<Sidebar isOpen={true} onClose={vi.fn()} />);
    const aside = document.querySelector('aside');
    expect(aside?.className).toContain('translate-x-0');
  });

  it('has md:relative class for tablet viewport', () => {
    render(<Sidebar isOpen={false} onClose={vi.fn()} />);
    const aside = document.querySelector('aside');
    expect(aside?.className).toContain('md:relative');
  });
});
