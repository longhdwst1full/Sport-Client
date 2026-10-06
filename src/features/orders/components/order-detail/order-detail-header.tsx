import Link from 'next/link';
import { ArrowLeft, ChevronRight, Headphones } from 'lucide-react';
import { Button, buttonVariants } from '@/foundation/components/buttons';

/** Breadcrumb (khách vãng lai không có mục "Đơn hàng của tôi") và lối tắt danh sách đơn / hỗ trợ. */
export function OrderDetailHeader({
  orderNo,
  isAuthenticated,
  onOpenSupport,
}: {
  orderNo: string;
  isAuthenticated: boolean;
  onOpenSupport: () => void;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <nav aria-label="Breadcrumb" className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-slate-500">
        <Link href="/" className="inline-flex min-h-8 items-center hover:text-brand-700 transition">Trang chủ</Link>
        <ChevronRight aria-hidden className="size-3 text-slate-400" />
        {isAuthenticated ? (
          <>
            <Link href="/orders" className="inline-flex min-h-8 items-center hover:text-brand-700 transition">Đơn hàng của tôi</Link>
            <ChevronRight aria-hidden className="size-3 text-slate-400" />
          </>
        ) : null}
        <span className="text-slate-600">Chi tiết đơn hàng</span>
        <ChevronRight aria-hidden className="size-3 text-slate-400" />
        <span aria-current="page" className="font-mono font-bold text-slate-900 break-all">{orderNo}</span>
      </nav>

      <div className="flex items-center gap-2">
        {isAuthenticated && (
          <Link
            href="/orders"
            className={buttonVariants({ variant: 'outline', className: 'gap-1.5 border-slate-200/80 px-3.5 text-xs font-bold text-slate-700 shadow-sm' })}
          >
            <ArrowLeft className="size-3.5" /> Danh sách đơn
          </Link>
        )}
        <Button
          variant="outline"
          onClick={onOpenSupport}
          className="gap-1.5 border-brand-200 bg-brand-50/70 px-3.5 text-xs font-bold text-brand-800 hover:bg-brand-100"
        >
          <Headphones aria-hidden className="size-3.5 text-brand-600" /> Cần hỗ trợ?
        </Button>
      </div>
    </div>
  );
}
