import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/foundation/components/buttons';
import { Checkbox } from '@/foundation/components/field-system';
import { Spinner } from '@/foundation/components/feedback';
import { DescriptionList, type DescriptionItem } from '@/foundation/components/structure';
import type { CartItem } from '@/features/cart';
import type { CheckoutQuoteView } from '../model/checkout.mapper';
import { formatVnd } from '@/shared/format/money';
import { PRODUCT_PLACEHOLDER_IMAGE, STORE_POLICY_PAGES } from '@/shared/constants';

/** Nút đặt hàng (desktop + thanh dính mobile): bo lớn, chữ đậm, trạng thái khoá xám thay vì mờ. */
const SUBMIT_CLASS = 'rounded-2xl text-sm font-black shadow-sm disabled:bg-slate-300 disabled:text-slate-600 disabled:opacity-100';

interface CheckoutOrderSummaryProps {
  items: CartItem[];
  localSubtotal: number;
  quote?: CheckoutQuoteView;
  busy: boolean;
  authLoaded: boolean;
  /** "Nhờ shop gửi" đang chọn: phí vận chuyển do shop báo và thu riêng, tổng chỉ gồm tiền hàng. */
  shopArranged?: boolean;
  /** Đang gọi báo giá: hiện "Đang tính phí", không bao giờ hiện 0 ₫ tạm. */
  quoting?: boolean;
  /** Nút đặt hàng chỉ có ở bước xác nhận; các bước trước điều hướng bằng nút trong từng bước. */
  showSubmit?: boolean;
  submitDisabled?: boolean;
  submitLabel?: string;
  /** Ô đồng ý điều khoản nằm ngay trên nút đặt hàng; việc chặn khi chưa tick vẫn do `usePlaceOrder` lo. */
  acceptedTerms?: boolean;
  setAcceptedTerms?: (value: boolean) => void;
}

