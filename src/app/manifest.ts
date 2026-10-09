import type { MetadataRoute } from 'next';

/**
 * Web app manifest. Tiêu chí cài đặt (Chrome): `name`/`short_name`, `start_url`, `display`
 * standalone, icon PNG 192 và 512, service worker có `fetch` handler, phục vụ qua HTTPS.
 * Icon maskable dựng từ `public/icon.svg` với nội dung nằm trong vùng an toàn 80%.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Bảo An Sport',
    short_name: 'Bảo An Sport',
    description:
      'Bảo An Sport chuyên cung cấp dụng cụ thể thao, thiết bị thể dục và thể hình. Máy chạy bộ, xe đạp tập, giàn tạ, dụng cụ võ thuật, bóng bàn. Giao hàng toàn quốc.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#171717',
    theme_color: '#d42a27',
    lang: 'vi',
    dir: 'ltr',
    categories: ['shopping', 'sports'],
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
    ],
  };
}
