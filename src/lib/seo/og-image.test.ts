import { describe, expect, it } from 'vitest';
import { toOgImageUrl, withCloudinaryTransformation } from './og-image';

const BASE = 'https://res.cloudinary.com/demo/image/upload';

describe('toOgImageUrl', () => {
  it('chèn JPEG 1200x630 trước version của URL Cloudinary', () => {
    expect(toOgImageUrl(`${BASE}/v1712/dctd/cms/a.webp`)).toBe(`${BASE}/f_jpg,w_1200,h_630,c_fill/v1712/dctd/cms/a.webp`);
  });

  it('áp sau transformation sẵn có', () => {
    expect(withCloudinaryTransformation(`${BASE}/c_crop,w_500/dctd/a.avif`, 'f_jpg')).toBe(`${BASE}/c_crop,w_500/f_jpg/dctd/a.avif`);
  });

  it('giữ nguyên URL không phải Cloudinary image upload', () => {
    for (const url of ['https://baoansport.vn/a.jpg', 'https://images.unsplash.com/photo-1', `${BASE}/`]) {
      expect(toOgImageUrl(url)).toBe(url);
    }
  });
});
