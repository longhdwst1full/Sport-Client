'use client';

import dynamic from 'next/dynamic';
import type { ComponentProps } from 'react';

import type { KineticBallCanvas as KineticBallCanvasComponent } from './kinetic-ball-canvas';

type KineticBallCanvasProps = ComponentProps<typeof KineticBallCanvasComponent>;

// PERFORMANCE: three.js là ~636 kB nguồn và chỉ phục vụ trang trí trên 404, error,
// login và register. Import tĩnh từ `app/error.tsx` và `app/not-found.tsx` kéo nó vào
// đồ thị dùng chung của mọi route, đẩy First Load JS của `/` lên 374 kB so với mốc
// tham chiếu 149 kB trong rule chất lượng. Tách thành chunk riêng, chỉ tải khi trang
// tương ứng thật sự hiển thị.
//
// `ssr: false` là bắt buộc: component dựng WebGLRenderer nên không chạy được khi
// render phía máy chủ.
const LazyKineticBallCanvas = dynamic(
  () => import('./kinetic-ball-canvas').then((module) => module.KineticBallCanvas),
  {
    ssr: false,
    // Giữ đúng chiều cao khi chunk đang tải để không gây dịch chuyển bố cục.
    loading: () => null,
  },
);

export function KineticBallCanvas(props: KineticBallCanvasProps) {
  // Giữ chỗ bằng minHeight để khung không co lại trong lúc chunk đang tải; component
  // thật tự đặt height của chính nó khi đã sẵn sàng.
  return (
    <div style={{ minHeight: props.height ?? '360px' }}>
      <LazyKineticBallCanvas {...props} />
    </div>
  );
}
