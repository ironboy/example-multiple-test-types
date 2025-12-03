import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Select from '../src/parts/Select';

describe('Select component', () => {
  const defaultProps = {
    label: 'Category',
    value: 'Option 1',
    changeHandler: vi.fn(),
    options: ['Option 1', 'Option 2', 'Option 3'],
  };

  it('renders label correctly', () => {
    render(<Select {...defaultProps} />);
    expect(screen.getByText('Category:')).toBeInTheDocument();
  });

  it('renders all options', () => {
    render(<Select {...defaultProps} />);
    const select = screen.getByRole('button');
    expect(select).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('calls changeHandler when selection changes', () => {
    const changeHandler = vi.fn();
    render(<Select {...defaultProps} changeHandler={changeHandler} />);

    const select = screen.getByRole('button');
    fireEvent.change(select, { target: { value: 'Option 2' } });

    expect(changeHandler).toHaveBeenCalledWith('Option 2');
  });

  it('displays the correct selected value', () => {
    render(<Select {...defaultProps} value="Option 2" />);
    const select = screen.getByRole('button') as HTMLSelectElement;
    expect(select.value).toBe('Option 2');
  });
});
