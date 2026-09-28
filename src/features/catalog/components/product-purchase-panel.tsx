'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCartActions } from '@/features/cart';
import type { ProductPurchaseView } from '../model/product.mapper';
import { useToast } from '@/shared/components/global-toast';
import { ProductPriceHeader } from './product-price-header';
import { VariantSelector } from './variant-selector';
import { BundleBreakdown } from './bundle-breakdown';
import { PurchaseActions } from './purchase-actions';
import { StorePolicyLinks } from './store-policy-links';

const ADDED_TOAST_MS = 2500;

export function ProductPurchasePanel({ product }: { product: ProductPurchaseView }) {
  const { addItem } = useCartActions();
  const router = useRouter();
  const { cart: toastCart } = useToast();

  const variants = product.variants;
  // Mặc định chọn biến thể bán được đầu tiên; chọn biến thể chưa có giá làm mặc định là
  // khoá nút mua dù sản phẩm vẫn có phiên bản khác đang bán.
  const [selectedVariantId, setSelectedVariantId] = useState(
    () => (variants.find(({ sellable }) => sellable) ?? variants[0])?.id ?? '',
  );
  const [quantity, setQuantity] = useState(1);
  const [isAddedToast, setIsAddedToast] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    router.prefetch('/checkout');
    router.prefetch('/cart');
  }, [router]);

  // Hẹn giờ ẩn toast phải huỷ khi rời trang, nếu không sẽ setState trên component đã gỡ.
  useEffect(() => () => clearTimeout(toastTimerRef.current), []);

  const selectedVariant = variants.find(({ id }) => id === selectedVariantId) ?? variants[0];
  // INVARIANT: chỉ đưa vào giỏ biến thể ACTIVE có giá hiệu lực (`sellable` do mapper tính).
  // Không có giá thì không có "giá 0": giỏ và checkout sẽ báo giá lệch hẳn với màn này.
  const price = selectedVariant?.sellable ? selectedVariant.priceAmount : null;
  const canAdd = Boolean(selectedVariant?.sellable && price !== null);
  // Hết hàng vẫn hiện giá (có giá thật) nhưng khoá mua: không đưa hàng không có sẵn vào checkout.
  const outOfStock = selectedVariant?.inStock === false && selectedVariant.priceAmount !== null;

  const handleAddToCart = () => {
    if (!selectedVariant || !canAdd || price === null) return;
    addItem({
        productId: product.id,
        variantId: selectedVariant.id,
        sku: selectedVariant.sku,
        productType: product.productTypeCode,
        name: `${product.name} — ${selectedVariant.name}`,
        slug: product.slug,
        imageUrl: product.imageUrl ?? undefined,
        price,
        quantity,
      });
    setIsAddedToast(true);
    toastCart('Đã thêm vào giỏ hàng', `${product.name} (${selectedVariant.name}) x${quantity}`);
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setIsAddedToast(false), ADDED_TOAST_MS);
  };

  const handleBuyNow = () => {
    if (!selectedVariant || !canAdd || price === null) return;
    addItem({
        productId: product.id,
        variantId: selectedVariant.id,
        sku: selectedVariant.sku,
        productType: product.productTypeCode,
        name: `${product.name} — ${selectedVariant.name}`,
        slug: product.slug,
        imageUrl: product.imageUrl ?? undefined,
        price,
        quantity,
      });
    router.push(`/checkout?buyNow=${selectedVariant.id}`);
  };

  return (
    <section
      className="flex flex-col gap-6 rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-8"
      aria-labelledby="purchase-heading"
    >
      {/* Price & Rating Header */}
      <ProductPriceHeader
        canAdd={canAdd}
        outOfStock={outOfStock}
        priceLabel={selectedVariant?.priceLabel}
      />

      <hr className="border-stone-100" />

      {/* Variant Selector */}
      <VariantSelector
        variants={variants}
        selectedVariantId={selectedVariant?.id}
        onSelectVariant={setSelectedVariantId}
      />

      {/* Bundle Breakdown if Variant has Bundle */}
      <BundleBreakdown components={selectedVariant?.bundleComponents ?? []} />

      <PurchaseActions
        quantity={quantity}
        onDecrementQuantity={() => setQuantity((q) => Math.max(1, q - 1))}
        onIncrementQuantity={() => setQuantity((q) => q + 1)}
        canAdd={canAdd}
        outOfStock={outOfStock}
        isAddedToast={isAddedToast}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      {/* Chính sách chung của cửa hàng: dẫn sang trang chính sách, không khai mức cam kết riêng cho sản phẩm. */}
      <StorePolicyLinks />
    </section>
  );
}
