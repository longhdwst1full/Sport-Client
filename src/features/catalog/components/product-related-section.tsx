'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCartActions } from '@/features/cart';
import { ProductCard } from './product-card';
import { Skeleton, SkeletonText } from '@/foundation/components/feedback';
import { useProductShowcase, type ProductShowcaseItem } from '../hooks/use-product-showcase';

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
  const router = useRouter();
  const { addItem } = useCartActions();
  // Lấy dư một sản phẩm vì sản phẩm đang xem có thể nằm trong trang đầu của chính danh mục đó.
  const { products, isPending, isError } = useProductShowcase(categorySlug, undefined, {
    pageSize: RELATED_LIMIT + 1,
  });

  const related = useMemo(
    () => products.filter((product) => product.slug !== currentSlug).slice(0, RELATED_LIMIT),
    [products, currentSlug],
  );

  const handleBuyNow = (product: ProductShowcaseItem) => {
    if (!product.isSellable || !product.defaultVariantId || !product.defaultVariantSku) {
      router.push(`/products/${product.slug}`);
      return;
    }
    addItem({
        variantId: product.defaultVariantId,
        productId: product.id,
        sku: product.defaultVariantSku,
        name: product.name,
        productType: product.productType === 'BUNDLE' ? 'BUNDLE' : 'STANDARD',
        price: product.numericPrice,
        quantity: 1,
        imageUrl: product.imageUrl,
        slug: product.slug,
      });
    router.push(`/checkout?buyNow=${product.defaultVariantId}`);
  };

  if (isError || (!isPending && related.length === 0)) return null;

  return (
    <section className="mx-auto mt-16 max-w-7xl px-4 pt-12 border-t border-slate-200/90 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            <Sparkles className="size-3.5 text-emerald-600" />
            Gợi ý dành cho bạn
          </div>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Sản phẩm liên quan
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {categorySlug
              ? 'Thiết bị khác trong cùng danh mục.'
              : 'Một số thiết bị khác đang bán tại Bảo An Sport.'}
          </p>
        </div>
        <Link
          href={categorySlug ? `/category/${categorySlug}` : '/products'}
          className="inline-flex shrink-0 items-center gap-1.5 self-start sm:self-auto rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-2xs transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
        >
          Xem tất cả <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {isPending
          ? Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs p-4"
              >
                <Skeleton className="aspect-square rounded-xl" />
                <div className="mt-4 space-y-2">
                  <Skeleton className="h-3 w-1/3" />
                  <SkeletonText lines={2} className="mt-2" />
                  <Skeleton className="mt-4 h-6 w-1/2" />
                </div>
              </div>
            ))
          : related.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onBuyNow={(prod) => handleBuyNow(prod)}
              />
            ))}
      </div>
    </section>
  );
}
