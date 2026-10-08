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
      <p className="text-xs font-bold uppercase tracking-[.2em] text-slate-900">Chẩn đoán ứng dụng</p>
      <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">Trạng thái PWA</h1>
      <DescriptionList
        layout="inline"
        className="mt-8 gap-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-card"
        itemClassName="gap-4"
        labelClassName="text-slate-900"
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
