'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import { buttonVariants } from '@/foundation/components/buttons';
import { useCardBuyNow } from '../hooks/use-card-buy-now';
import { ProductCard, ProductCardSkeleton } from './product-card';
import { useProductShowcase } from '../hooks/use-product-showcase';

/**
 * Sản phẩm liên quan trên trang chi tiết.
 *
 * Bản trước dựng từ mock kèm một khối flash sale với đồng hồ đếm ngược giả tự
 * reset. Flash sale thật nằm ở `features/promotions` với quota và giờ server,
 * nên khối đó được gỡ thay vì duy trì hai nguồn mâu thuẫn nhau.
 */
const RELATED_LIMIT = 4;

export function ProductRelatedSection({
  currentSlug,
  categorySlug,
}: {
  currentSlug: string;
  /**
   * Slug danh mục chính của sản phẩm. `ProductDetailDto` chỉ có tên danh mục, nên trang chi
   * tiết tra slug từ cây danh mục; không tra được thì để trống và lấy sản phẩm chung.
   */
  categorySlug?: string;
}) {
  const handleBuyNow = useCardBuyNow();
  // Lấy dư một sản phẩm vì sản phẩm đang xem có thể nằm trong trang đầu của chính danh mục đó.
  const { products, isPending, isError } = useProductShowcase(categorySlug, undefined, {
    pageSize: RELATED_LIMIT + 1,
  });

  const related = useMemo(
    () => products.filter((product) => product.slug !== currentSlug).slice(0, RELATED_LIMIT),
    [products, currentSlug],
  );

  if (isError || (!isPending && related.length === 0)) return null;

  return (
    <section className="mx-auto mt-16 max-w-7xl px-4 pt-12 border-t border-neutral-200/90 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between pb-6 border-b border-neutral-100">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-neutral-50 px-3 py-1 text-xs font-bold text-neutral-900">
            <Sparkles aria-hidden className="size-3.5 text-neutral-900" />
            Gợi ý dành cho bạn
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
            Sản phẩm liên quan
          </h2>
          <p className="mt-1 text-sm text-neutral-600">
            {categorySlug
              ? 'Thiết bị khác trong cùng danh mục.'
              : 'Một số thiết bị khác đang bán tại Bảo An Sport.'}
          </p>
        </div>
        <Link
          href={categorySlug ? `/category/${categorySlug}` : '/products'}
          className={buttonVariants({
            variant: 'outline',
            className:
              'shrink-0 gap-1.5 self-start rounded-full border-neutral-200 text-xs font-bold text-neutral-700 shadow-2xs hover:border-neutral-900 hover:bg-neutral-50 sm:self-auto',
          })}
        >
          Xem tất cả <ArrowRight aria-hidden className="size-3.5" />
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {isPending
          ? Array.from({ length: 4 }, (_, index) => <ProductCardSkeleton key={index} />)
          : related.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onBuyNow={handleBuyNow}
              />
            ))}
      </div>
    </section>
  );
}
