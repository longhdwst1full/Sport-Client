import Link from 'next/link';
import { CreditCard, Truck } from 'lucide-react';
import { buttonVariants } from '@/foundation/components/buttons';
import { DescriptionList } from '@/foundation/components/structure';

/** Không còn dòng nào để thanh toán (giỏ trống hoặc tham số mua ngay/chọn dòng không khớp giỏ). */
export function CheckoutEmptyCart() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link href="/cart" className="text-sm font-bold text-neutral-900 hover:underline">
          ← Quay lại giỏ hàng
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
          Thanh toán đơn hàng
        </h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="rounded-3xl border border-dashed border-neutral-300 bg-white p-8 text-center sm:p-12 shadow-sm">
          <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-amber-50 text-amber-600">
            <Truck className="size-8" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-neutral-900">Giỏ hàng của bạn đang trống</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-neutral-500 leading-relaxed">
            Bạn chưa có sản phẩm nào trong giỏ để thực hiện thanh toán. Vui lòng chọn sản phẩm thể thao ưng ý trước khi hoàn tất đặt hàng.
          </p>

          {/* Payment Methods Info */}
          <div className="mt-8 rounded-2xl border border-neutral-100 bg-neutral-50 p-5 text-left">
            <span className="block eyebrow text-neutral-500">
              Phương thức thanh toán hỗ trợ:
            </span>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2 text-xs font-semibold text-neutral-700">
              <div className="flex items-center gap-2 rounded-xl bg-white p-3 border border-neutral-200">
                <span className="grid size-6 place-items-center rounded bg-neutral-100 text-neutral-900 font-semibold text-3xs">COD</span>
                <span>Thanh toán khi nhận hàng (COD)</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white p-3 border border-neutral-200">
                <CreditCard className="size-4 text-neutral-900" />
                <span>Chuyển khoản VietQR / VNPay</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/products"
              className={buttonVariants({ variant: 'primary', className: 'rounded-full px-6 font-bold shadow-md shadow-neutral-900/20' })}
            >
              <span>Tiếp tục mua sắm</span>
            </Link>
            <Link
              href="/cart"
              className={buttonVariants({ variant: 'outline', className: 'rounded-full px-6 font-bold' })}
            >
              <span>Về giỏ hàng</span>
            </Link>
          </div>
        </div>

        <aside className="h-fit surface-card p-6 shadow-sm">
          <h2 className="text-base font-bold text-neutral-950">Tóm tắt đơn hàng</h2>
          <div className="mt-4 space-y-3 border-t border-neutral-100 pt-4 text-sm">
            <DescriptionList
              layout="inline"
              className="gap-y-3"
              valueClassName="font-bold"
              items={[
                { label: 'Tạm tính', value: '0 ₫' },
                { label: 'Phí vận chuyển', value: 'Tính khi có hàng', valueClassName: 'font-normal text-neutral-400' },
              ]}
            />
            <DescriptionList
              layout="inline"
              className="border-t border-neutral-100 pt-3 text-base font-bold"
              labelClassName="text-neutral-950"
              valueClassName="font-bold text-neutral-950"
              items={[{ label: 'Tổng tiền', value: '0 ₫' }]}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
