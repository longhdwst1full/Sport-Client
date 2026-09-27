import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import manifest from './manifest';

const publicFile = (src: string) => fileURLToPath(new URL(`../../public${src}`, import.meta.url));

/** Kích thước thật đọc từ header IHDR của PNG, không tin vào con số khai trong manifest. */
function pngSize(src: string): string {
  const buffer = readFileSync(publicFile(src));
  return `${buffer.readUInt32BE(16)}x${buffer.readUInt32BE(20)}`;
}

describe('web app manifest', () => {
  const m = manifest();

  it('đủ trường cho tiêu chí cài đặt', () => {
    expect(m.name).toBe('Bảo An Sport');
    expect(m.short_name).toBeTruthy();
    expect(m.start_url).toBe('/');
    expect(m.display).toBe('standalone');
    expect(m.theme_color).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it('icon PNG 192/512 và maskable tồn tại với đúng kích thước khai báo', () => {
    const pngIcons = (m.icons ?? []).filter((icon) => icon.type === 'image/png');
    expect(pngIcons.map((icon) => icon.sizes)).toEqual(expect.arrayContaining(['192x192', '512x512']));
    expect(pngIcons.some((icon) => icon.purpose === 'maskable')).toBe(true);
    for (const icon of m.icons ?? []) {
      expect(existsSync(publicFile(icon.src)), icon.src).toBe(true);
      if (icon.type === 'image/png') expect(pngSize(icon.src), icon.src).toBe(icon.sizes);
    }
  });

  it('apple-touch-icon 180×180 có thật', () => {
    expect(pngSize('/apple-touch-icon.png')).toBe('180x180');
  });
});
