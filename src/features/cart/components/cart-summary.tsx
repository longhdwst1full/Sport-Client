import Link from 'next/link';
import { RotateCcw, ShieldCheck, Truck } from 'lucide-react';
import { buttonVariants } from '@/foundation/components/buttons';
import { DescriptionList, IconList, type IconListItem } from '@/foundation/components/structure';
import { formatVnd } from '@/shared/format/money';

const TRUST_COMMITMENTS: IconListItem[] = [
  { icon: ShieldCheck, label: '100% Chính hãng Bảo An Sport · Bảo hành 24T' },
  { icon: RotateCcw, label: 'Đổi mới trong 7 ngày nếu lỗi từ NSX' },
  { icon: Truck, label: 'Kiểm tra hàng trước khi thanh toán COD' },
];

interface CartSummaryProps {
  selectedCount: number;
  /** Tạm tính theo giá hiển thị trong giỏ; số tiền phải trả do checkout quote quyết định. */
  subtotal: number;
  checkoutHref: string;
  onCheckoutClick: (e: React.MouseEvent) => void;
}

export function CartSummary({
  selectedCount,
  subtotal,
  checkoutHref,
  onCheckoutClick,
}: CartSummaryProps) {
  return (
    <aside className="h-fit surface-card p-6 shadow-sm lg:sticky lg:top-40">
      <h2 className="text-lg font-black text-neutral-900">Tóm tắt đơn hàng</h2>
      <div className="mt-5 space-y-3 text-sm">
        <DescriptionList
          layout="inline"
          className="gap-y-3"
          itemClassName="items-start"
          valueClassName="font-semibold"
          items={[
            { label: `Tạm tính (${selectedCount} sản phẩm)`, value: formatVnd(subtotal) },
            { label: 'Phí vận chuyển', value: 'Tính ở bước thanh toán', valueClassName: 'font-medium text-neutral-600' },
          ]}
        />
        <hr className="border-neutral-100" />
        <DescriptionList
          layout="inline"
          className="text-base"
          labelClassName="font-bold text-neutral-900"
          items={[{ label: 'Tạm tính', value: formatVnd(subtotal), valueClassName: 'text-xl font-black text-brand-700' }]}
        />
        <p className="text-xs text-neutral-500">
          Chưa gồm phí vận chuyển và khuyến mãi. Tổng thanh toán chính xác hiển thị ở bước thanh toán.
        </p>
      </div>

      {/* Checkout Button: "Đặt hàng" */}
      <Link
        href={checkoutHref}
        onClick={onCheckoutClick}
        aria-disabled={selectedCount === 0}
        className={buttonVariants({
          size: 'lg',
          fullWidth: true,
          className: `mt-6 rounded-full font-bold ${
            selectedCount > 0
              ? 'shadow-lg shadow-red-600/30'
              : 'cursor-not-allowed bg-neutral-300 shadow-none hover:bg-neutral-300 from-neutral-300 to-neutral-300'
          }`,
        })}
      >
        Đặt hàng {selectedCount > 0 ? `(${selectedCount})` : ''}
      </Link>
      <Link
        href="/products"
        className="mt-3 block rounded py-2 text-center text-xs font-semibold text-neutral-600 transition hover:text-neutral-900 focus-ring-tight"
      >
        ← Tiếp tục mua sắm
      </Link>

      {/* Conversion Trust Commitments */}
      <IconList
        items={TRUST_COMMITMENTS}
        className="mt-6 gap-3 border-t border-neutral-100 pt-5 text-xs text-neutral-600"
        itemClassName="gap-2.5"
        iconClassName="text-neutral-900"
      />
    </aside>
  );
}
