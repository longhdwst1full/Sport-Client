// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { PriceRangeSlider } from './price-range-slider';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('PriceRangeSlider', () => {
  it('có hai thanh trượt có nhãn và hai ô nhập', () => {
    render(<PriceRangeSlider min={500000} max={2000000} onChange={() => {}} />);
    expect(screen.getByRole('slider', { name: 'Giá thấp nhất' })).toBeTruthy();
    expect(screen.getByRole('slider', { name: 'Giá cao nhất' })).toBeTruthy();
    expect((screen.getByLabelText('Giá từ (VND)') as HTMLInputElement).value).toBe('500.000');
  });

  it('kéo chỉ commit một lần sau 300ms', () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    render(<PriceRangeSlider min={null} max={null} onChange={onChange} />);
    const slider = screen.getByRole('slider', { name: 'Giá thấp nhất' });
    fireEvent.change(slider, { target: { value: '1000000' } });
    fireEvent.change(slider, { target: { value: '2000000' } });
    expect(onChange).not.toHaveBeenCalled();
    vi.advanceTimersByTime(300);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(2000000, null);
  });

  it('ô nhập đảo khi min > max và commit khi blur', () => {
    const onChange = vi.fn();
    render(<PriceRangeSlider min={null} max={1000000} onChange={onChange} />);
    const input = screen.getByLabelText('Giá từ (VND)');
    fireEvent.change(input, { target: { value: '3.000.000' } });
    fireEvent.blur(input);
    expect(onChange).toHaveBeenCalledWith(1000000, 3000000);
  });
});
