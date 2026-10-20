// @vitest-environment jsdom
import * as React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Button } from './button';

// Vitest biên dịch JSX kiểu classic (`React.createElement`) mà không có plugin React; Next thì dùng runtime tự động.
(globalThis as { React?: typeof React }).React = React;

const Left = () => <svg data-testid="left" />;
const Right = () => <svg data-testid="right" />;

describe('Button', () => {
  afterEach(cleanup);

  it('hiện leftIcon / rightIcon quanh nhãn', () => {
    render(<Button variant="primary" leftIcon={<Left />} rightIcon={<Right />}>Gửi</Button>);
    const button = screen.getByRole('button', { name: 'Gửi' });
    expect(button.firstElementChild).toBe(screen.getByTestId('left'));
    expect(button.lastElementChild).toBe(screen.getByTestId('right'));
  });

  it('loading: Spinner thay leftIcon, ẩn rightIcon, khoá nút', () => {
    render(<Button variant="primary" loading leftIcon={<Left />} rightIcon={<Right />}>Gửi</Button>);
    const button = screen.getByRole('button', { name: 'Gửi' });
    expect(screen.queryByTestId('left')).toBeNull();
    expect(screen.queryByTestId('right')).toBeNull();
    expect(button.querySelector('.animate-spin')).not.toBeNull();
    expect(button).toHaveProperty('disabled', true);
    expect(button.getAttribute('aria-busy')).toBe('true');
  });

  it('size="icon" + loading: Spinner thay children', () => {
    render(<Button size="icon" loading aria-label="Gửi tin nhắn"><Right /></Button>);
    expect(screen.queryByTestId('right')).toBeNull();
    expect(screen.getByRole('button', { name: 'Gửi tin nhắn' }).querySelector('.animate-spin')).not.toBeNull();
  });
});
