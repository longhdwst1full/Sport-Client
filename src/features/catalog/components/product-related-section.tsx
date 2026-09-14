'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { useAppDispatch } from '@/app/store/hooks';
import { addCartItem } from '@/app/store/cart.slice';
import { Skeleton, SkeletonText } from '@/foundation/components/feedback';
import { useToast } from '@/shared/components/global-toast';
import { useProductShowcase, type ProductShowcaseItem } from '../hooks/use-product-showcase';

/**
 * Sản phẩm liên quan trên trang chi tiết.
 *
 * Bản trước dựng từ mock kèm một khối flash sale với đồng hồ đếm ngược giả tự
 * reset. Flash sale thật nằm ở `features/promotions` với quota và giờ server,
 * nên khối đó được gỡ thay vì duy trì hai nguồn mâu thuẫn nhau.
 */
export function ProductRelatedSection({
  currentSlug,
  currentCategory,
}: {
  currentSlug: string;
  currentCategory?: string;
  productName?: string;
}) {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { products, isPending, isError } = useProductShowcase();

  const related = useMemo(() => {
    const others = products.filter((product) => product.slug !== currentSlug);
    // Ưu tiên cùng danh mục, thiếu thì bù bằng sản phẩm khác.
    const sameCategory = others.filter((product) => product.category === currentCategory);
    const rest = others.filter((product) => product.category !== currentCategory);
    return [...sameCategory, ...rest].slice(0, 4);
  }, [products, currentSlug, currentCategory]);

  const handleQuickAdd = (product: ProductShowcaseItem) => {
    if (!product.defaultVariantId || !product.defaultVariantSku) {
      toast({
        type: 'info',
        title: 'Cần chọn phiên bản',
        message: 'Sản phẩm này có nhiều phiên bản, vui lòng mở trang chi tiết để chọn.',
      });
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
    toast({ type: 'success', title: 'Đã thêm vào giỏ', message: product.name });
  };

  if (isError || (!isPending && related.length === 0)) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-ink sm:text-2xl">Sản phẩm liên quan</h2>
          <p className="mt-1 text-sm text-slate-500">Thiết bị cùng nhóm được khách xem nhiều.</p>
        </div>
        <Link
          href="/products"
          className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
        >
          Xem tất cả <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {isPending
          ? Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-sm"
              >
                <Skeleton className="aspect-square rounded-none" />
                <div className="p-5">
                  <Skeleton className="h-3 w-1/3" />
                  <SkeletonText lines={2} className="mt-3" />
                  <Skeleton className="mt-4 h-5 w-1/2" />
                </div>
              </div>
            ))
          : related.map((product) => (
              <article
                key={product.id}
                className="group flex flex-col overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-400 hover:shadow-xl"
              >
                <Link
                  href={`/products/${product.slug}`}
                  className="relative aspect-square overflow-hidden bg-slate-50"
                >
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    className="object-contain p-4 transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full border border-slate-100 bg-white/95 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-800 shadow-sm backdrop-blur">
                    {product.productType === 'BUNDLE' ? 'Combo trọn bộ' : product.badge}
                  </span>
                </Link>

                <div className="flex flex-1 flex-col p-5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {product.brand}
                  </p>
                  <h3 className="mt-1 line-clamp-2 min-h-[40px] text-sm font-bold text-ink transition group-hover:text-emerald-700">
                    <Link href={`/products/${product.slug}`}>{product.name}</Link>
                  </h3>

                  <strong className="mt-3 text-base font-black text-emerald-700">
                    {product.displayPrice}
                  </strong>

                  <button
                    type="button"
                    onClick={() => handleQuickAdd(product)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-emerald-700 hover:text-white"
                  >
                    <ShoppingBag className="size-3.5" />
                    Thêm vào giỏ
                  </button>
                </div>
              </article>
            ))}
      </div>
    </section>
  );
}
