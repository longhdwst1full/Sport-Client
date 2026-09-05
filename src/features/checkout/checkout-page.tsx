'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, CreditCard, Truck } from 'lucide-react';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { clearCart } from '@/app/store/cart.slice';
import { StorefrontLayout } from '@/layouts/storefront-layout';
import { vndMoney } from '@/shared/format/money';

const SHIPPING_FEE = 30000;

type PaymentMethod = 'cod' | 'bank';

export function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.cart.items);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = subtotal + SHIPPING_FEE;

  const [payment, setPayment] = useState<PaymentMethod>('cod');
  const [ordered, setOrdered] = useState(false);
  const [formData, setFormData] = useState({
    name: '', phone: '', address: '', city: '', note: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOrdered(true);
    dispatch(clearCart());
  };

  if (items.length === 0 && !ordered) {
    router.replace('/cart');
    return null;
  }

  if (ordered) {
    return (
      <StorefrontLayout>
        <main className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
          <div className="mx-auto grid size-20 place-items-center rounded-full bg-emerald-100">
            <CheckCircle2 className="size-10 text-emerald-600" />
          </div>
          <h1 className="mt-6 text-3xl font-black">Đặt hàng thành công!</h1>
          <p className="mt-3 leading-7 text-stone-500">
            Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ xác nhận qua số điện thoại trong vòng 30 phút.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-3.5 font-bold text-white transition hover:bg-brand-600"
            >
              Về trang chủ
            </Link>
            <Link
              href="/#products"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/10 bg-white px-7 py-3.5 font-bold transition hover:bg-stone-50"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </main>
      </StorefrontLayout>
    );
  }

  return (
    <StorefrontLayout>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-stone-500">
          <Link href="/" className="hover:text-brand-600">Trang chủ</Link>
          <span className="mx-2">/</span>
          <Link href="/cart" className="hover:text-brand-600">Giỏ hàng</Link>
          <span className="mx-2">/</span>
          <span className="font-semibold text-ink">Thanh toán</span>
        </nav>

        <h1 className="text-3xl font-black sm:text-4xl">Thanh toán</h1>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* Shipping Form */}
          <div className="space-y-6">
            <section className="rounded-2xl border border-ink/5 bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <Truck className="size-5 text-brand-600" /> Thông tin giao hàng
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-semibold sm:col-span-1">
                  Họ và tên *
                  <input name="name" required value={formData.name} onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    placeholder="Nguyễn Văn A" />
                </label>
                <label className="block text-sm font-semibold sm:col-span-1">
                  Số điện thoại *
                  <input name="phone" type="tel" required value={formData.phone} onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    placeholder="0912 345 678" />
                </label>
                <label className="block text-sm font-semibold sm:col-span-2">
                  Địa chỉ *
                  <input name="address" required value={formData.address} onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    placeholder="Số nhà, đường, phường/xã" />
                </label>
                <label className="block text-sm font-semibold sm:col-span-1">
                  Tỉnh/Thành phố *
                  <select name="city" required value={formData.city} onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100">
                    <option value="">Chọn tỉnh/TP</option>
                    <option>TP. Hồ Chí Minh</option>
                    <option>Hà Nội</option>
                    <option>Đà Nẵng</option>
                    <option>Cần Thơ</option>
                    <option>Hải Phòng</option>
                    <option>Khác</option>
                  </select>
                </label>
                <label className="block text-sm font-semibold sm:col-span-1">
                  Ghi chú
                  <textarea name="note" rows={1} value={formData.note} onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    placeholder="Giao giờ hành chính..." />
                </label>
              </div>
            </section>

            {/* Payment Method */}
            <section className="rounded-2xl border border-ink/5 bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <CreditCard className="size-5 text-brand-600" /> Phương thức thanh toán
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {([
                  { id: 'cod' as const, label: 'Thanh toán khi nhận hàng (COD)', desc: 'Trả tiền mặt cho shipper' },
                  { id: 'bank' as const, label: 'Chuyển khoản ngân hàng', desc: 'QR / Internet Banking' },
                ]).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPayment(m.id)}
                    className={`rounded-xl border p-4 text-left transition ${
                      payment === m.id ? 'border-brand-600 bg-brand-50 ring-1 ring-brand-600' : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <span className="block text-sm font-bold">{m.label}</span>
                    <span className="mt-1 block text-xs text-stone-500">{m.desc}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Order Summary Sidebar */}
          <aside className="h-fit rounded-2xl border border-ink/5 bg-white p-6 shadow-sm lg:sticky lg:top-40">
            <h2 className="text-lg font-bold">Đơn hàng ({items.length} sản phẩm)</h2>
            <div className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.variantId} className="flex items-center gap-3 text-sm">
                  <span className="grid size-6 shrink-0 place-items-center rounded bg-stone-100 text-xs font-bold text-stone-500">{item.quantity}</span>
                  <span className="min-w-0 flex-1 truncate">{item.name}</span>
                  <span className="shrink-0 font-semibold">{vndMoney.format(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <hr className="my-4 border-ink/5" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-500">Tạm tính</span>
                <span className="font-semibold">{vndMoney.format(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Phí vận chuyển</span>
                <span className="font-semibold">{vndMoney.format(SHIPPING_FEE)}</span>
              </div>
              <hr className="border-ink/5" />
              <div className="flex justify-between text-base">
                <span className="font-bold">Tổng cộng</span>
                <strong className="text-lg text-brand-600">{vndMoney.format(total)}</strong>
              </div>
            </div>
            <button
              type="submit"
              className="mt-6 w-full rounded-full bg-ink px-5 py-3.5 font-bold text-white transition hover:bg-brand-600"
            >
              Đặt hàng
            </button>
            <Link href="/cart" className="mt-3 block text-center text-sm font-semibold text-stone-500 hover:text-brand-600">
              <ArrowLeft className="mr-1 inline size-3.5" /> Quay lại giỏ hàng
            </Link>
          </aside>
        </form>
      </main>
    </StorefrontLayout>
  );
}
