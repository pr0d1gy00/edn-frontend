import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserForm from './UserForm';
import type { User } from '@/types/user';

const mockPush = vi.fn();
const mockCreateUser = vi.fn();
const mockUpdateUser = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('@/hooks/useCreateUser', () => ({
  useCreateUser: () => ({
    createUser: mockCreateUser,
    loading: false,
    error: null,
  }),
}));

vi.mock('@/hooks/useUpdateUser', () => ({
  useUpdateUser: () => ({
    updateUser: mockUpdateUser,
    loading: false,
    error: null,
  }),
}));

const baseUser: User = {
  id: 'user-1',
  email: 'edit@example.com',
  username: 'Existing User',
  role: 'USER',
};

describe('UserForm — create mode', () => {
  beforeEach(() => {
    mockPush.mockReset();
    mockCreateUser.mockReset();
    mockUpdateUser.mockReset();
  });

  it('renders create form fields: email, username, password, role', () => {
    render(<UserForm mode="create" />);

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Rol/i)).toBeInTheDocument();
  });

  it('renders "Crear usuario" submit button in create mode', () => {
    render(<UserForm mode="create" />);
    expect(screen.getByRole('button', { name: /Crear usuario/i })).toBeInTheDocument();
  });

  it('shows validation error for empty email on submit', async () => {
    render(<UserForm mode="create" />);

    fireEvent.click(screen.getByRole('button', { name: /Crear usuario/i }));

    await waitFor(() => {
      expect(screen.getByText(/email es requerido/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid email format', async () => {
    render(<UserForm mode="create" />);

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByRole('button', { name: /Crear usuario/i }));

    await waitFor(() => {
      expect(screen.getByText(/Email inválido/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for username shorter than 2 characters', async () => {
    render(<UserForm mode="create" />);

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/Usuario/i), { target: { value: 'A' } });
    fireEvent.click(screen.getByRole('button', { name: /Crear usuario/i }));

    await waitFor(() => {
      expect(screen.getByText(/usuario debe tener entre 2 y 50 caracteres/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for username longer than 50 characters', async () => {
    render(<UserForm mode="create" />);

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/Usuario/i), {
      target: { value: 'A'.repeat(51) },
    });
    fireEvent.click(screen.getByRole('button', { name: /Crear usuario/i }));

    await waitFor(() => {
      expect(screen.getByText(/usuario debe tener entre 2 y 50 caracteres/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for password shorter than 6 characters in create mode', async () => {
    render(<UserForm mode="create" />);

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/Usuario/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: '12345' } });
    fireEvent.click(screen.getByRole('button', { name: /Crear usuario/i }));

    await waitFor(() => {
      expect(screen.getByText(/contraseña debe tener al menos 6 caracteres/i)).toBeInTheDocument();
    });
  });

  it('calls createUser and navigates on successful submit', async () => {
    mockCreateUser.mockResolvedValue({ id: 'new-1', email: 'new@test.com', username: 'newuser', role: 'USER' });

    render(<UserForm mode="create" />);

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'new@test.com' } });
    fireEvent.change(screen.getByLabelText(/Usuario/i), { target: { value: 'newuser' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Crear usuario/i }));

    await waitFor(() => {
      expect(mockCreateUser).toHaveBeenCalledWith({
        email: 'new@test.com',
        username: 'newuser',
        password: 'password123',
        role: 'USER',
      });
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard/users');
    });
  });

  it('displays API error when createUser hook returns error', () => {
    // Remock the hook to return an error
    vi.doMock('@/hooks/useCreateUser', () => ({
      useCreateUser: () => ({
        createUser: vi.fn(),
        loading: false,
        error: 'Error al crear usuario',
      }),
    }));
  });
});

describe('UserForm — edit mode', () => {
  beforeEach(() => {
    mockPush.mockReset();
    mockCreateUser.mockReset();
    mockUpdateUser.mockReset();
  });

  it('pre-fills form with initialData in edit mode', () => {
    render(<UserForm mode="edit" initialData={baseUser} />);

    expect(screen.getByLabelText(/Email/i)).toHaveValue('edit@example.com');
    expect(screen.getByLabelText(/Usuario/i)).toHaveValue('Existing User');
    expect(screen.getByLabelText(/Rol/i)).toHaveValue('USER');
  });

  it('hides password field in edit mode', () => {
    render(<UserForm mode="edit" initialData={baseUser} />);

    expect(screen.queryByLabelText(/Contraseña/i)).not.toBeInTheDocument();
  });

  it('renders "Guardar cambios" submit button in edit mode', () => {
    render(<UserForm mode="edit" initialData={baseUser} />);

    expect(screen.getByRole('button', { name: /Guardar cambios/i })).toBeInTheDocument();
  });

  it('calls updateUser and navigates on successful submit in edit mode', async () => {
    mockUpdateUser.mockResolvedValue({ id: 'user-1', email: 'updated@test.com', username: 'Updated', role: 'ADMIN' });

    render(<UserForm mode="edit" initialData={baseUser} />);

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'updated@test.com' } });
    fireEvent.click(screen.getByRole('button', { name: /Guardar cambios/i }));

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith('user-1', {
        email: 'updated@test.com',
        username: 'Existing User',
        role: 'USER',
      });
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard/users');
    });
  });

  it('shows "Cancelar" button that navigates back', () => {
    render(<UserForm mode="create" />);

    fireEvent.click(screen.getByText('Cancelar'));
    expect(mockPush).toHaveBeenCalledWith('/dashboard/users');
  });
});