export function CheckoutOrderSummary({
  items,
  localSubtotal,
  quote,
  busy,
  authLoaded,
  shopArranged = false,
  quoting = false,
  showSubmit = false,
  submitDisabled = false,
  submitLabel = 'Đặt hàng',
  acceptedTerms = false,
  setAcceptedTerms,
}: CheckoutOrderSummaryProps) {
  // CONTRACT: hai trạng thái khác nhau cùng "chưa có số phí".
  // - SHOP_ARRANGED (`shippingFeePending`): báo giá QUOTED, shippingTotal = 0 nhưng KHÔNG miễn phí —
  //   hiện "Shop báo riêng" chứ không phải 0 ₫, và khách vẫn đặt được đơn.
  // - `requiresShippingConsultation`: Backend ẩn phí/tổng vì còn chờ nhân viên chốt cước.
  const consultationPending = Boolean(quote?.requiresShippingConsultation);
  const shippingPending = shopArranged || consultationPending || Boolean(quote?.shippingFeePending);
  const hasFinalTotal = !shippingPending && !quoting && Boolean(quote);
  const mobileTotalLabel = hasFinalTotal && quote ? quote.grandTotalLabel : formatVnd(localSubtotal);
  const submitIsDisabled = busy || !authLoaded || submitDisabled;
  const shippingRow: { value: ReactNode; className?: string } = shippingPending
    ? { value: 'Shop báo riêng', className: 'font-semibold text-amber-700' }
    : quoting || !quote
      ? {
          value: (
            <span className="inline-flex items-center gap-1">
              {quoting ? <><Spinner className="size-3.5 animate-spin" /> Đang tính phí...</> : 'Chưa tính'}
            </span>
          ),
          className: 'text-slate-500',
        }
      : quote.shippingTotalAmount === 0
        ? { value: 'Miễn phí', className: 'font-semibold text-success-700' }
        : { value: quote.shippingTotalLabel };
  const totalRow: DescriptionItem | null = shippingPending
    ? { label: 'Tiền hàng', value: formatVnd(localSubtotal) }
    : !quoting && quote
      ? { label: 'Khách thanh toán', value: quote.grandTotalLabel }
      : null;
  return (
    <aside>
      <div className="rounded-3xl border border-slate-200/90 bg-white p-4 shadow-sm sm:p-6 lg:sticky lg:top-28">
        <div className="flex items-center justify-between">
          <h2 className="font-black text-slate-900">Đơn hàng ({items.length})</h2>
          <Link href="/cart" className="-my-2 inline-flex min-h-11 items-center px-2 text-xs font-bold text-slate-900 hover:underline">Chỉnh sửa</Link>
        </div>
        <div className="mt-4 max-h-72 space-y-3 overflow-auto">
          {items.map((item) => (
            <div key={item.variantId} className="flex items-center gap-3">
              <div className="relative size-12 shrink-0 overflow-hidden rounded-xl border bg-slate-50">
                <Image src={item.imageUrl || PRODUCT_PLACEHOLDER_IMAGE} alt={item.name} fill sizes="48px" className="object-contain p-1" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-500">{item.sku} · ×{item.quantity}</p>
              </div>
              <strong className="shrink-0 text-xs">{formatVnd(item.price * item.quantity)}</strong>
            </div>
          ))}
        </div>
        <div className="mt-5 space-y-3 border-t pt-4 text-sm">
          <DescriptionList
            layout="inline"
            labelClassName="text-slate-700"
            valueClassName="font-normal text-slate-900"
            items={[
              { label: 'Tạm tính tham khảo', value: formatVnd(localSubtotal) },
              { label: 'Phí giao', value: shippingRow.value, valueClassName: shippingRow.className },
            ]}
          />
          {totalRow && (
            <DescriptionList
              layout="inline"
              className="border-t pt-3 text-base font-black"
              labelClassName="text-slate-900"
              valueClassName="font-black text-slate-900"
              items={[totalRow]}
            />
          )}
          {shippingPending && (
            <p className="rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900">
              {consultationPending
                ? 'Đơn cần nhân viên tư vấn cước gửi xe. Shop sẽ liên hệ chốt phí rồi bạn bấm kiểm tra lại phí để đặt hàng.'
                : 'Bạn đặt hàng được ngay. Phí vận chuyển sẽ được shop gọi báo và thu riêng khi gửi hàng, chưa gồm trong số tiền trên.'}
            </p>
          )}
        </div>
        {showSubmit && setAcceptedTerms && (
          <Checkbox
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            wrapperClassName="mt-5 rounded-2xl border border-slate-200/60 bg-slate-50 p-3"
            label={
              <span className="text-xs leading-relaxed">
                Tôi đã đọc và đồng ý với{' '}
                <Link href={STORE_POLICY_PAGES.TERMS.href} target="_blank" className="font-bold text-slate-900 underline-offset-2 hover:underline">
                  {STORE_POLICY_PAGES.TERMS.title.toLowerCase()}
                </Link>{' '}
                và{' '}
                <Link href={STORE_POLICY_PAGES.RETURNS.href} target="_blank" className="font-bold text-slate-900 underline-offset-2 hover:underline">
                  chính sách đổi trả & bảo hành
                </Link>{' '}
                của Bảo An Sport.
              </span>
            }
          />
        )}
        {showSubmit && (
          <Button type="submit" variant="primary" size="lg" fullWidth disabled={submitIsDisabled} className={`mt-4 hidden lg:flex ${SUBMIT_CLASS}`}>
            {busy ? <Spinner className="size-5 animate-spin" /> : <CheckCircle2 aria-hidden className="size-5" />}
            {busy ? 'Đang xử lý...' : submitLabel}
          </Button>
        )}
        <div className="mt-4 flex gap-2 text-xs leading-5 text-slate-500">
          <ShieldCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-slate-400" />
          <span>Giá, tồn kho và phí giao được xác nhận lại khi bạn đặt hàng.</span>
        </div>
      </div>

      {/* Mobile: thanh tổng + nút đặt hàng dính đáy để khách không phải cuộn xuống cuối form. */}
      {showSubmit && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_-12px_rgba(15,23,42,0.25)] backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-3xl items-center gap-3">
            <div className="min-w-0 flex-1">
              <span className="block text-[11px] font-semibold text-slate-500">
                {hasFinalTotal ? 'Khách thanh toán' : shippingPending ? 'Tiền hàng (chưa gồm phí giao)' : 'Tạm tính (chưa gồm phí giao)'}
              </span>
              <strong className="block truncate text-lg font-black text-slate-900">{mobileTotalLabel}</strong>
              {setAcceptedTerms && !acceptedTerms && (
                <span className="block text-[11px] font-semibold text-amber-700">Đánh dấu đồng ý điều khoản để đặt hàng</span>
              )}
            </div>
            <Button type="submit" variant="primary" size="lg" disabled={submitIsDisabled} className={`shrink-0 px-5 ${SUBMIT_CLASS}`}>
              {busy ? <Spinner className="size-5 animate-spin" /> : null}
              {busy ? 'Đang xử lý...' : submitLabel}
            </Button>
          </div>
        </div>
      )}
    </aside>
  );
}
