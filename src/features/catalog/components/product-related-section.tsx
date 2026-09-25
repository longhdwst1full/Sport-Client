'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/app/store/hooks';
import { addCartItem } from '@/app/store/cart.slice';
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
  const dispatch = useAppDispatch();
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
    dispatch(
      addCartItem({
        variantId: product.defaultVariantId,
        productId: product.id,
        sku: product.defaultVariantSku,
        name: product.name,
        productType: product.productType === 'BUNDLE' ? 'BUNDLE' : 'STANDARD',
        price: product.numericPrice,
        quantity: 1,
        imageUrl: product.imageUrl,
      }),
    );
    router.push('/checkout');
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
              <article
                key={product.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500/80 hover:shadow-xl"
              >
                <Link
                  href={`/products/${product.slug}`}
                  className="relative aspect-square overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100/50 p-6 flex items-center justify-center"
                >
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    className="object-contain p-4 transition-transform duration-500 group-hover:scale-108"
                  />
                  <span className="absolute left-3.5 top-3.5 rounded-full border border-slate-200/80 bg-white/95 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider text-slate-700 shadow-2xs backdrop-blur-xs">
                    {product.productType === 'BUNDLE' ? 'Combo trọn bộ' : product.badge}
                  </span>
                </Link>

                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <p className="min-h-[16px] text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                      {product.brand}
                    </p>
                    <h3 className="mt-1 line-clamp-2 min-h-[44px] text-sm font-bold text-slate-800 transition-colors group-hover:text-emerald-700">
                      <Link href={`/products/${product.slug}`}>{product.name}</Link>
                    </h3>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div>
                      <span className="block text-[11px] font-medium text-slate-400">Giá niêm yết</span>
                      <strong className="text-base font-black text-emerald-700 sm:text-lg">
                        {product.displayPrice}
                      </strong>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleBuyNow(product)}
                      disabled={!product.hasPrice}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs transition-all duration-200 hover:bg-emerald-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-300"
                      title={
                        !product.hasPrice
                          ? 'Sản phẩm chưa có giá — liên hệ để được tư vấn'
                          : product.isSellable
                            ? 'Mua ngay'
                            : 'Mở chi tiết để chọn phiên bản'
                      }
                      aria-label={`Mua ngay ${product.name}`}
                    >
                      <Zap className="size-3.5 fill-white" />
                      <span>Mua ngay</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
      </div>
    </section>
  );
}
