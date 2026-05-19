import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import NewTourShowPage from './page';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('@/hooks/useCreateTourShow', () => ({
  useCreateTourShow: () => ({
    createTourShow: vi.fn(),
    loading: false,
    error: null,
  }),
}));

describe('NewTourShowPage', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renders the page title "Nuevo Show"', () => {
    render(<NewTourShowPage />);
    expect(screen.getByText('Nuevo Show')).toBeInTheDocument();
  });

  it('renders a "Volver" button', () => {
    render(<NewTourShowPage />);
    expect(screen.getByText('Volver')).toBeInTheDocument();
  });

  it('renders TourShowForm in create mode with form fields', () => {
    render(<NewTourShowPage />);

    expect(screen.getByLabelText(/Ciudad/)).toBeInTheDocument();
    expect(screen.getByLabelText(/País/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Lugar/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Fecha del show/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Estado/)).toBeInTheDocument();
  });

  it('renders "Crear Fecha" submit button', () => {
    render(<NewTourShowPage />);
    expect(screen.getByRole('button', { name: /Crear Fecha/i })).toBeInTheDocument();
  });

  it('does not render delete button in create mode', () => {
    render(<NewTourShowPage />);
    expect(screen.queryByText(/Eliminar/)).not.toBeInTheDocument();
  });
});
