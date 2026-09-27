'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2, ShieldCheck, RotateCcw, Truck, Lock, Sparkles } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { clearCart, removeCartItem, updateQuantity } from '@/app/store/cart.slice';
import { StorefrontLayout } from '@/layouts/storefront-layout';
import { Breadcrumb } from '@/foundation/components/navigation';
import { vndMoney } from '@/shared/format/money';
import { PRODUCT_PLACEHOLDER_IMAGE } from '@/shared/constants';
import { useToast } from '@/shared/components/global-toast';

const SHIPPING_FEE = 30000;

export function CartPage() {
  const dispatch = useAppDispatch();
  const { toast, success } = useToast();
  const items = useAppSelector((s) => s.cart.items);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = items.length > 0 ? subtotal + SHIPPING_FEE : 0;

  const handleRemoveItem = (variantId: string, name: string) => {
    dispatch(removeCartItem(variantId));
    toast({
      type: 'info',
      title: 'Đã xóa sản phẩm',
      message: `${name} đã được bỏ khỏi giỏ hàng.`,
    });
  };

  const handleClearCart = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ sản phẩm trong giỏ hàng?')) {
      dispatch(clearCart());
      toast({
        type: 'info',
        title: 'Giỏ hàng trống',
        message: 'Đã xóa tất cả sản phẩm.',
      });
    }
  };

  return (
    <StorefrontLayout>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
        <Breadcrumb
          className="mb-6"
          items={[{ label: 'Trang chủ', href: '/' }, { label: 'Giỏ hàng' }]}
        />

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">
            Giỏ hàng của bạn <span className="text-slate-400 font-bold text-2xl sm:text-3xl">({items.length})</span>
          </h1>
          {items.length > 0 && (
            <button
              type="button"
              onClick={handleClearCart}
              className="text-xs font-bold text-red-500 hover:text-red-700 transition"
            >
              Xóa tất cả
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center sm:p-16 shadow-sm">
            <div className="mx-auto grid size-20 place-items-center rounded-3xl bg-emerald-50 text-emerald-600 shadow-inner">
              <ShoppingBag className="size-10" />
            </div>
            <h2 className="mt-6 text-2xl font-black text-slate-900">Giỏ hàng trống</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 leading-relaxed">
              Bạn chưa có trang thiết bị nào trong giỏ hàng. Hãy khám phá các thiết bị thể thao chuẩn thi đấu để sẵn sàng bứt phá mục tiêu!
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-7 py-3.5 font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500"
              >
                <ArrowLeft className="size-4" /> Tiếp tục mua sắm
              </Link>
            </div>

            {/* Quick Explore Pills */}
            <div className="mt-10 border-t border-slate-100 pt-8">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Gợi ý danh mục phổ biến:
              </span>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {[
                  { name: 'Máy chạy bộ', href: '/products?category=may-chay-bo' },
                  { name: 'Xe đạp tập', href: '/products?category=xe-dap-tap' },
                  { name: 'Dụng cụ gym', href: '/products?category=dung-cu-tap-gym' },
                  { name: 'Bóng bàn', href: '/products?category=dung-cu-bong-ban' },
                  { name: 'Cầu lông', href: '/products?category=dung-cu-cau-long' },
                ].map((cat) => (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-700 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* Cart Items */}
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.variantId}
                  className="flex gap-4 rounded-2xl border border-ink/5 bg-white p-4 shadow-sm sm:gap-6 sm:p-5"
                >
                  {/* Image */}
                  <Link
                    href={`/products/${item.slug ?? item.productId}`}
                    className="group/img relative size-20 shrink-0 overflow-hidden rounded-xl bg-stone-100 sm:size-28"
                    title={`Xem chi tiết ${item.name}`}
                  >
                    <Image
                      src={item.imageUrl ?? PRODUCT_PLACEHOLDER_IMAGE}
                      alt={item.name}
                      fill
                      sizes="112px"
                      className="object-cover transition-transform duration-300 group-hover/img:scale-105"
                    />
                  </Link>
                  {/* Details */}
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">{item.sku}</p>
                        <h3 className="mt-1 truncate text-sm font-bold sm:text-base">
                          <Link
                            href={`/products/${item.slug ?? item.productId}`}
                            className="hover:text-emerald-700 transition"
                          >
                            {item.name}
                          </Link>
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.variantId, item.name)}
                        className="shrink-0 rounded-lg p-2 text-stone-400 transition hover:bg-red-50 hover:text-red-500"
                        aria-label="Xóa sản phẩm"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-end justify-between gap-4 pt-3">
                      {/* Quantity */}
                      <div className="flex items-center rounded-xl border border-ink/10">
                        <button
                          type="button"
                          onClick={() => dispatch(updateQuantity({ variantId: item.variantId, quantity: item.quantity - 1 }))}
                          disabled={item.quantity <= 1}
                          className="grid size-9 place-items-center text-stone-500 transition hover:text-ink disabled:opacity-30"
                          aria-label="Giảm số lượng"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="min-w-[2rem] text-center text-sm font-bold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => dispatch(updateQuantity({ variantId: item.variantId, quantity: item.quantity + 1 }))}
                          className="grid size-9 place-items-center text-stone-500 transition hover:text-ink"
                          aria-label="Tăng số lượng"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      {/* Price */}
                      <strong className="text-sm sm:text-base">{vndMoney.format(item.price * item.quantity)}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary & Conversion Guarantees */}
            <aside className="h-fit rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm lg:sticky lg:top-40">
              <h2 className="text-lg font-black text-slate-900">Tóm tắt đơn hàng</h2>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Tạm tính ({items.length} sản phẩm)</span>
                  <span className="font-semibold text-slate-900">{vndMoney.format(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phí vận chuyển</span>
                  <span className="font-semibold text-slate-900">{vndMoney.format(SHIPPING_FEE)}</span>
                </div>
                <hr className="border-slate-100" />
                <div className="flex justify-between text-base">
                  <span className="font-bold text-slate-900">Tổng thanh toán</span>
                  <strong className="text-xl font-black text-emerald-700">{vndMoney.format(total)}</strong>
                </div>
              </div>
              <Link
                href="/checkout"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500"
              >
                Tiến hành thanh toán
              </Link>
              <Link
                href="/products"
                className="mt-3 block text-center text-xs font-semibold text-slate-500 transition hover:text-emerald-700"
              >
                ← Tiếp tục mua sắm
              </Link>

              {/* Conversion Trust Commitments */}
              <div className="mt-6 space-y-3 border-t border-slate-100 pt-5 text-xs text-slate-600">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
                  <span>100% Chính hãng Bảo An Sport · Bảo hành 24T</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <RotateCcw className="size-4 text-emerald-600 shrink-0" />
                  <span>Đổi mới trong 7 ngày nếu lỗi từ NSX</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Truck className="size-4 text-emerald-600 shrink-0" />
                  <span>Kiểm tra hàng trước khi thanh toán COD</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Lock className="size-4 text-emerald-600 shrink-0" />
                  <span>Thanh toán an toàn bảo mật chuẩn SSL 256-bit</span>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>
    </StorefrontLayout>
  );
}
