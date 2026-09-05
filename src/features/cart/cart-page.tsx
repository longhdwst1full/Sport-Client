'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { clearCart, removeCartItem, updateQuantity } from '@/app/store/cart.slice';
import { StorefrontLayout } from '@/layouts/storefront-layout';
import { vndMoney } from '@/shared/format/money';

const SHIPPING_FEE = 30000;

export function CartPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.cart.items);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = items.length > 0 ? subtotal + SHIPPING_FEE : 0;

  return (
    <StorefrontLayout>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-stone-500">
          <Link href="/" className="hover:text-brand-600">Trang chủ</Link>
          <span className="mx-2">/</span>
          <span className="font-semibold text-ink">Giỏ hàng</span>
        </nav>

        <h1 className="text-3xl font-black sm:text-4xl">
          Giỏ hàng <span className="text-stone-400">({items.length})</span>
        </h1>

        {items.length === 0 ? (
          <div className="mt-16 flex flex-col items-center text-center">
            <div className="grid size-24 place-items-center rounded-full bg-stone-100">
              <ShoppingBag className="size-10 text-stone-400" />
            </div>
            <h2 className="mt-6 text-xl font-bold">Giỏ hàng trống</h2>
            <p className="mt-2 text-stone-500">Thêm sản phẩm yêu thích và quay lại đây.</p>
            <Link
              href="/#products"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 font-bold text-white transition hover:bg-brand-600"
            >
              <ArrowLeft className="size-4" /> Tiếp tục mua sắm
            </Link>
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
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-stone-100 sm:size-28">
                    <Image
                      src={item.imageUrl ?? '/icon.svg'}
                      alt={item.name}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </div>
                  {/* Details */}
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">{item.sku}</p>
                        <h3 className="mt-1 truncate text-sm font-bold sm:text-base">{item.name}</h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => dispatch(removeCartItem(item.variantId))}
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
              <button
                type="button"
                onClick={() => dispatch(clearCart())}
                className="text-sm font-semibold text-red-500 transition hover:text-red-700"
              >
                Xóa tất cả
              </button>
            </div>

            {/* Order Summary */}
            <aside className="h-fit rounded-2xl border border-ink/5 bg-white p-6 shadow-sm lg:sticky lg:top-40">
              <h2 className="text-lg font-bold">Tóm tắt đơn hàng</h2>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-500">Tạm tính ({items.length} sản phẩm)</span>
                  <span className="font-semibold">{vndMoney.format(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Phí vận chuyển</span>
                  <span className="font-semibold">{vndMoney.format(SHIPPING_FEE)}</span>
                </div>
                <hr className="border-ink/5" />
                <div className="flex justify-between text-base">
                  <span className="font-bold">Tổng thanh toán</span>
                  <strong className="text-lg text-brand-600">{vndMoney.format(total)}</strong>
                </div>
              </div>
              <Link
                href="/checkout"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3.5 font-bold text-white transition hover:bg-brand-600"
              >
                Tiến hành thanh toán
              </Link>
              <Link
                href="/#products"
                className="mt-3 block text-center text-sm font-semibold text-stone-500 transition hover:text-brand-600"
              >
                ← Tiếp tục mua sắm
              </Link>
            </aside>
          </div>
        )}
      </main>
    </StorefrontLayout>
  );
}
