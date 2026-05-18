import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SelectedGuests from '@/components/episodes/SelectedGuests';

const mockGuests = [
  {
    id: 'g1',
    name: 'Alice',
    bio: 'Comedian',
    twitterHandle: 'alice_tweets',
    instagramHandle: 'alice_ig',
  },
  {
    id: 'g2',
    name: 'Bob',
    bio: 'Musician',
  },
];

describe('SelectedGuests', () => {
  it('renders nothing when guests array is empty', () => {
    const { container } = render(
      <SelectedGuests guests={[]} onRemove={vi.fn()} />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders guest names as chips', () => {
    render(<SelectedGuests guests={mockGuests} onRemove={vi.fn()} />);

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('shows social handles with @ prefix', () => {
    render(<SelectedGuests guests={mockGuests} onRemove={vi.fn()} />);

    // Alice has both twitter and instagram combined in one span
    const handlesText = screen.getByText((content) =>
      content.includes('@alice_tweets') && content.includes('@alice_ig'),
    );
    expect(handlesText).toBeInTheDocument();

    // Bob has no handles — only one handles span should exist (Alice's)
    const allHandlesSpans = screen.getAllByText((content) =>
      content.startsWith('@'),
    );
    expect(allHandlesSpans).toHaveLength(1);
  });

  it('calls onRemove when X button is clicked', () => {
    const onRemove = vi.fn();
    render(<SelectedGuests guests={mockGuests} onRemove={onRemove} />);

    // Find all remove buttons (the × buttons)
    const removeButtons = screen.getAllByText('×');
    expect(removeButtons).toHaveLength(2);

    // Click the first remove button
    fireEvent.click(removeButtons[0]);

    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onRemove).toHaveBeenCalledWith(mockGuests[0]);
  });

  it('renders correct number of chips', () => {
    render(<SelectedGuests guests={mockGuests} onRemove={vi.fn()} />);

    const removeButtons = screen.getAllByText('×');
    expect(removeButtons).toHaveLength(2);
  });

  it('handles single guest with all social handles', () => {
    const singleGuest = [mockGuests[0]];
    render(<SelectedGuests guests={singleGuest} onRemove={vi.fn()} />);

    expect(screen.getByText('Alice')).toBeInTheDocument();
    const handlesText = screen.getByText((content) =>
      content.includes('@alice_tweets') && content.includes('@alice_ig'),
    );
    expect(handlesText).toBeInTheDocument();
  });
});
