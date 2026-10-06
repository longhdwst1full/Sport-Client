'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Phone, RotateCw, WifiOff, AlertTriangle } from 'lucide-react';
import { STORE_CONTACT } from '@/shared/constants';

/**
 * Nội dung lỗi route dùng chung cho `app/error.tsx` và `app/(storefront)/error.tsx`.
 * Chỉ nói "mất kết nối" khi trình duyệt thật sự offline; lỗi khác là lỗi tải trang (`04-offline-commerce-ux.md`).
 */
export function RouteErrorContent({ digest, onRetry }: { digest?: string; onRetry: () => void }) {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const sync = () => setIsOffline(!navigator.onLine);
    sync();
    window.addEventListener('online', sync);
    window.addEventListener('offline', sync);
    return () => {
      window.removeEventListener('online', sync);
      window.removeEventListener('offline', sync);
    };
  }, []);

  const Icon = isOffline ? WifiOff : AlertTriangle;

  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-brand-50 text-brand-600">
        <Icon aria-hidden className="size-8" />
      </div>
      <h1 className="mt-5 text-balance text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">
        {isOffline ? 'Bạn đang mất kết nối mạng' : 'Trang chưa tải được'}
      </h1>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-600 sm:text-base">
        {isOffline
          ? 'Kiểm tra Wi-Fi hoặc dữ liệu di động rồi thử lại. Đặt hàng và thanh toán cần kết nối mạng.'
          : 'Đã có lỗi khi hiển thị trang này. Vui lòng thử lại; nếu vẫn lỗi, hãy liên hệ hotline để được hỗ trợ.'}
      </p>

      <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 font-bold text-white transition-colors hover:bg-brand-700"
        >
          <RotateCw aria-hidden className="size-4" />
          Thử lại
        </button>
        <Link
          href="/"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 font-bold text-slate-800 transition-colors hover:border-brand-300 hover:text-brand-700"
        >
          <Home aria-hidden className="size-4" />
          Về trang chủ
        </Link>
      </div>

      <p className="mt-8 text-sm text-slate-600">
        Hỗ trợ ({STORE_CONTACT.openingHours}):{' '}
        <a
          href={`tel:${STORE_CONTACT.primaryHotlineRaw}`}
          className="inline-flex min-h-11 items-center gap-1.5 font-bold text-brand-700 hover:underline"
        >
          <Phone aria-hidden className="size-4" />
          {STORE_CONTACT.primaryHotline}
        </a>
      </p>
      {digest ? <p className="mt-2 text-xs text-slate-500">Mã lỗi: {digest}</p> : null}
    </div>
  );
}
