'use client';

import Link from 'next/link';
import { CloudOff, Home, RotateCw } from 'lucide-react';
import { Button, buttonVariants } from '@/foundation/components/buttons';

export default function OfflinePage() {
  return (
    <main className="grid min-h-screen place-items-center bg-neutral-50 px-4 py-12 text-neutral-900">
      <section className="w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-card sm:p-10">
        <div className="mx-auto grid size-20 place-items-center rounded-2xl bg-amber-100 text-amber-700">
          <CloudOff aria-hidden className="size-10" />
        </div>
        <p className="mt-6 eyebrow text-neutral-900">Bảo An Sport</p>
        <h1 className="mt-3 text-3xl font-bold">Bạn đang ngoại tuyến</h1>
        <p className="mt-4 text-sm leading-6 text-neutral-600">
          Đơn hàng, tài khoản, tồn kho và thanh toán cần kết nối mạng để đảm bảo dữ liệu luôn chính xác và riêng tư.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button variant="primary" size="lg" onClick={() => window.location.reload()} className="px-5 text-sm font-bold">
            <RotateCw aria-hidden className="size-4" /> Thử kết nối lại
          </Button>
          <Link href="/" className={buttonVariants({ variant: 'outline', size: 'lg', className: 'px-5 text-sm font-bold' })}>
            <Home aria-hidden className="size-4" /> Trang chủ đã lưu
          </Link>
        </div>
      </section>
    </main>
  );
}
