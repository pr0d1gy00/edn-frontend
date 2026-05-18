import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GuestForm from './GuestForm';

// Mock the hooks
vi.mock('@/hooks/useCreateGuest', () => ({
  useCreateGuest: vi.fn(),
}));

vi.mock('@/hooks/useUpdateGuest', () => ({
  useUpdateGuest: vi.fn(),
}));

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

import { useCreateGuest } from '@/hooks/useCreateGuest';
import { useUpdateGuest } from '@/hooks/useUpdateGuest';

describe('GuestForm', () => {
  const mockCreateGuest = vi.fn();
  const mockUpdateGuest = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockPush.mockClear();
    (useCreateGuest as ReturnType<typeof vi.fn>).mockReturnValue({
      createGuest: mockCreateGuest,
      loading: false,
      error: null,
    });
    (useUpdateGuest as ReturnType<typeof vi.fn>).mockReturnValue({
      updateGuest: mockUpdateGuest,
      loading: false,
      error: null,
    });
  });

  describe('Rendering', () => {
    it('renders name input field', () => {
      render(<GuestForm mode="create" />);
      const nameInput = screen.getByLabelText(/Nombre/i);
      expect(nameInput).toBeInTheDocument();
    });

    it('renders bio textarea', () => {
      render(<GuestForm mode="create" />);
      expect(screen.getByLabelText(/Bio/i)).toBeInTheDocument();
    });

    it('renders twitter handle input', () => {
      render(<GuestForm mode="create" />);
      expect(screen.getByLabelText(/Twitter/i)).toBeInTheDocument();
    });

    it('renders instagram handle input', () => {
      render(<GuestForm mode="create" />);
      expect(screen.getByLabelText(/Instagram/i)).toBeInTheDocument();
    });

    it('shows "Crear invitado" button in create mode', () => {
      render(<GuestForm mode="create" />);
      expect(screen.getByText('Crear invitado')).toBeInTheDocument();
    });

    it('shows "Guardar cambios" button in edit mode', () => {
      render(<GuestForm mode="edit" />);
      expect(screen.getByText('Guardar cambios')).toBeInTheDocument();
    });

    it('pre-fills form fields when initialData is provided', () => {
      const guest = {
        id: 'g1',
        name: 'Juan Perez',
        bio: 'Test bio',
        twitterHandle: 'juanperez',
        instagramHandle: 'juanperezok',
      };
      render(<GuestForm mode="edit" initialData={guest} />);
      expect((screen.getByLabelText(/Nombre/i) as HTMLInputElement).value).toBe('Juan Perez');
      expect((screen.getByLabelText(/Bio/i) as HTMLTextAreaElement).value).toBe('Test bio');
      expect((screen.getByLabelText(/Twitter/i) as HTMLInputElement).value).toBe('juanperez');
      expect((screen.getByLabelText(/Instagram/i) as HTMLInputElement).value).toBe('juanperezok');
    });
  });

  describe('Validation', () => {
    it('shows error when name is empty on submit', async () => {
      render(<GuestForm mode="create" />);
      const form = document.querySelector('form')!;
      fireEvent.submit(form);
      await waitFor(() => {
        expect(screen.getByText('El nombre es requerido')).toBeInTheDocument();
      });
    });

    it('shows error when name is too short (less than 2 chars)', async () => {
      render(<GuestForm mode="create" />);
      fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'A' } });
      fireEvent.click(screen.getByText('Crear invitado'));
      await waitFor(() => {
        expect(screen.getByText(/nombre debe tener entre 2 y 50/)).toBeInTheDocument();
      });
    });

    it('shows error when name is too long (more than 50 chars)', async () => {
      render(<GuestForm mode="create" />);
      fireEvent.change(screen.getByLabelText(/Nombre/i), {
        target: { value: 'A'.repeat(51) },
      });
      fireEvent.click(screen.getByText('Crear invitado'));
      await waitFor(() => {
        expect(screen.getByText(/nombre debe tener entre 2 y 50/)).toBeInTheDocument();
      });
    });

    it('shows error when bio exceeds 500 characters', async () => {
      render(<GuestForm mode="create" />);
      fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Valid Name' } });
      fireEvent.change(screen.getByLabelText(/Bio/i), {
        target: { value: 'A'.repeat(501) },
      });
      fireEvent.click(screen.getByText('Crear invitado'));
      await waitFor(() => {
        expect(screen.getByText(/bio no puede exceder 500/)).toBeInTheDocument();
      });
    });

    it('shows error when twitterHandle has invalid characters', async () => {
      render(<GuestForm mode="create" />);
      fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Valid Name' } });
      fireEvent.change(screen.getByLabelText(/Twitter/i), { target: { value: '@invalid-handle' } });
      fireEvent.click(screen.getByText('Crear invitado'));
      await waitFor(() => {
        expect(screen.getByText(/solo letras, números y guiones bajos/i)).toBeInTheDocument();
      });
    });

    it('shows error when instagramHandle has invalid characters', async () => {
      render(<GuestForm mode="create" />);
      fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Valid Name' } });
      fireEvent.change(screen.getByLabelText(/Instagram/i), { target: { value: 'bad.handle' } });
      fireEvent.click(screen.getByText('Crear invitado'));
      await waitFor(() => {
        expect(screen.getByText(/solo letras, números y guiones bajos/i)).toBeInTheDocument();
      });
    });
  });

  describe('Submission', () => {
    it('calls createGuest with form data when mode is create and form is valid', async () => {
      mockCreateGuest.mockResolvedValueOnce({ id: 'new-1', name: 'Test User', bio: '' });
      render(<GuestForm mode="create" />);
      fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Test User' } });
      fireEvent.click(screen.getByText('Crear invitado'));

      await waitFor(() => {
        expect(mockCreateGuest).toHaveBeenCalledWith({
          name: 'Test User',
          bio: undefined,
          twitterHandle: undefined,
          instagramHandle: undefined,
        });
      });
    });

    it('calls updateGuest with form data when mode is edit and form is valid', async () => {
      mockUpdateGuest.mockResolvedValueOnce({ id: 'g1', name: 'Updated', bio: '' });
      render(
        <GuestForm
          mode="edit"
          initialData={{ id: 'g1', name: 'Original', bio: '', twitterHandle: 'orig', instagramHandle: 'origok' }}
        />
      );
      fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Updated' } });
      fireEvent.click(screen.getByText('Guardar cambios'));

      await waitFor(() => {
        expect(mockUpdateGuest).toHaveBeenCalledWith('g1', {
          name: 'Updated',
          bio: undefined,
          twitterHandle: 'orig',
          instagramHandle: 'origok',
        });
      });
    });

    it('redirects to /dashboard/guests on successful create', async () => {
      mockCreateGuest.mockResolvedValueOnce({ id: 'new-1', name: 'Test', bio: '' });
      render(<GuestForm mode="create" />);
      fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Test' } });
      fireEvent.click(screen.getByText('Crear invitado'));

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard/guests');
      });
    });

    it('redirects to /dashboard/guests on successful edit', async () => {
      mockUpdateGuest.mockResolvedValueOnce({ id: 'g1', name: 'Updated', bio: '' });
      render(
        <GuestForm
          mode="edit"
          initialData={{ id: 'g1', name: 'Original', bio: '' }}
        />
      );
      fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Updated' } });
      fireEvent.click(screen.getByText('Guardar cambios'));

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard/guests');
      });
    });

    it('shows API error when submission fails', async () => {
      mockCreateGuest.mockResolvedValueOnce(null);
      (useCreateGuest as ReturnType<typeof vi.fn>).mockReturnValue({
        createGuest: mockCreateGuest,
        loading: false,
        error: 'Error creating guest',
      });
      render(<GuestForm mode="create" />);
      fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Test' } });
      fireEvent.click(screen.getByText('Crear invitado'));

      await waitFor(() => {
        expect(screen.getByText('Error creating guest')).toBeInTheDocument();
      });
    });

    it('shows loading state on submit button while submitting', async () => {
      (useCreateGuest as ReturnType<typeof vi.fn>).mockReturnValue({
        createGuest: mockCreateGuest,
        loading: true,
        error: null,
      });
      render(<GuestForm mode="create" />);
      expect(screen.getByText(/Creando/i)).toBeInTheDocument();
    });
  });
});
