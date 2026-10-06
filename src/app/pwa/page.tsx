'use client';

import { useEffect, useState } from 'react';
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
      <p className="text-xs font-bold uppercase tracking-[.2em] text-brand-700">Chẩn đoán ứng dụng</p>
      <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">Trạng thái PWA</h1>
      <dl className="mt-8 grid gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <div className="flex justify-between gap-4">
          <dt>Kết nối</dt>
          <dd className="font-bold">{online ? 'Đang trực tuyến' : 'Ngoại tuyến'}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Trình chạy nền (service worker)</dt>
          <dd className="max-w-sm break-all text-right font-bold">
            {controller ?? 'Chưa điều khiển trang'}
          </dd>
        </div>
      </dl>
      <button
        type="button"
        className="mt-6 min-h-12 rounded-xl bg-brand-600 px-6 font-bold text-white transition-colors hover:bg-brand-700"
        onClick={() => void resetPwaAndReload()}
      >
        Xóa bộ nhớ đệm và tải lại ứng dụng
      </button>
    </main>
  );
}
