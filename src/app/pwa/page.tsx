'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/foundation/components/buttons';
import { DescriptionList } from '@/foundation/components/structure';
import { resetPwaAndReload } from '@/pwa/reset-pwa';

export default function PwaDiagnosticsPage() {
  const [online, setOnline] = useState(true);
  const [controller, setController] = useState<string | null>(null);

  useEffect(() => {
    setOnline(navigator.onLine);
    setController(navigator.serviceWorker?.controller?.scriptURL ?? null);
  }, []);

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-xs font-bold uppercase tracking-eyebrow text-neutral-900">Chẩn đoán ứng dụng</p>
      <h1 className="mt-3 text-3xl font-semibold text-neutral-900 sm:text-4xl">Trạng thái PWA</h1>
      <section className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6" aria-labelledby="install-heading">
        <h2 id="install-heading" className="text-xl font-semibold">Cài Bảo An Sport trên điện thoại / máy tính bảng</h2>
        <ul className="mt-4 list-disc space-y-3 pl-5 text-sm text-neutral-600">
          <li><strong>iPhone / iPad:</strong> mở bằng Safari → Chia sẻ → Thêm vào Màn hình chính → Thêm. iOS không có hộp thoại cài tự động giống Android.</li>
          <li><strong>Android:</strong> mở bằng Chrome → bấm “Cài ứng dụng” khi có thông báo, hoặc menu ⋮ → Thêm vào màn hình chính / Cài đặt ứng dụng.</li>
          <li><strong>Đang mở trong Facebook, Zalo, TikTok…:</strong> chọn Mở bằng trình duyệt ngoài rồi làm các bước trên. Tên menu có thể khác theo phiên bản.</li>
          <li>Ứng dụng web không phải file APK. Cần HTTPS; thông báo cài do trình duyệt quyết định và có thể không hiện khi đã cài hoặc vừa từ chối.</li>
        </ul>
      </section>
      <DescriptionList
        layout="inline"
        className="mt-8 gap-y-3 rounded-2xl border border-neutral-200 bg-white p-6 shadow-card"
        itemClassName="gap-4"
        labelClassName="text-neutral-900"
        valueClassName="font-bold"
        items={[
          { key: 'online', label: 'Kết nối', value: online ? 'Đang trực tuyến' : 'Ngoại tuyến' },
          {
            key: 'controller',
            label: 'Trình chạy nền (service worker)',
            value: controller ?? 'Chưa điều khiển trang',
            valueClassName: 'max-w-sm break-all',
          },
        ]}
      />
      <Button variant="primary" size="lg" className="mt-6 font-bold" onClick={() => void resetPwaAndReload()}>
        Xóa bộ nhớ đệm và tải lại ứng dụng
      </Button>
    </main>
  );
}
