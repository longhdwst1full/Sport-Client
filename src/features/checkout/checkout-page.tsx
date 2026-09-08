'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, CreditCard, LoaderCircle, LocateFixed, MapPin, ShieldCheck, Truck } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { clearCart } from '@/app/store/cart.slice';
import { VietnamAddressSelector, type SelectedAddressData } from '@/components/address/vietnam-address-selector';
import { useCustomerAuth } from '@/features/auth/use-customer-auth';
import type { CheckoutQuoteDto, CreateCheckoutQuoteDtoPaymentMethod, ReservationDto } from '@/generated/api/checkout/models';
import { StorefrontLayout } from '@/layouts/storefront-layout';
import { ApiError } from '@/lib/api/fetcher';
import { useToast } from '@/shared/components/global-toast';
import { vndMoney } from '@/shared/format/money';
import { confirmCheckout, prepareCheckout, type CheckoutContext } from './checkout-api.workflow';

const initialAddress: SelectedAddressData = {
  provinceCode: 79,
  provinceName: 'Thành phố Hồ Chí Minh',
  districtCode: 778,
  districtName: 'Quận 7',
  wardCode: 27502,
  wardName: 'Phường Tân Phong',
  streetAddress: '',
  fullAddress: '',
};

function messageOf(error: unknown): string {
  if (error instanceof ApiError && error.payload && typeof error.payload === 'object' && 'message' in error.payload) {
    const message = (error.payload as { message?: unknown }).message;
    if (typeof message === 'string') return message;
  }
  return error instanceof Error ? error.message : 'Không thể xử lý yêu cầu. Vui lòng thử lại.';
}

