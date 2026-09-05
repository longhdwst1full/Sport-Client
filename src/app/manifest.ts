import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Bảo An Sport — Dụng Cụ Thể Thao Chính Hãng Giá Tốt Nhất',
    short_name: 'Bảo An Sport',
    description: 'Bảo An Sport chuyên cung cấp dụng cụ thể thao, thiết bị thể dục và thể hình. Máy chạy bộ, xe đạp tập, giàn tạ, dụng cụ võ thuật, bóng bàn. Giao hàng toàn quốc.',
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
