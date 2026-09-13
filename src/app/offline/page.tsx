'use client';

import Link from 'next/link';
import { CloudOff, Home, RotateCw } from 'lucide-react';

export default function OfflinePage() {
  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-5 py-12 text-white">
      <section className="w-full max-w-lg rounded-[32px] border border-white/10 bg-white/10 p-8 text-center shadow-2xl backdrop-blur sm:p-11">
        <div className="mx-auto grid size-20 place-items-center rounded-3xl bg-amber-300 text-slate-950">
          <CloudOff className="size-10" />
        </div>
        <p className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-emerald-300">Bảo An Sport PWA</p>
        <h1 className="mt-3 text-3xl font-black">Bạn đang ngoại tuyến</h1>
        <p className="mt-4 text-sm leading-6 text-slate-300">
          Đơn hàng, tài khoản, tồn kho và thanh toán cần kết nối mạng để đảm bảo dữ liệu luôn chính xác và riêng tư.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => window.location.reload()} className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950">
            <RotateCw className="size-4" /> Thử kết nối lại
          </button>
          <Link href="/" className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-bold">
            <Home className="size-4" /> Trang chủ đã lưu
          </Link>
        </div>
      </section>
    </main>
  );
}
