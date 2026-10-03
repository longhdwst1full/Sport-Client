// @vitest-environment jsdom
import * as React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PRODUCT_PLACEHOLDER_IMAGE } from '@/shared/constants';
import { CoverImage } from './cover-image';

// next/image cần loader của Next; trong test thay bằng <img> giữ nguyên src/onError.
vi.mock('next/image', () => ({
  default: ({ src, alt, onError }: { src: string; alt: string; onError?: () => void }) => (
    <img src={src} alt={alt} onError={onError} />
  ),
}));

// Vitest biên dịch JSX kiểu classic (`React.createElement`) mà không có plugin React; Next thì dùng runtime tự động.
(globalThis as { React?: typeof React }).React = React;

const URL = 'https://res.cloudinary.com/demo/image/upload/v1/a.jpg';

describe('CoverImage', () => {
  afterEach(cleanup);

  it('URL rỗng dùng ảnh thay thế', () => {
    render(<CoverImage src="" alt="Bài viết" width={10} height={10} />);
    expect(screen.getByAltText('Bài viết').getAttribute('src')).toBe(PRODUCT_PLACEHOLDER_IMAGE);
  });

  it('ảnh tải lỗi chuyển sang ảnh thay thế', () => {
    render(<CoverImage src={URL} alt="Bài viết" width={10} height={10} />);
    const image = screen.getByAltText('Bài viết');
    expect(image.getAttribute('src')).toBe(URL);
    fireEvent.error(image);
    expect(screen.getByAltText('Bài viết').getAttribute('src')).toBe(PRODUCT_PLACEHOLDER_IMAGE);
  });
});
