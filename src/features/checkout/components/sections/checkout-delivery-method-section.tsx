import { AlertTriangle, RotateCcw, Truck } from 'lucide-react';
import { Button } from '@/foundation/components/buttons';
import { InlineAlert, Spinner } from '@/foundation/components/feedback';
import type { CheckoutQuoteDto } from '@/generated/api/checkout/checkout.schemas';
import type { CheckoutQuoteView } from '../../model/checkout.mapper';
import { CheckoutStepSection, optionClass } from './checkout-step-section';

/**
 * Bước 2: giao tiêu chuẩn (kèm kết quả báo giá tự động) hoặc nhờ shop gửi chành; lỗi báo giá có nút thử lại.
 * Bật/tắt "Nhờ shop gửi" chỉ đổi state cục bộ, không báo giá lại (phí tính một lần theo địa chỉ + giỏ).
 */
export function CheckoutDeliveryMethodSection({
  shopArranged,
  setShopArranged,
  onSelectionChange,
  freeRadiusKm,
  quotePending,
  refreshingQuote = false,
  quoteView,
  readyToQuote,
  error,
  autoQuoting,
  quote,
  retryQuote,
}: {
  shopArranged: boolean;
  setShopArranged: (value: boolean) => void;
  /** Gọi sau khi khách đổi cách giao; không báo giá lại trừ khi trang quyết định (xem checkout-page). */
  onSelectionChange?: () => void;
  freeRadiusKm: number;
  quotePending: boolean;
  /** Đang báo giá lại, `quoteView` là số cũ: giữ nguyên bố cục, chỉ làm mờ và ghi "đang cập nhật". */
  refreshingQuote?: boolean;
  quoteView: CheckoutQuoteView | undefined;
  readyToQuote: boolean;
  error: string;
  autoQuoting: boolean;
  quote: CheckoutQuoteDto | undefined;
  retryQuote: () => void;
}) {
  return (
    <CheckoutStepSection step={2} icon={Truck} title="Phương thức vận chuyển" description="Cước phí tính toán tự động và minh bạch">
      <div className="mt-5 grid gap-3.5 sm:grid-cols-2" role="radiogroup" aria-label="Cách giao hàng">
        <button
          type="button"
          role="radio"
          aria-checked={!shopArranged}
          onClick={() => { if (!shopArranged) return; setShopArranged(false); onSelectionChange?.(); }}
          className={optionClass(!shopArranged)}
        >
          <div className="flex items-center justify-between gap-2">
            <strong className="text-sm font-bold text-slate-900">Giao hàng tiêu chuẩn</strong>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-slate-950">
              Khuyên dùng
            </span>
          </div>
          <span className="mt-1.5 block text-xs leading-5 text-slate-500">
            Đội xe Bảo An giao miễn phí trong {freeRadiusKm} km, giao toàn quốc qua GHN Express.
          </span>

          {!shopArranged && (
            <div className="mt-3.5 border-t border-slate-100 pt-3 text-xs" aria-live="polite">
              {quotePending ? (
                <span className="inline-flex items-center gap-1.5 font-bold text-slate-500">
                  <Spinner className="size-3.5 animate-spin text-slate-900" /> Đang tính phí vận chuyển...
                </span>
              ) : quoteView ? (
                <div className={`space-y-1 transition-opacity ${refreshingQuote ? 'opacity-60' : ''}`} aria-busy={refreshingQuote}>
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span
                      className={`text-sm font-black ${
                        !quoteView.shippingFeePending && quoteView.shippingTotalAmount === 0 ? 'text-success-700' : 'text-slate-900'
                      }`}
                    >
                      {quoteView.shippingFeePending
                        ? 'Shop báo riêng'
                        : quoteView.shippingTotalAmount === 0
                          ? 'Miễn phí giao hàng'
                          : quoteView.shippingTotalLabel}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="font-semibold text-slate-600">{quoteView.shippingMethodLabel}</span>
                    {refreshingQuote && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                        <Spinner className="size-3 animate-spin" /> Đang cập nhật
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-medium text-slate-500">
                    Dự kiến nhận hàng: <strong className="font-bold text-slate-700">{quoteView.etaLabel}</strong>
                  </p>
                  {quoteView.branchName && (
                    <p className="text-[11px] text-slate-400">Phục vụ từ: {quoteView.branchName}</p>
                  )}
                </div>
              ) : !readyToQuote ? (
                <span className="font-semibold text-slate-400">
                  Điền thông tin địa chỉ ở bước 1 để hệ thống báo giá giao hàng.
                </span>
              ) : (
                <span className="font-semibold text-rose-600">Chưa tính được phí vận chuyển</span>
              )}
            </div>
          )}
        </button>

        <button
          type="button"
          role="radio"
          aria-checked={shopArranged}
          onClick={() => { if (shopArranged) return; setShopArranged(true); onSelectionChange?.(); }}
          className={optionClass(shopArranged)}
        >
          <strong className="text-sm font-bold text-slate-900">Nhờ shop tư vấn & gửi chành</strong>
          <span className="mt-1.5 block text-xs leading-5 text-slate-500">
            Dành cho giàn tạ, máy khối lớn gửi xe khách / xe tải liên tỉnh. Bạn đặt hàng được ngay, shop sẽ gọi thống nhất cước gửi xe và thu riêng.
          </span>
          {shopArranged && (
            <div className="mt-3.5 border-t border-slate-100 pt-3">
              <span className="inline-block rounded-lg bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-800">
                Đặt hàng được ngay · phí vận chuyển shop báo và thu riêng
              </span>
            </div>
          )}
        </button>
      </div>

      {error && !autoQuoting && !quote && (
        <InlineAlert role="alert" className="mt-4 flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 sm:flex-row sm:items-center sm:justify-between">
          <span className="flex items-start gap-2"><AlertTriangle aria-hidden className="mt-0.5 size-4 shrink-0" /> {error}</span>
          <Button variant="danger" size="md" onClick={retryQuote} className="shrink-0 gap-1.5 text-xs font-bold shadow-sm focus-visible:ring-rose-500">
            <RotateCcw aria-hidden className="size-3.5" /> Thử lại
          </Button>
        </InlineAlert>
      )}
    </CheckoutStepSection>
  );
}
