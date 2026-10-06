import Link from 'next/link';
import { CreditCard, RotateCcw, ShieldCheck, Truck } from 'lucide-react';
import { STORE_POLICY_PAGES } from '@/shared/constants';

/**
 * Chính sách áp dụng toàn cửa hàng, dẫn sang trang CMS thật.
 * Bản trước khai "Giao nhanh 2 Giờ", "Bảo hành 24 Tháng", "Đổi mới 7 Ngày" cho MỌI sản phẩm
 * trong khi contract không có dữ liệu bảo hành/giao hàng theo sản phẩm; mức cụ thể do trang
 * chính sách công bố, không lặp lại số ở đây.
 */
const STORE_POLICY_LINKS = [
  { icon: Truck, ...STORE_POLICY_PAGES.SHIPPING },
  { icon: ShieldCheck, ...STORE_POLICY_PAGES.WARRANTY },
  { icon: RotateCcw, ...STORE_POLICY_PAGES.RETURNS },
  { icon: CreditCard, ...STORE_POLICY_PAGES.PAYMENT },
];

export function StorePolicyLinks() {
  return (
    <nav aria-label="Chính sách mua hàng" className="grid grid-cols-1 gap-2 border-t border-stone-100 pt-5 text-xs min-[400px]:grid-cols-2">
      {STORE_POLICY_LINKS.map(({ icon: Icon, title, href }) => (
        <Link
          key={href}
          href={href}
          className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 font-bold text-ink transition hover:bg-stone-50 hover:text-brand-700"
        >
          <Icon className="size-4 shrink-0 text-brand-600" aria-hidden="true" />
          <span>{title}</span>
        </Link>
      ))}
    </nav>
  );
}
