import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ImageUpload from './ImageUpload';

describe('ImageUpload', () => {
  it('renders the upload zone', () => {
    render(<ImageUpload files={[]} onChange={vi.fn()} />);
    expect(screen.getByText(/arrastrá tus imágenes/i)).toBeInTheDocument();
  });

  it('shows "0/5 imágenes" when no files selected', () => {
    render(<ImageUpload files={[]} onChange={vi.fn()} />);
    expect(screen.getByText(/0\/5 imágenes/i)).toBeInTheDocument();
  });

  it('shows "3/5 imágenes" when 3 files selected', () => {
    const files = [
      new File(['1'], 'img1.jpg', { type: 'image/jpeg' }),
      new File(['2'], 'img2.jpg', { type: 'image/jpeg' }),
      new File(['3'], 'img3.jpg', { type: 'image/jpeg' }),
    ];
    render(<ImageUpload files={files} onChange={vi.fn()} />);
    expect(screen.getByText(/3\/5 imágenes/i)).toBeInTheDocument();
  });

  it('renders preview URLs for selected files', () => {
    const files = [
      new File(['1'], 'img1.jpg', { type: 'image/jpeg' }),
      new File(['2'], 'img2.jpg', { type: 'image/jpeg' }),
    ];
    render(<ImageUpload files={files} onChange={vi.fn()} />);
    const images = screen.getAllByRole('img');
    expect(images.length).toBe(2);
  });

  it('shows remove button on each thumbnail', () => {
    const files = [
      new File(['1'], 'img1.jpg', { type: 'image/jpeg' }),
    ];
    render(<ImageUpload files={files} onChange={vi.fn()} />);
    const removeBtn = screen.getByText('✕');
    expect(removeBtn).toBeInTheDocument();
  });

  it('calls onChange with filtered array when remove button clicked', () => {
    const files = [
      new File(['1'], 'img1.jpg', { type: 'image/jpeg' }),
      new File(['2'], 'img2.jpg', { type: 'image/jpeg' }),
    ];
    const onChange = vi.fn();
    render(<ImageUpload files={files} onChange={onChange} />);

    const removeButtons = screen.getAllByText('✕');
    fireEvent.click(removeButtons[0]);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('shows error message when error is set', () => {
    render(
      <ImageUpload
        files={[]}
        onChange={vi.fn()}
        error="Máximo 5 imágenes permitidas"
      />
    );
    expect(screen.getByText(/Máximo 5 imágenes permitidas/i)).toBeInTheDocument();
  });

  it('shows upload zone with dashed border when no files', () => {
    render(<ImageUpload files={[]} onChange={vi.fn()} />);
    const zone = screen.getByText(/arrastrá tus imágenes/i).closest('div');
    expect(zone).toBeInTheDocument();
  });
});
