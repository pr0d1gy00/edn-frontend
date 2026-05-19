import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TourShowForm from './TourShowForm';
import type { TourShow } from '@/types/tourShow';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockCreateTourShow = vi.fn();

vi.mock('@/hooks/useCreateTourShow', () => ({
  useCreateTourShow: () => ({
    createTourShow: mockCreateTourShow,
    loading: false,
    error: null,
  }),
}));

const mockUpdateTourShow = vi.fn();

vi.mock('@/hooks/useUpdateTourShow', () => ({
  useUpdateTourShow: () => ({
    updateTourShow: mockUpdateTourShow,
    loading: false,
    error: null,
  }),
}));

const baseShow: TourShow = {
  id: 'show-edit-1',
  city: 'Buenos Aires',
  country: 'Argentina',
  venueName: 'Estadio Monumental',
  showDate: '2025-08-15T20:00',
  ticketUrl: 'https://tickets.example.com',
  ticketStatus: 'AVAILABLE',
  latitude: -34.545,
  longitude: -58.449,
  images: [],
};

describe('TourShowForm — create mode', () => {
  beforeEach(() => {
    mockPush.mockReset();
    mockCreateTourShow.mockReset();
    mockUpdateTourShow.mockReset();
  });

  it('renders all form fields in create mode', () => {
    render(<TourShowForm mode="create" />);

    expect(screen.getByLabelText(/Ciudad/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/País/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Lugar/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Fecha del show/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ticket URL/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Estado/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Latitud/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Longitud/i)).toBeInTheDocument();
  });

  it('renders "Crear Fecha" submit button in create mode', () => {
    render(<TourShowForm mode="create" />);
    expect(screen.getByRole('button', { name: /Crear Fecha/i })).toBeInTheDocument();
  });

  it('shows validation errors for required fields on empty submit', async () => {
    render(<TourShowForm mode="create" />);

    fireEvent.click(screen.getByRole('button', { name: /Crear Fecha/i }));

    await waitFor(() => {
      expect(screen.getByText(/ciudad es requerida/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/país es requerido/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/lugar es requerido/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/fecha del show es requerida/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/estado es requerido/i)).toBeInTheDocument();
    });
  });

  it('shows validation error when latitude is not a valid number', async () => {
    render(<TourShowForm mode="create" />);

    fireEvent.change(screen.getByLabelText(/Latitud/i), { target: { value: 'abc' } });
    fireEvent.click(screen.getByRole('button', { name: /Crear Fecha/i }));

    await waitFor(() => {
      expect(screen.getByText(/latitud debe ser un número válido/i)).toBeInTheDocument();
    });
  });

  it('shows validation error when longitude is not a valid number', async () => {
    render(<TourShowForm mode="create" />);

    fireEvent.change(screen.getByLabelText(/Longitud/i), { target: { value: 'xyz' } });
    fireEvent.click(screen.getByRole('button', { name: /Crear Fecha/i }));

    await waitFor(() => {
      expect(screen.getByText(/longitud debe ser un número válido/i)).toBeInTheDocument();
    });
  });

  it('calls createTourShow with FormData on valid submit', async () => {
    mockCreateTourShow.mockResolvedValue({ id: 'new-show', city: 'Santiago', country: 'Chile', venueName: 'Estadio Nacional', showDate: '2025-09-01T20:00', ticketStatus: 'AVAILABLE', ticketUrl: 'https://example.com', images: [] });

    render(<TourShowForm mode="create" />);

    fireEvent.change(screen.getByLabelText(/Ciudad/i), { target: { value: 'Santiago' } });
    fireEvent.change(screen.getByLabelText(/País/i), { target: { value: 'Chile' } });
    fireEvent.change(screen.getByLabelText(/Lugar/i), { target: { value: 'Estadio Nacional' } });
    fireEvent.change(screen.getByLabelText(/Fecha del show/i), { target: { value: '2025-09-01T20:00' } });
    fireEvent.change(screen.getByLabelText(/Ticket URL/i), { target: { value: 'https://tickets.cl' } });
    fireEvent.change(screen.getByLabelText(/Estado/i), { target: { value: 'AVAILABLE' } });

    fireEvent.click(screen.getByRole('button', { name: /Crear Fecha/i }));

    await waitFor(() => {
      expect(mockCreateTourShow).toHaveBeenCalledTimes(1);
    });

    const formData = mockCreateTourShow.mock.calls[0][0];
    expect(formData).toBeInstanceOf(FormData);
    expect(formData.get('city')).toBe('Santiago');
    expect(formData.get('country')).toBe('Chile');
    expect(formData.get('venueName')).toBe('Estadio Nacional');
    expect(formData.get('showDate')).toBe('2025-09-01T20:00');
    expect(formData.get('ticketUrl')).toBe('https://tickets.cl');
    expect(formData.get('ticketStatus')).toBe('AVAILABLE');
  });

  it('navigates to tour shows list on successful create', async () => {
    mockCreateTourShow.mockResolvedValue({ id: 'new-show', city: 'Lima', country: 'Perú', venueName: 'Estadio Nacional', showDate: '2025-10-01T20:00', ticketStatus: 'AVAILABLE', ticketUrl: 'https://tickets.pe', images: [] });

    render(<TourShowForm mode="create" />);

    fireEvent.change(screen.getByLabelText(/Ciudad/i), { target: { value: 'Lima' } });
    fireEvent.change(screen.getByLabelText(/País/i), { target: { value: 'Perú' } });
    fireEvent.change(screen.getByLabelText(/Lugar/i), { target: { value: 'Estadio Nacional' } });
    fireEvent.change(screen.getByLabelText(/Fecha del show/i), { target: { value: '2025-10-01T20:00' } });
    fireEvent.change(screen.getByLabelText(/Ticket URL/i), { target: { value: 'https://tickets.pe' } });
    fireEvent.change(screen.getByLabelText(/Estado/i), { target: { value: 'AVAILABLE' } });

    fireEvent.click(screen.getByRole('button', { name: /Crear Fecha/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard/tour-shows');
    });
  });

  it('shows "Cancelar" button that navigates back', () => {
    render(<TourShowForm mode="create" />);

    fireEvent.click(screen.getByText('Cancelar'));
    expect(mockPush).toHaveBeenCalledWith('/dashboard/tour-shows');
  });
});

describe('TourShowForm — edit mode', () => {
  beforeEach(() => {
    mockPush.mockReset();
    mockCreateTourShow.mockReset();
    mockUpdateTourShow.mockReset();
  });

  it('pre-fills form fields with initialData in edit mode', () => {
    render(<TourShowForm mode="edit" initialData={baseShow} />);

    expect(screen.getByLabelText(/Ciudad/i)).toHaveValue('Buenos Aires');
    expect(screen.getByLabelText(/País/i)).toHaveValue('Argentina');
    expect(screen.getByLabelText(/Lugar/i)).toHaveValue('Estadio Monumental');
    expect(screen.getByLabelText(/Latitud/i)).toHaveValue('-34.545');
    expect(screen.getByLabelText(/Longitud/i)).toHaveValue('-58.449');
  });

  it('renders "Guardar cambios" submit button in edit mode', () => {
    render(<TourShowForm mode="edit" initialData={baseShow} />);
    expect(screen.getByRole('button', { name: /Guardar cambios/i })).toBeInTheDocument();
  });

  it('calls updateTourShow with id and FormData on valid submit in edit mode', async () => {
    mockUpdateTourShow.mockResolvedValue({ id: 'show-edit-1', city: 'Montevideo', country: 'Uruguay', venueName: 'Estadio Centenario', showDate: '2025-11-01T20:00', ticketStatus: 'FEW_TICKETS', ticketUrl: 'https://tickets.uy', images: [] });

    render(<TourShowForm mode="edit" initialData={baseShow} />);

    fireEvent.change(screen.getByLabelText(/Ciudad/i), { target: { value: 'Montevideo' } });
    fireEvent.change(screen.getByLabelText(/País/i), { target: { value: 'Uruguay' } });

    fireEvent.click(screen.getByRole('button', { name: /Guardar cambios/i }));

    await waitFor(() => {
      expect(mockUpdateTourShow).toHaveBeenCalledWith('show-edit-1', expect.any(FormData));
    });
  });

  it('navigates to tour shows list on successful update', async () => {
    mockUpdateTourShow.mockResolvedValue({ id: 'show-edit-1', city: 'Montevideo', country: 'Uruguay', venueName: 'Estadio Centenario', showDate: '2025-11-01T20:00', ticketStatus: 'FEW_TICKETS', ticketUrl: 'https://tickets.uy', images: [] });

    render(<TourShowForm mode="edit" initialData={baseShow} />);

    fireEvent.click(screen.getByRole('button', { name: /Guardar cambios/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard/tour-shows');
    });
  });
});
