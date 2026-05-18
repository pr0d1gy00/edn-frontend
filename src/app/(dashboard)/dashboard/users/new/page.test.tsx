import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import NewUserPage from './page';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('@/hooks/useCreateUser', () => ({
  useCreateUser: () => ({
    createUser: vi.fn(),
    loading: false,
    error: null,
  }),
}));

describe('NewUserPage', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renders the page title "Nuevo Usuario"', () => {
    render(<NewUserPage />);
    expect(screen.getByText('Nuevo Usuario')).toBeInTheDocument();
  });

  it('renders a "Volver" button', () => {
    render(<NewUserPage />);
    expect(screen.getByText('Volver')).toBeInTheDocument();
  });

  it('renders UserForm in create mode with email, username, password fields', () => {
    render(<NewUserPage />);

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Rol/i)).toBeInTheDocument();
  });

  it('renders "Crear usuario" submit button', () => {
    render(<NewUserPage />);
    expect(screen.getByRole('button', { name: /Crear usuario/i })).toBeInTheDocument();
  });
});
