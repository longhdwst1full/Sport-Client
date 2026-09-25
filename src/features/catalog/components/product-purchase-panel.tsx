'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  Minus,
  Plus,
  CreditCard,
  Check,
  Phone,
} from 'lucide-react';
import { addCartItem } from '@/app/store/cart.slice';
import { useAppDispatch } from '@/app/store/hooks';
import type { ProductPurchaseView } from '../model/product.mapper';
import { STORE_CONTACT, STORE_POLICY_PAGES } from '@/shared/constants';

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

const ADDED_TOAST_MS = 2500;

export function ProductPurchasePanel({ product }: { product: ProductPurchaseView }) {
  const dispatch = useAppDispatch();
  const router = useRouter();

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
    dispatch(
      addCartItem({
        productId: product.id,
        variantId: selectedVariant.id,
        sku: selectedVariant.sku,
        productType: product.productTypeCode,
        name: `${product.name} — ${selectedVariant.name}`,
        imageUrl: product.imageUrl ?? undefined,
        price,
        quantity,
      })
    );
    setIsAddedToast(true);
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setIsAddedToast(false), ADDED_TOAST_MS);
  };

  const handleBuyNow = () => {
    if (!selectedVariant || !canAdd || price === null) return;
    dispatch(
      addCartItem({
        productId: product.id,
        variantId: selectedVariant.id,
        sku: selectedVariant.sku,
        productType: product.productTypeCode,
        name: `${product.name} — ${selectedVariant.name}`,
        imageUrl: product.imageUrl ?? undefined,
        price,
        quantity,
      })
    );
    window.location.href = '/checkout';
  };

  return (
    <section
      className="flex flex-col gap-6 rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-8"
      aria-labelledby="purchase-heading"
    >
      {/* Price & Rating Header */}
      <div>
        {/* Không hiển thị giá gạch hay "Tiết kiệm x%": contract chưa có giá gốc/khuyến mãi theo
            biến thể, bản trước tự nhân giá bán ×1,25 để dựng ra mức giảm không có thật. */}
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <div className="min-w-0">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              {canAdd || outOfStock ? 'Giá bán niêm yết (Đã gồm VAT)' : 'Giá bán'}
            </span>
            <strong className="mt-1 block break-words text-2xl font-black text-emerald-700 min-[400px]:text-3xl sm:text-4xl">
              {(canAdd || outOfStock) && selectedVariant ? selectedVariant.priceLabel : 'Liên hệ báo giá'}
            </strong>
            {outOfStock && (
              <span className="mt-2 inline-block rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                Tạm hết hàng
              </span>
            )}
          </div>
        </div>

        {/* Live Stock & Showroom Indicator */}
        {/* Không khai "Còn hàng": contract sản phẩm chưa trả tồn kho, mà hứa có hàng rồi
            báo hết khi khách đã đặt là sai với khách. */}
        <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-stone-500">
          <span>Liên hệ cửa hàng để biết tình trạng hàng, thời gian giao và lắp đặt</span>
        </div>
      </div>

      <hr className="border-stone-100" />

      {/* Variant Selector */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <h2 id="purchase-heading" className="text-sm font-black uppercase tracking-wider text-ink">
            Phiên bản / Quy cách
          </h2>
          {/* "có sẵn" từng ngụ ý còn hàng; contract chưa có tồn kho nên chỉ đếm số phiên bản. */}
          <span className="text-xs text-stone-500">{variants.length} phiên bản</span>
        </div>

        <div className="mt-3 grid gap-2.5">
          {variants.map((variant) => {
            const isSelected = variant.id === selectedVariant?.id;

            return (
              <button
                key={variant.id}
                type="button"
                aria-pressed={isSelected}
                className={`relative flex items-center justify-between gap-3 rounded-2xl border p-4 text-left transition ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-sm ring-2 ring-emerald-500/20'
                    : 'border-stone-200/80 bg-white hover:border-emerald-300 hover:bg-stone-50/50'
                }`}
                onClick={() => setSelectedVariantId(variant.id)}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`grid size-5 shrink-0 place-items-center rounded-full border transition ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-stone-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="size-3 stroke-[3]" />}
                  </div>
                  <div className="min-w-0">
                    <span className="block break-words font-bold text-ink">{variant.name}</span>
                    <span className="break-all text-xs text-stone-500">Mã SKU: {variant.sku}</span>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <strong className="block text-sm font-black text-ink">
                    {variant.priceAmount !== null ? variant.priceLabel : 'Liên hệ'}
                  </strong>
                  {!variant.sellable && (
                    <span className="text-[11px] text-stone-500">
                      {variant.inStock === false && variant.priceAmount !== null ? 'Tạm hết hàng' : 'Chưa mở bán online'}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bundle Breakdown if Variant has Bundle */}
      {(selectedVariant?.bundleComponents.length ?? 0) > 0 && (
        <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/40 p-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
            <CheckCircle2 className="size-4 text-emerald-600" />
            <span>Combo này bao gồm các linh kiện:</span>
          </div>
          <ul className="mt-2.5 space-y-1.5 text-xs text-stone-700">
            {selectedVariant!.bundleComponents.map((component) => (
              <li key={component.componentVariantId} className="flex items-center justify-between">
                <span className="font-semibold">{component.componentName}</span>
                <span className="rounded bg-white px-2 py-0.5 text-[11px] font-bold text-emerald-700 shadow-sm">
                  SL: {component.quantity}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] text-stone-500">
            * Combo được đóng gói nguyên đai kiện từ nhà sản xuất; khi bảo hành/đổi trả cần giữ nguyên phụ kiện.
          </p>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-ink">Số lượng:</span>
        <div className="flex items-center rounded-full border border-stone-200 bg-stone-50 p-1">
          <button
            type="button"
            aria-label="Giảm số lượng"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className={`grid size-8 place-items-center rounded-full bg-white text-ink shadow-sm transition hover:bg-stone-200 ${
              quantity <= 1 ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            <Minus className="size-3.5" />
          </button>
          <span className="w-12 text-center text-sm font-extrabold text-ink">{quantity}</span>
          <button
            type="button"
            aria-label="Tăng số lượng"
            onClick={() => setQuantity((q) => q + 1)}
            className="grid size-8 place-items-center rounded-full bg-white text-ink shadow-sm transition hover:bg-stone-200"
          >
            <Plus className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Không hiển thị quà tặng hay "trả góp từ ~x đ/tháng": contract chưa có khuyến mãi quà tặng
          hay gói trả góp theo sản phẩm, bản trước viết cứng quà và trị giá cho mọi sản phẩm. */}
      {!canAdd && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 text-xs text-amber-900" role="status">
          <p className="font-bold">
            {outOfStock ? 'Phiên bản này đang tạm hết hàng.' : 'Phiên bản này chưa có giá bán online.'}
          </p>
          <p className="mt-1">
            Gọi{' '}
            <a
              href={`tel:${STORE_CONTACT.primaryHotlineRaw}`}
              className="inline-flex items-center gap-1 font-extrabold text-emerald-700 underline-offset-2 hover:underline"
            >
              <Phone className="size-3" aria-hidden="true" />
              {STORE_CONTACT.primaryHotline}
            </a>{' '}
            {outOfStock ? 'để hỏi thời gian có hàng.' : 'để được báo giá.'}
          </p>
        </div>
      )}

      {/* Toast Feedback */}
      {isAddedToast && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 animate-fade-in">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>Đã thêm sản phẩm vào giỏ hàng thành công!</span>
        </div>
      )}

      {/* CTA Buttons (Add to Cart + Buy Now) */}
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          disabled={!canAdd}
          onClick={handleAddToCart}
          className="flex items-center justify-center gap-2 rounded-full border-2 border-slate-900 bg-white px-5 py-3.5 font-bold text-slate-900 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShoppingBag className="size-4" />
          <span>{canAdd ? 'Thêm vào giỏ' : outOfStock ? 'Tạm hết hàng' : 'Liên hệ báo giá'}</span>
        </button>

        <button
          type="button"
          disabled={!canAdd}
          onClick={handleBuyNow}
          className="flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-500 hover:shadow-emerald-600/40 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Zap className="size-4 fill-white" />
          <span>Mua ngay</span>
        </button>
      </div>

      {/* Chính sách chung của cửa hàng: dẫn sang trang chính sách, không khai mức cam kết riêng cho sản phẩm. */}
      <nav aria-label="Chính sách mua hàng" className="grid grid-cols-1 gap-2 border-t border-stone-100 pt-5 text-xs min-[400px]:grid-cols-2">
        {STORE_POLICY_LINKS.map(({ icon: Icon, title, href }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 font-bold text-ink transition hover:bg-stone-50 hover:text-emerald-700"
          >
            <Icon className="size-4 shrink-0 text-emerald-600" aria-hidden="true" />
            <span>{title}</span>
          </Link>
        ))}
      </nav>
    </section>
  );
}