export function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { isAuthenticated, isLoaded } = useCustomerAuth();
  const items = useAppSelector((state) => state.cart.items);
  const localSubtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [address, setAddress] = useState<SelectedAddressData>(initialAddress);
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number }>();
  const [paymentMethod, setPaymentMethod] = useState<CreateCheckoutQuoteDtoPaymentMethod>('COD');
  const [quote, setQuote] = useState<CheckoutQuoteDto>();
  const [context, setContext] = useState<CheckoutContext>();
  const [reservation, setReservation] = useState<ReservationDto>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!items.length && !reservation) router.replace('/cart');
  }, [items.length, reservation, router]);

  const invalidateQuote = () => {
    setQuote(undefined);
    setContext(undefined);
    setError('');
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) return setError('Trình duyệt không hỗ trợ xác định vị trí.');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setCoordinates({ latitude: coords.latitude, longitude: coords.longitude });
        invalidateQuote();
        toast({ type: 'success', title: 'Đã lấy vị trí', message: 'Sẽ ưu tiên chi nhánh đủ hàng gần nhất.' });
      },
      () => setError('Không lấy được vị trí. Hệ thống vẫn có thể báo phí theo địa chỉ.'),
      { timeout: 8000 },
    );
  };

  const buildInput = () => ({
    recipient: {
      recipient: name.trim(),
      phone: phone.trim(),
      ...(email.trim() ? { email: email.trim() } : {}),
      addressLine: address.streetAddress.trim(),
      ward: address.wardName,
      district: address.districtName,
      province: address.provinceName,
      provinceCode: String(address.provinceCode),
      districtCode: address.districtCode ? String(address.districtCode) : undefined,
      wardCode: address.wardCode ? String(address.wardCode) : undefined,
      ...coordinates,
    },
    paymentMethod,
    ...(note.trim() ? { note: note.trim() } : {}),
  });

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isLoaded || busy) return;
    setError('');
    if (!name.trim() || !phone.trim() || !address.streetAddress.trim()) {
      setError('Vui lòng nhập đầy đủ các trường có dấu *.');
      return;
    }
    setBusy(true);
    try {
      if (!quote) {
        const prepared = await prepareCheckout(
          items.map(({ variantId, quantity }) => ({ variantId, quantity })),
          buildInput(),
          isAuthenticated,
          crypto.randomUUID(),
        );
        setQuote(prepared.quote);
        setContext(prepared.context);
        toast({
          type: prepared.quote.requiresShippingConsultation ? 'warning' : 'success',
          title: prepared.quote.requiresShippingConsultation ? 'Cần tư vấn giao hàng' : 'Đã kiểm tra giá và tồn',
          message: prepared.quote.requiresShippingConsultation
            ? 'Nhân viên sẽ liên hệ để thống nhất phí và thời gian.'
            : `Hàng được xử lý tại ${prepared.quote.branchName}.`,
        });
        return;
      }
      if (!context || quote.requiresShippingConsultation) return;
      const result = await confirmCheckout(context, quote.checkoutToken, crypto.randomUUID());
      setReservation(result);
      dispatch(clearCart());
      toast({ type: 'success', title: 'Đã xác nhận', message: 'Hệ thống đã giữ hàng trong 30 phút.' });
    } catch (caught) {
      setError(messageOf(caught));
    } finally {
      setBusy(false);
    }
  };

  if (!items.length && !reservation) return null;

  if (reservation) {
    return (
      <StorefrontLayout>
        <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
          <section className="rounded-[32px] border border-emerald-200 bg-white p-7 text-center shadow-xl sm:p-12">
            <div className="mx-auto grid size-20 place-items-center rounded-3xl bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="size-11" />
            </div>
            <h1 className="mt-5 text-2xl font-black text-slate-950">Đã xác nhận và giữ hàng</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
              Mã giữ hàng <strong className="font-mono text-emerald-700">{reservation.id}</strong>. Hàng được giữ đến{' '}
              <strong>{new Date(reservation.expiresAt).toLocaleString('vi-VN')}</strong>.
            </p>
            <p className="mt-2 text-sm text-slate-600">
              {paymentMethod === 'COD'
                ? 'Bạn thanh toán đủ một lần khi nhận hàng. Doanh thu chỉ ghi nhận sau khi giao hoàn tất.'
                : 'Đơn đang chờ bước tạo chỉ dẫn chuyển khoản và xác nhận tiền ở module thanh toán.'}
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href="/" className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white">Tiếp tục mua sắm</Link>
              <Link href="/profile" className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700">Tài khoản của tôi</Link>
            </div>
          </section>
        </main>
      </StorefrontLayout>
    );
  }

  const payable = quote?.grandTotal ? Number(quote.grandTotal) : localSubtotal;
  return (
    <StorefrontLayout>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-7">
          <Link href="/cart" className="text-sm font-bold text-emerald-700">← Quay lại giỏ hàng</Link>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Thanh toán an toàn</h1>
          <p className="mt-2 text-sm text-slate-600">Giá, tồn kho, chi nhánh và phí giao đều được Backend kiểm tra lại trước khi giữ hàng.</p>
        </div>

        <form onSubmit={submit} className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_390px]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 font-black text-slate-900"><MapPin className="size-5 text-emerald-600" /> Thông tin nhận hàng</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-bold text-slate-700">Người nhận <span className="text-rose-600">*</span><input value={name} onChange={(e) => { setName(e.target.value); invalidateQuote(); }} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" /></label>
                <label className="text-xs font-bold text-slate-700">Số điện thoại <span className="text-rose-600">*</span><input value={phone} onChange={(e) => { setPhone(e.target.value); invalidateQuote(); }} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" /></label>
                <label className="text-xs font-bold text-slate-700 sm:col-span-2">Email<input type="email" value={email} onChange={(e) => { setEmail(e.target.value); invalidateQuote(); }} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" /></label>
              </div>
              <div className="mt-5"><VietnamAddressSelector initialData={address} onChange={(value) => { setAddress(value); invalidateQuote(); }} required /></div>
              <button type="button" onClick={useCurrentLocation} className="mt-4 inline-flex items-center gap-2 rounded-xl border border-emerald-200 px-3 py-2 text-xs font-bold text-emerald-700"><LocateFixed className="size-4" /> Dùng vị trí hiện tại để tìm chi nhánh gần nhất</button>
              <label className="mt-4 block text-xs font-bold text-slate-700">Ghi chú giao hàng<textarea rows={3} value={note} onChange={(e) => { setNote(e.target.value); invalidateQuote(); }} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" placeholder="Gọi trước khi giao, thời gian nhận, yêu cầu xe khách..." /></label>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 font-black text-slate-900"><CreditCard className="size-5 text-emerald-600" /> Phương thức thanh toán</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {([
                  ['COD', 'Thanh toán khi nhận hàng', 'Thanh toán đủ một lần cho nhân viên giao hàng.'],
                  ['BANK_TRANSFER', 'Chuyển khoản một lần', 'Chỉ xác nhận đã thanh toán khi tiền thực nhận.'],
                ] as const).map(([value, label, description]) => (
                  <button key={value} type="button" onClick={() => { setPaymentMethod(value); invalidateQuote(); }} className={`rounded-2xl border p-4 text-left ${paymentMethod === value ? 'border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600' : 'border-slate-200'}`}>
                    <strong className="text-sm text-slate-900">{label}</strong><span className="mt-1 block text-xs leading-5 text-slate-500">{description}</span>
                  </button>
                ))}
              </div>
            </section>

            {quote && (
              <section className={`rounded-3xl border p-6 ${quote.requiresShippingConsultation ? 'border-amber-300 bg-amber-50' : 'border-emerald-300 bg-emerald-50'}`}>
                <h2 className="flex items-center gap-2 font-black text-slate-900"><Truck className="size-5" /> Kết quả kiểm tra từ hệ thống</h2>
                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <p>Chi nhánh: <strong>{quote.branchName}</strong></p>
                  <p>Phương thức: <strong>{quote.shippingMethod === 'BRANCH_FREE' ? 'Miễn phí trong bán kính' : quote.shippingMethod === 'STANDARD_DELIVERY' ? 'Phí giao mặc định' : 'Giao theo thỏa thuận'}</strong></p>
                  <p>Phí giao: <strong>{quote.shippingTotal === null || quote.shippingTotal === undefined ? 'Chờ tư vấn' : vndMoney.format(Number(quote.shippingTotal))}</strong></p>
                  <p>ETA: <strong>{quote.etaMinDays === null || quote.etaMinDays === undefined ? 'Chờ tư vấn' : `${quote.etaMinDays}-${quote.etaMaxDays} ngày`}</strong></p>
                </div>
                {quote.requiresShippingConsultation && <p className="mt-4 text-sm font-semibold text-amber-900">Nhân viên sẽ gọi để thống nhất phí, thời gian và hình thức giao như xe khách. Chưa giữ tồn cho đến khi bạn xác nhận lại quote.</p>}
              </section>
            )}

            {error && <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">{error}</div>}
          </div>

          <aside>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-28">
              <div className="flex items-center justify-between"><h2 className="font-black text-slate-900">Đơn hàng ({items.length})</h2><Link href="/cart" className="text-xs font-bold text-emerald-700">Chỉnh sửa</Link></div>
              <div className="mt-4 max-h-72 space-y-3 overflow-auto">
                {items.map((item) => <div key={item.variantId} className="flex items-center gap-3"><div className="relative size-12 overflow-hidden rounded-xl border bg-slate-50"><Image src={item.imageUrl || '/icon.svg'} alt={item.name} fill sizes="48px" className="object-contain p-1" /></div><div className="min-w-0 flex-1"><p className="truncate text-xs font-bold text-slate-900">{item.name}</p><p className="text-xs text-slate-500">{item.sku} · ×{item.quantity}</p></div><strong className="text-xs">{vndMoney.format(item.price * item.quantity)}</strong></div>)}
              </div>
              <div className="mt-5 space-y-2 border-t pt-4 text-sm"><div className="flex justify-between"><span>Tạm tính tham khảo</span><span>{vndMoney.format(localSubtotal)}</span></div>{quote && <><div className="flex justify-between"><span>Phí giao</span><span>{quote.shippingTotal == null ? 'Chờ tư vấn' : vndMoney.format(Number(quote.shippingTotal))}</span></div><div className="flex justify-between border-t pt-3 text-base font-black"><span>Khách thanh toán</span><span className="text-emerald-700">{quote.grandTotal == null ? 'Chờ tư vấn' : vndMoney.format(payable)}</span></div></>}</div>
              <button type="submit" disabled={busy || !isLoaded || quote?.requiresShippingConsultation} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-sm font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300">
                {busy ? <LoaderCircle className="size-5 animate-spin" /> : quote ? <CheckCircle2 className="size-5" /> : <Truck className="size-5" />}
                {busy ? 'Đang xử lý...' : quote ? 'Xác nhận và giữ hàng 30 phút' : 'Kiểm tra tồn và tính phí'}
              </button>
              <div className="mt-4 flex gap-2 text-xs leading-5 text-slate-500"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" /><span>Không lấy giá hoặc tồn từ dữ liệu lưu trên trình duyệt. Backend là nguồn quyết định cuối cùng.</span></div>
            </div>
          </aside>
        </form>
      </main>
    </StorefrontLayout>
  );
}
