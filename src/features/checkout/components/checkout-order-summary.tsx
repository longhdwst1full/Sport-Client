import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, LoaderCircle, ShieldCheck, Truck } from 'lucide-react';
import type { CartItem } from '@/app/store/cart.slice';
import type { CheckoutQuoteDto } from '@/generated/api/checkout/models';
import { vndMoney } from '@/shared/format/money';

interface CheckoutOrderSummaryProps {
  items: CartItem[];
  localSubtotal: number;
  quote?: CheckoutQuoteDto;
  busy: boolean;
  authLoaded: boolean;
}

export function CheckoutOrderSummary({
  items,
  localSubtotal,
  quote,
  busy,
  authLoaded,
}: CheckoutOrderSummaryProps) {
  const payable = quote?.grandTotal ? Number(quote.grandTotal) : localSubtotal;
  return (
    <aside>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-28">
        <div className="flex items-center justify-between">
          <h2 className="font-black text-slate-900">Đơn hàng ({items.length})</h2>
          <Link href="/cart" className="text-xs font-bold text-emerald-700">Chỉnh sửa</Link>
        </div>
        <div className="mt-4 max-h-72 space-y-3 overflow-auto">
          {items.map((item) => (
            <div key={item.variantId} className="flex items-center gap-3">
              <div className="relative size-12 overflow-hidden rounded-xl border bg-slate-50">
                <Image src={item.imageUrl || '/icon.svg'} alt={item.name} fill sizes="48px" className="object-contain p-1" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-500">{item.sku} · ×{item.quantity}</p>
              </div>
              <strong className="text-xs">{vndMoney.format(item.price * item.quantity)}</strong>
            </div>
          ))}
        </div>
        <div className="mt-5 space-y-2 border-t pt-4 text-sm">
          <div className="flex justify-between"><span>Tạm tính tham khảo</span><span>{vndMoney.format(localSubtotal)}</span></div>
          {quote && (
            <>
              <div className="flex justify-between"><span>Phí giao</span><span>{quote.shippingTotal == null ? 'Chờ tư vấn' : vndMoney.format(Number(quote.shippingTotal))}</span></div>
              <div className="flex justify-between border-t pt-3 text-base font-black"><span>Khách thanh toán</span><span className="text-emerald-700">{quote.grandTotal == null ? 'Chờ tư vấn' : vndMoney.format(payable)}</span></div>
            </>
          )}
        </div>
        <button type="submit" disabled={busy || !authLoaded || quote?.requiresShippingConsultation} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-sm font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300">
          {busy ? <LoaderCircle className="size-5 animate-spin" /> : quote ? <CheckCircle2 className="size-5" /> : <Truck className="size-5" />}
          {busy ? 'Đang xử lý...' : quote ? 'Xác nhận và giữ hàng 30 phút' : 'Kiểm tra tồn và tính phí'}
        </button>
        <div className="mt-4 flex gap-2 text-xs leading-5 text-slate-500">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
          <span>Không lấy giá hoặc tồn từ dữ liệu lưu trên trình duyệt. Backend là nguồn quyết định cuối cùng.</span>
        </div>
      </div>
    </aside>
  );
}
