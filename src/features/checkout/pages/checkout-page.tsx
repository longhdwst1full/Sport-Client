'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState  } from 'react';
import { CreditCard, LocateFixed, MapPin, Truck } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { clearCart } from '@/app/store/cart.slice';
import { useCartHydrated } from '@/app/providers';
import { VietnamAddressSelector, type SelectedAddressData } from '@/shared/components/address/vietnam-address-selector';
import { useCustomerAuth } from '@/features/auth';
import type { CheckoutQuoteDto, CreateCheckoutQuoteDtoPaymentMethod } from '@/generated/api/checkout/models';
import type { OrderDetailDto } from '@/generated/api/orders/models';
import { StorefrontLayout } from '@/layouts/storefront-layout';
import { ApiError } from '@/lib/api/fetcher';
import { useToast } from '@/shared/components/global-toast';
import { confirmCheckout, placeOrder, prepareCheckout, reloadCheckout, type CheckoutContext } from '../api/checkout.workflow';
import { toCheckoutQuoteView } from '../model/checkout.mapper';
import { toOrderDetailView } from '@/features/orders/model/order.mapper';
import { CheckoutOrderSummary } from '../components/checkout-order-summary';
import { CheckoutSuccess } from '../components/checkout-success';

const initialAddress: SelectedAddressData = {
  provinceCode: 79,
  provinceName: 'Thành phố Hồ Chí Minh',
  districtCode: 778,
  districtName: 'Quận 7',
  wardCode: 27490,
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
  const cartHydrated = useCartHydrated();
  const localSubtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [address, setAddress] = useState<SelectedAddressData>(initialAddress);
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number }>();
  const [paymentMethod, setPaymentMethod] = useState<CreateCheckoutQuoteDtoPaymentMethod>('COD');
  const [requestConsultation, setRequestConsultation] = useState(false);
  const [quote, setQuote] = useState<CheckoutQuoteDto>();
  // DTO giữ nguyên cho luồng xác nhận; phần hiển thị dùng view model để không
  // rải định dạng và nhãn khắp JSX (`09-data-transformation.md`).
  const quoteView = useMemo(() => (quote ? toCheckoutQuoteView(quote) : undefined), [quote]);
  const [context, setContext] = useState<CheckoutContext>();
  const [placedOrder, setPlacedOrder] = useState<OrderDetailDto>();
  // Retry cùng ý định phải dùng lại key; tạo key mới sau timeout mạng có thể biến retry thành lệnh thứ hai.
  const confirmIdempotencyKey = useRef<string | undefined>(undefined);
  const orderIdempotencyKey = useRef<string | undefined>(undefined);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Providers chỉ bật gate sau khi Redux nhận persisted cart. Nếu bỏ điều kiện
    // này, checkout có thể redirect nhầm trước khi các dòng hàng được khôi phục.
    if (cartHydrated && !items.length && !placedOrder) router.replace('/cart');
  }, [cartHydrated, items.length, placedOrder, router]);

  const invalidateQuote = () => {
    setQuote(undefined);
    setContext(undefined);
    confirmIdempotencyKey.current = undefined;
    orderIdempotencyKey.current = undefined;
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
    requestShippingConsultation: requestConsultation,
    ...(note.trim() ? { note: note.trim() } : {}),
  });

  const refreshConsultedQuote = async () => {
    if (!quote || !context || busy) return;
    setBusy(true);
    setError('');
    try {
      const refreshed = await reloadCheckout(context, quote.checkoutToken);
      setQuote(refreshed);
      toast({
        type: refreshed.requiresShippingConsultation ? 'warning' : 'success',
        title: refreshed.requiresShippingConsultation ? 'Đang chờ nhân viên xác nhận' : 'Phí giao đã được xác nhận',
        message: refreshed.requiresShippingConsultation
          ? 'Vui lòng kiểm tra lại sau khi nhân viên liên hệ.'
          : 'Bạn có thể xác nhận giữ hàng với mức phí đã thống nhất.',
      });
    } catch (caught) {
      setError(messageOf(caught));
    } finally {
      setBusy(false);
    }
  };

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
      confirmIdempotencyKey.current ??= crypto.randomUUID();
      orderIdempotencyKey.current ??= crypto.randomUUID();
      await confirmCheckout(context, quote.checkoutToken, confirmIdempotencyKey.current);
      const order = await placeOrder(context, quote.checkoutToken, orderIdempotencyKey.current);
      setPlacedOrder(order);
      dispatch(clearCart());
      toast({
        type: order.guestAccessPersisted === false ? 'warning' : 'success',
        title: 'Đặt hàng thành công',
        message: order.guestAccessPersisted === false
          ? `Mã đơn ${order.orderNo} đã được tạo nhưng trình duyệt không lưu được quyền truy cập. Hãy lưu mã đơn và liên hệ cửa hàng khi cần tra cứu.`
          : `Mã đơn ${order.orderNo} đã được tiếp nhận.`,
      });
    } catch (caught) {
      setError(messageOf(caught));
    } finally {
      setBusy(false);
    }
  };

  if (!cartHydrated || (!items.length && !placedOrder)) return null;

  if (placedOrder) {
    return (
      <StorefrontLayout>
        <CheckoutSuccess order={toOrderDetailView(placedOrder)} />
      </StorefrontLayout>
    );
  }

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
              <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
                <input
                  type="checkbox"
                  checked={requestConsultation}
                  onChange={(event) => {
                    setRequestConsultation(event.target.checked);
                    invalidateQuote();
                  }}
                  className="mt-0.5 size-4 accent-emerald-600"
                />
                <span>
                  <strong className="block">Nhờ nhân viên tư vấn phương án giao riêng</strong>
                  Dùng cho hàng cồng kềnh, gửi xe khách hoặc trường hợp cần thống nhất phí và thời gian qua điện thoại.
                </span>
              </label>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 font-black text-slate-900"><CreditCard className="size-5 text-emerald-600" /> Phương thức thanh toán</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {([
                  ['COD', 'Thanh toán khi nhận hàng', 'Thanh toán đủ một lần cho nhân viên giao hàng.'],
                  ['BANK_TRANSFER', 'Chuyển khoản một lần', 'Chỉ xác nhận đã thanh toán khi tiền thực nhận.'],
                  ['VNPAY', 'Thẻ / QR qua VNPay', 'Chuyển sang cổng VNPay sau khi đặt hàng. Đơn xác nhận khi VNPay báo thành công.'],
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
                  <p>Chi nhánh: <strong>{quoteView?.branchName}</strong></p>
                  <p>Phương thức: <strong>{quoteView?.shippingMethodLabel}</strong></p>
                  <p>Phí giao: <strong>{quoteView?.shippingTotalLabel}</strong></p>
                  <p>Thời gian giao dự kiến: <strong>{quoteView?.etaLabel}</strong></p>
                </div>
                {quote.requiresShippingConsultation && (
                  <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-white/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-semibold text-amber-900">Nhân viên sẽ gọi để thống nhất phí, thời gian và hình thức giao. Hàng chỉ được giữ sau khi phí đã cập nhật và bạn xác nhận.</p>
                    <button
                      type="button"
                      onClick={refreshConsultedQuote}
                      disabled={busy}
                      className="shrink-0 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-black text-white disabled:bg-slate-300"
                    >
                      {busy ? 'Đang kiểm tra...' : 'Kiểm tra lại phí'}
                    </button>
                  </div>
                )}
              </section>
            )}

            {error && <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">{error}</div>}
          </div>

          <CheckoutOrderSummary
            items={items}
            localSubtotal={localSubtotal}
            quote={quoteView}
            busy={busy}
            authLoaded={isLoaded}
          />
        </form>
      </main>
    </StorefrontLayout>
  );
}
