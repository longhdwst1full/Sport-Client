'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/foundation/components/feedback';
import { ProductCardSkeleton } from './product-card-skeleton';

/**
 * `ProductShowcase` tách chunk riêng cho trang chủ (khối nằm dưới hero): Query + giỏ hàng + thẻ sản
 * phẩm không còn tính vào First Load JS của `/`. Vẫn SSR (`ssr` mặc định) nên HTML đầu có sẵn lưới
 * sản phẩm (SEO) và lúc hydrate React giữ HTML server tới khi chunk về — không CLS. Khung chờ chỉ hiện
 * khi điều hướng phía client trước khi chunk tải xong; cùng lưới với khối thật (RULE-SKEL-03).
 */
export const ProductShowcaseLazy = dynamic(
  () => import('./product-showcase').then((module) => module.ProductShowcase),
  { loading: ProductShowcaseSkeleton },
);

/** Cùng `GRID_CLASS` và số thẻ với lưới `ProductShowcase` (hàng đầu 4 cột desktop). */
const GRID_CLASS = 'grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4';
const SKELETON_CARD_COUNT = 4;
const SKELETON_CHIP_COUNT = 5;

function ProductShowcaseSkeleton() {
  return (
    <div className="space-y-8" role="status" aria-label="Đang tải danh sách sản phẩm">
      <div className="flex flex-wrap items-center gap-2 pb-2">
        {Array.from({ length: SKELETON_CHIP_COUNT }, (_, index) => (
          <Skeleton key={index} className="h-9 w-24 rounded-full" />
        ))}
      </div>
      <div className={GRID_CLASS}>
        {Array.from({ length: SKELETON_CARD_COUNT }, (_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
