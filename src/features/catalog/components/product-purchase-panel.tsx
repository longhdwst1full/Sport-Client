'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Zap,
  ShieldCheck,
  Truck,
  Wrench,
  RotateCcw,
  CheckCircle2,
  MapPin,
  Minus,
  Plus,
  CreditCard,
  Check,
  Gift,
} from 'lucide-react';
import { addCartItem } from '@/app/store/cart.slice';
import { useAppDispatch } from '@/app/store/hooks';
import type { ProductDetailDto } from '@/generated/api/catalog/models';
import { vndMoney } from '@/shared/format/money';

export function ProductPurchasePanel({ product }: { product: ProductDetailDto }) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const variants = product.variants ?? [];
  const [selectedVariantId, setSelectedVariantId] = useState(variants[0]?.id ?? '');
  const [quantity, setQuantity] = useState(1);
  const [isAddedToast, setIsAddedToast] = useState(false);

  const selectedVariant = variants.find(({ id }) => id === selectedVariantId) ?? variants[0];
  const price = Number(selectedVariant?.effectivePrice ?? 0);
  const canAdd = Boolean(selectedVariant && price > 0);

  const handleAddToCart = () => {
    if (!selectedVariant || !canAdd) return;
    dispatch(
      addCartItem({
        productId: product.id,
        variantId: selectedVariant.id,
        sku: selectedVariant.sku,
        productType: product.productType,
        name: `${product.name} — ${selectedVariant.name}`,
        imageUrl: product.imageUrl ?? undefined,
        price,
        quantity,
      })
    );
    setIsAddedToast(true);
    setTimeout(() => setIsAddedToast(false), 2500);
  };

  const handleBuyNow = () => {
    if (!selectedVariant || !canAdd) return;
    dispatch(
      addCartItem({
        productId: product.id,
        variantId: selectedVariant.id,
        sku: selectedVariant.sku,
        productType: product.productType,
        name: `${product.name} — ${selectedVariant.name}`,
        imageUrl: product.imageUrl ?? undefined,
        price,
        quantity,
      })
    );
    router.push('/checkout');
  };

  return (
    <section
      className="flex flex-col gap-6 rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-8"
      aria-labelledby="purchase-heading"
    >
      {/* Price & Rating Header */}
      <div>
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Giá bán niêm yết (Đã gồm VAT)
            </span>
            <div className="mt-1 flex items-baseline gap-3">
              <strong className="text-3xl font-black text-emerald-700 sm:text-4xl">
                {price > 0 ? vndMoney.format(price) : 'Liên hệ báo giá'}
              </strong>
              {price > 0 && (
                <span className="text-sm font-semibold text-stone-400 line-through">
                  {vndMoney.format(Math.round(price * 1.25))}
                </span>
              )}
            </div>
          </div>
          {price > 0 && (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-800">
              Tiết kiệm 20%
            </span>
          )}
        </div>

        {/* Live Stock & Showroom Indicator */}
        <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-emerald-700">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex size-2 rounded-full bg-emerald-600"></span>
          </span>
          <span>Sẵn hàng tại 12 showroom toàn quốc · Giao lắp trong 2H</span>
        </div>
      </div>

      <hr className="border-stone-100" />

      {/* Variant Selector */}
      <div>
        <div className="flex items-center justify-between">
          <h2 id="purchase-heading" className="text-sm font-black uppercase tracking-wider text-ink">
            Phiên bản / Quy cách
          </h2>
          <span className="text-xs text-stone-500">
            {variants.length} lựa chọn có sẵn
          </span>
        </div>

        <div className="mt-3 grid gap-2.5">
          {variants.map((variant) => {
            const isSelected = variant.id === selectedVariantId;
            const variantPrice = Number(variant.effectivePrice ?? 0);

            return (
              <button
                key={variant.id}
                type="button"
                aria-pressed={isSelected}
                className={`relative flex items-center justify-between rounded-2xl border p-4 text-left transition ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-sm ring-2 ring-emerald-500/20'
                    : 'border-stone-200/80 bg-white hover:border-emerald-300 hover:bg-stone-50/50'
                }`}
                onClick={() => setSelectedVariantId(variant.id)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`grid size-5 place-items-center rounded-full border transition ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-stone-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="size-3 stroke-[3]" />}
                  </div>
                  <div>
                    <span className="block font-bold text-ink">{variant.name}</span>
                    <span className="text-xs text-stone-500">Mã SKU: {variant.sku}</span>
                  </div>
                </div>
                <div className="text-right">
                  <strong className="block text-sm font-black text-ink">
                    {variantPrice > 0 ? vndMoney.format(variantPrice) : 'Chưa có giá'}
                  </strong>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bundle Breakdown if Variant has Bundle */}
      {selectedVariant?.bundle && (
        <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/40 p-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
            <CheckCircle2 className="size-4 text-emerald-600" />
            <span>Combo này bao gồm các linh kiện:</span>
          </div>
          <ul className="mt-2.5 space-y-1.5 text-xs text-stone-700">
            {selectedVariant.bundle.components.map((component) => (
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
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="grid size-8 place-items-center rounded-full bg-white text-ink shadow-sm transition hover:bg-stone-200"
            disabled={quantity <= 1}
          >
            <Minus className="size-3.5" />
          </button>
          <span className="w-12 text-center text-sm font-extrabold text-ink">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="grid size-8 place-items-center rounded-full bg-white text-ink shadow-sm transition hover:bg-stone-200"
          >
            <Plus className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Exclusive Gifts Bundling (Inspired by Elipsport & Kingsport) */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-900">
          <Gift className="size-4 text-amber-600" />
          <span>Quà tặng độc quyền theo đơn hàng:</span>
        </div>
        <div className="mt-2.5 space-y-1.5 text-xs">
          <div className="flex items-center justify-between rounded-xl bg-white p-2.5 shadow-sm border border-amber-100">
            <span className="font-semibold text-slate-800">🎁 Găng tay thể hình DCTD Pro Grip</span>
            <span className="text-[11px] font-bold text-amber-700">Trị giá 350.000đ (0đ)</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-white p-2.5 shadow-sm border border-amber-100">
            <span className="font-semibold text-slate-800">🎁 Thảm cao su giảm chấn sàn EPDM 15mm</span>
            <span className="text-[11px] font-bold text-amber-700">Trị giá 450.000đ (0đ)</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-white p-2.5 shadow-sm border border-amber-100">
            <span className="font-semibold text-slate-800">🎁 Bình nước thể thao Inox DCTD giữ nhiệt 24h</span>
            <span className="text-[11px] font-bold text-amber-700">Trị giá 250.000đ (0đ)</span>
          </div>
        </div>
        <p className="mt-2 text-[11px] text-amber-800/80">
          * Quà tặng tự động đóng gói cùng kiện hàng chính khi xuất kho.
        </p>
      </div>

      {/* Installment Support Note */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-2.5 text-xs">
        <div className="flex items-center gap-2">
          <CreditCard className="size-4 text-emerald-600" />
          <span className="font-semibold text-slate-700">Hỗ trợ trả góp 0% lãi suất</span>
        </div>
        <span className="font-bold text-emerald-700">Chỉ từ ~490.000đ/tháng</span>
      </div>

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
          <span>Thêm vào giỏ</span>
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

      {/* Service Perks & Warranty */}
      <div className="grid grid-cols-2 gap-3 border-t border-stone-100 pt-5 text-xs">
        <div className="flex items-start gap-2.5 text-stone-600">
          <Truck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
          <div>
            <strong className="block font-bold text-ink">Giao nhanh 2 Giờ</strong>
            <span>Nội thành Hà Nội & TP.HCM</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5 text-stone-600">
          <Wrench className="mt-0.5 size-4 shrink-0 text-emerald-600" />
          <div>
            <strong className="block font-bold text-ink">Lắp đặt tại nhà</strong>
            <span>Kỹ thuật viên chuyên nghiệp</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5 text-stone-600">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
          <div>
            <strong className="block font-bold text-ink">Bảo hành 24 Tháng</strong>
            <span>Chính hãng tại nhà khách</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5 text-stone-600">
          <RotateCcw className="mt-0.5 size-4 shrink-0 text-emerald-600" />
          <div>
            <strong className="block font-bold text-ink">Đổi mới 7 Ngày</strong>
            <span>Lỗi 1 đổi 1 tận nơi</span>
          </div>
        </div>
      </div>
    </section>
  );
}
