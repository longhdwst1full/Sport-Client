'use client';

import Link from 'next/link';
import { CloudOff, Home, RotateCw } from 'lucide-react';

export default function OfflinePage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-12 text-slate-900">
      <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-card sm:p-10">
        <div className="mx-auto grid size-20 place-items-center rounded-2xl bg-amber-100 text-amber-700">
          <CloudOff aria-hidden className="size-10" />
        </div>
        <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-brand-700">Bảo An Sport</p>
        <h1 className="mt-3 text-3xl font-black">Bạn đang ngoại tuyến</h1>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          Đơn hàng, tài khoản, tồn kho và thanh toán cần kết nối mạng để đảm bảo dữ liệu luôn chính xác và riêng tư.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => window.location.reload()} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-black text-white transition-colors hover:bg-brand-700">
            <RotateCw aria-hidden className="size-4" /> Thử kết nối lại
          </button>
          <Link href="/" className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-slate-300 px-5 text-sm font-bold text-slate-800 transition-colors hover:border-brand-300 hover:text-brand-700">
            <Home aria-hidden className="size-4" /> Trang chủ đã lưu
          </Link>
        </div>
      </section>
    </main>
  );
}
