import { AlertTriangle, RotateCcw, Truck } from 'lucide-react';
import { Spinner } from '@/foundation/components/feedback';
import type { CheckoutQuoteDto } from '@/generated/api/checkout/checkout.schemas';
import type { CheckoutQuoteView } from '../../model/checkout.mapper';
import { optionClass } from './checkout-section.styles';

/** Bước 2: giao tiêu chuẩn (kèm kết quả báo giá tự động) hoặc nhờ shop gửi chành; lỗi báo giá có nút thử lại. */
export function CheckoutDeliveryMethodSection({
  shopArranged,
  setShopArranged,
  invalidateQuote,
  freeRadiusKm,
  quotePending,
  quoteView,
  readyToQuote,
  error,
  autoQuoting,
  quote,
  retryQuote,
}: {
  shopArranged: boolean;
  setShopArranged: (value: boolean) => void;
  invalidateQuote: () => void;
  freeRadiusKm: number;
  quotePending: boolean;
  quoteView: CheckoutQuoteView | undefined;
  readyToQuote: boolean;
  error: string;
  autoQuoting: boolean;
  quote: CheckoutQuoteDto | undefined;
  retryQuote: () => void;
}) {
  return (
    <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm transition hover:border-slate-300">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <span className="grid size-8 place-items-center rounded-xl bg-emerald-600 text-sm font-black text-white shadow-sm shadow-emerald-600/30">
          2
        </span>
        <div>
          <h2 className="flex items-center gap-2 text-base font-black text-slate-900 sm:text-lg">
            <Truck className="size-5 text-emerald-600" /> Phương thức vận chuyển
          </h2>
          <p className="text-xs text-slate-500">Cước phí tính toán tự động và minh bạch</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3.5 sm:grid-cols-2" role="radiogroup" aria-label="Cách giao hàng">
        <button
          type="button"
          role="radio"
          aria-checked={!shopArranged}
          onClick={() => { if (!shopArranged) return; setShopArranged(false); invalidateQuote(); }}
          className={optionClass(!shopArranged)}
        >
          <div className="flex items-center justify-between gap-2">
            <strong className="text-sm font-bold text-slate-900">Giao hàng tiêu chuẩn</strong>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-800">
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
                  <Spinner className="size-3.5 animate-spin text-emerald-600" /> Đang tính phí vận chuyển...
                </span>
              ) : quoteView ? (
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-black text-emerald-700">
                      {quoteView.shippingFeePending
                        ? 'Shop báo riêng'
                        : quoteView.shippingTotalAmount === 0
                          ? 'Miễn phí giao hàng'
                          : quoteView.shippingTotalLabel}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="font-semibold text-slate-600">{quoteView.shippingMethodLabel}</span>
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
          onClick={() => { if (shopArranged) return; setShopArranged(true); invalidateQuote(); }}
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
        <div role="alert" className="mt-4 flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 sm:flex-row sm:items-center sm:justify-between">
          <span className="flex items-start gap-2"><AlertTriangle className="mt-0.5 size-4 shrink-0" /> {error}</span>
          <button type="button" onClick={retryQuote} className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-rose-700">
            <RotateCcw className="size-3.5" /> Thử lại
          </button>
        </div>
      )}
    </section>
  );
}
