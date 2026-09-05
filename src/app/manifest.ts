import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'DCTD Sport — Dụng Cụ & Thiết Bị Thể Thao Cao Cấp',
    short_name: 'DCTD Sport',
    description: 'Hệ thống phân phối thiết bị gym, máy chạy bộ, giàn tạ và phụ kiện thể thao chính hãng toàn quốc.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#059669',
    lang: 'vi',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
