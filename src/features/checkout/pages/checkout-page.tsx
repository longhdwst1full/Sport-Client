'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState  } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, CheckCircle2, CreditCard, LoaderCircle, LocateFixed, MapPin, Pencil, RotateCcw, Truck } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { clearCart, removeCartItem } from '@/app/store/cart.slice';
import { useCartHydrated } from '@/app/providers';
import { VietnamAddressSelector, type SelectedAddressData } from '@/shared/components/address/vietnam-address-selector';
import { useCustomerAuth } from '@/features/auth';
import type { CheckoutQuoteDto, CheckoutPaymentMethod } from '@/generated/api/checkout/checkout.schemas';
import type { OrderDetailDto } from '@/generated/api/orders/orders.schemas';
import type { CustomerAddressDto } from '@/generated/api/customer/customer.schemas';
import { listCustomerAddresses } from '@/generated/api/customer/customer';
import { getAccountPayment, getGuestPayment } from '@/generated/api/payments/payments';
import { paymentRequest } from '@/features/orders/api/payment-request';
import { readGuestOrderAccessToken } from '@/features/orders/model/guest-order-access.store';
import { STORE_POLICY_PAGES } from '@/shared/constants';
import { StorefrontLayout } from '@/layouts/storefront-layout';
import { ApiError } from '@/lib/api/fetcher';
import { useToast } from '@/shared/components/global-toast';
import { confirmCheckout, placeOrder, prepareCheckout, reloadCheckout, type CheckoutContext } from '../api/checkout.workflow';
import { toCheckoutQuoteView } from '../model/checkout.mapper';
import { UnavailableCartLinesError } from '@/features/cart';
import { toOrderDetailView } from '@/features/orders/model/order.mapper';
import { CheckoutOrderSummary } from '../components/checkout-order-summary';
import { CheckoutSuccess } from '../components/checkout-success';

/**
 * Không điền sẵn địa chỉ nào.
 *
 * Trước đây mặc định là Quận 7, TP.HCM với mã hành chính nhà nước — vừa sai mã so với danh mục của
 * hãng vận chuyển, vừa khiến khách ở tỉnh khác dễ đặt nhầm nơi giao vì ô đã có sẵn giá trị trông
 * như đã chọn.
 */
const initialAddress: SelectedAddressData = {
  provinceCode: null,
  provinceName: '',
  districtCode: null,
  districtName: '',
  wardCode: null,
  wardName: '',
  streetAddress: '',
  fullAddress: '',
};

/** Ba bước của checkout; bước sau chỉ mở khi bước trước hợp lệ. */
const STEPS = [
  { id: 1, label: 'Địa chỉ nhận hàng', short: 'Địa chỉ' },
  { id: 2, label: 'Vận chuyển & thanh toán', short: 'Vận chuyển' },
  { id: 3, label: 'Xác nhận đơn', short: 'Xác nhận' },
] as const;
type Step = (typeof STEPS)[number]['id'];

/** Mã hành chính của sổ địa chỉ là chuỗi; bộ chọn địa chỉ dùng số. Mã không phải số thì bắt chọn lại. */
const toCode = (value?: string | null) => {
  const code = Number(value);
  return value && Number.isInteger(code) ? code : null;
};

function toSelectedAddress(saved: CustomerAddressDto): SelectedAddressData {
  const parts = [saved.addressLine, saved.ward, saved.district, saved.province].filter(Boolean);
  return {
    provinceCode: toCode(saved.provinceCode),
    provinceName: saved.province ?? '',
    districtCode: toCode(saved.districtCode),
    districtName: saved.district ?? '',
    wardCode: toCode(saved.wardCode),
    wardName: saved.ward ?? '',
    streetAddress: saved.addressLine,
    fullAddress: parts.join(', '),
  };
}

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
  const [paymentMethod, setPaymentMethod] = useState<CheckoutPaymentMethod>('COD');
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
  // Mỗi lượt báo giá tự động mang một số thứ tự; phản hồi của lượt cũ (khách đã sửa địa chỉ) bị bỏ.
  const quoteSeq = useRef(0);
  const [autoQuoting, setAutoQuoting] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<Step>(1);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  // Đổi `key` để bộ chọn địa chỉ nạp lại dữ liệu khi khách chọn một địa chỉ đã lưu.
  const [addressFormKey, setAddressFormKey] = useState(0);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [redirectingToVnpay, setRedirectingToVnpay] = useState(false);

  // Sổ địa chỉ chỉ có với khách đã đăng nhập; khách vãng lai nhập tay.
  const savedAddresses = useQuery({
    queryKey: ['account-addresses'],
    queryFn: ({ signal }) => listCustomerAddresses(undefined, signal),
    enabled: isLoaded && isAuthenticated,
    staleTime: 60_000,
  });

  useEffect(() => {
    // Providers chỉ bật gate sau khi Redux nhận persisted cart. Nếu bỏ điều kiện
    // này, checkout có thể redirect nhầm trước khi các dòng hàng được khôi phục.
    if (cartHydrated && !items.length && !placedOrder) router.replace('/cart');
  }, [cartHydrated, items.length, placedOrder, router]);

  const applySavedAddress = (saved: CustomerAddressDto) => {
    setSelectedAddressId(saved.id);
    setName(saved.recipient);
    setPhone(saved.phone);
    setAddress(toSelectedAddress(saved));
    setAddressFormKey((key) => key + 1);
    invalidateQuote();
  };

  useEffect(() => {
    const list = savedAddresses.data;
    if (!list?.length || selectedAddressId !== null || name || address.provinceCode) return;
    applySavedAddress(list.find(({ isDefault }) => isDefault) ?? list[0]);
    // Chỉ điền sẵn một lần khi sổ địa chỉ vừa tải và form còn trống.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedAddresses.data]);

  const invalidateQuote = () => {
    quoteSeq.current += 1;
    setAutoQuoting(false);
    setQuote(undefined);
    setContext(undefined);
    confirmIdempotencyKey.current = undefined;
    orderIdempotencyKey.current = undefined;
    setError('');
  };

  /** SKU trong giỏ trên máy không còn bán: bỏ khỏi giỏ để báo giá lại với các dòng còn lại. */
  const handleCheckoutError = (caught: unknown) => {
    if (caught instanceof UnavailableCartLinesError) {
      caught.variantIds.forEach((variantId) => dispatch(removeCartItem(variantId)));
    }
    setError(messageOf(caught));
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

  // Đủ người nhận + địa chỉ tới phường/xã thì tự báo giá: khách thấy phí giao (miễn phí shop tự giao
  // trong 10 km khi đã chia sẻ vị trí, hoặc phí GHN) mà không phải bấm "Kiểm tra". Dùng đúng API
  // báo giá hiện có nên số hiển thị là số Backend sẽ chốt.
  const readyToQuote = Boolean(
    name.trim() && phone.trim() && address.streetAddress.trim()
    && address.provinceCode && address.districtCode && address.wardCode,
  );
  useEffect(() => {
    if (!isLoaded || !readyToQuote || quote || placedOrder || !items.length) return;
    const seq = ++quoteSeq.current;
    const timer = setTimeout(async () => {
      setAutoQuoting(true);
      setError('');
      try {
        const prepared = await prepareCheckout(
          items.map(({ variantId, quantity }) => ({ variantId, quantity })),
          buildInput(),
          isAuthenticated,
          crypto.randomUUID(),
        );
        if (seq !== quoteSeq.current) return;
        setQuote(prepared.quote);
        setContext(prepared.context);
      } catch (caught) {
        if (seq === quoteSeq.current) handleCheckoutError(caught);
      } finally {
        if (seq === quoteSeq.current) setAutoQuoting(false);
      }
    }, 700);
    return () => clearTimeout(timer);
    // buildInput đọc đúng các state liệt kê dưới đây; thêm hàm vào deps sẽ báo giá lại mỗi lần render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, readyToQuote, quote, placedOrder, items, isAuthenticated, name, phone, email, note, address, coordinates, paymentMethod, requestConsultation]);

  /** Lượt báo giá tự động lỗi (GHN timeout, mạng): khách bấm thử lại mà không phải sửa form. */
  const retryQuote = () => {
    setError('');
    setQuote(undefined);
    quoteSeq.current += 1;
    // Đổi một dependency của effect báo giá để nó chạy lại ngay.
    setAddress((current) => ({ ...current }));
  };

  const addressValid = readyToQuote;
  const canConfirm = Boolean(quote && context && !quote.requiresShippingConsultation);

  /** VNPay: đặt đơn xong chuyển thẳng sang cổng; lỗi thì để khách thanh toán lại ở trang đơn. */
  const redirectToVnpay = async (order: OrderDetailDto & { guestAccessPersisted?: boolean }) => {
    setRedirectingToVnpay(true);
    try {
      const payment = isAuthenticated
        ? await getAccountPayment(order.orderNo, paymentRequest())
        : await getGuestPayment(order.orderNo, paymentRequest({ headers: { 'x-cart-token': readGuestOrderAccessToken(order.orderNo) ?? '' } }));
      const url = payment.instruction?.redirectUrl;
      if (url) {
        window.location.assign(url);
        return true;
      }
    } catch {
      // Không chặn đơn đã tạo: trang đơn hàng có nút thanh toán VNPay để thử lại.
    }
    setRedirectingToVnpay(false);
    return false;
  };

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
    if (!isLoaded || busy || step !== 3 || !quote || !context) return;
    setError('');
    if (quote.requiresShippingConsultation) return;
    if (!acceptedTerms) {
      setError('Vui lòng đồng ý điều khoản trước khi đặt hàng.');
      return;
    }
    setBusy(true);
    try {
      confirmIdempotencyKey.current ??= crypto.randomUUID();
      orderIdempotencyKey.current ??= crypto.randomUUID();
      await confirmCheckout(context, quote.checkoutToken, confirmIdempotencyKey.current);
      const order = await placeOrder(context, quote.checkoutToken, orderIdempotencyKey.current);
      dispatch(clearCart());
      if (paymentMethod === 'VNPAY' && (await redirectToVnpay(order))) return;
      setPlacedOrder(order);
      toast({
        type: order.guestAccessPersisted === false ? 'warning' : 'success',
        title: 'Đặt hàng thành công',
        message: order.guestAccessPersisted === false
          ? `Mã đơn ${order.orderNo} đã được tạo nhưng trình duyệt không lưu được quyền truy cập. Hãy lưu mã đơn và liên hệ cửa hàng khi cần tra cứu.`
          : paymentMethod === 'VNPAY'
            ? `Mã đơn ${order.orderNo} đã được tạo. Chưa mở được cổng VNPay, bạn thanh toán lại ở trang đơn hàng.`
            : `Mã đơn ${order.orderNo} đã được tiếp nhận.`,
      });
    } catch (caught) {
      handleCheckoutError(caught);
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

  const inputClass = 'mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/15';
  const optionClass = (selected: boolean) =>
    `rounded-2xl border p-4 text-left transition ${selected ? 'border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600' : 'border-slate-200 hover:border-emerald-300'}`;
  const addressLine = [address.streetAddress, address.wardName, address.districtName, address.provinceName].filter(Boolean).join(', ');
  const paymentLabel = paymentMethod === 'VNPAY' ? 'Chuyển khoản (QR qua VNPay)' : 'Nhận hàng trả tiền (COD)';

  return (
    <StorefrontLayout>
      {/* StorefrontLayout đã có <main>; lồng thêm <main> là sai landmark cho trình đọc màn hình. */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/cart" className="text-sm font-bold text-emerald-700">← Quay lại giỏ hàng</Link>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">Thanh toán</h1>
        </div>

        {/* Thanh bước: bước đã qua bấm được để quay lại sửa; bước chưa tới bị khoá. */}
        <ol className="mb-7 grid grid-cols-3 gap-2" aria-label="Các bước thanh toán">
          {STEPS.map(({ id, label, short }) => {
            const done = step > id;
            const current = step === id;
            return (
              <li key={id}>
                <button
                  type="button"
                  disabled={!done}
                  onClick={() => setStep(id)}
                  aria-current={current ? 'step' : undefined}
                  className={`flex w-full items-center gap-2 rounded-2xl border px-3 py-2.5 text-left text-xs font-bold sm:text-sm ${
                    current ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : done ? 'border-emerald-200 bg-white text-emerald-700' : 'border-slate-200 bg-white text-slate-400'
                  }`}
                >
                  <span className={`grid size-6 shrink-0 place-items-center rounded-full text-[11px] ${current || done ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {done ? <CheckCircle2 className="size-4" /> : id}
                  </span>
                  <span className="min-w-0 truncate"><span className="sm:hidden">{short}</span><span className="hidden sm:inline">{label}</span></span>
                </button>
              </li>
            );
          })}
        </ol>

        <form onSubmit={submit} className="grid grid-cols-1 gap-7 lg:grid-cols-[minmax(0,1fr)_380px] [&>*]:min-w-0">
          <div className="min-w-0 space-y-6">
            {step === 1 && (
              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="flex items-center gap-2 font-black text-slate-900"><MapPin className="size-5 text-emerald-600" /> Địa chỉ nhận hàng</h2>

                {savedAddresses.data && savedAddresses.data.length > 0 && (
                  <div className="mt-4 space-y-2" role="radiogroup" aria-label="Địa chỉ đã lưu">
                    {savedAddresses.data.map((saved) => (
                      <button key={saved.id} type="button" role="radio" aria-checked={selectedAddressId === saved.id} onClick={() => applySavedAddress(saved)} className={`w-full ${optionClass(selectedAddressId === saved.id)}`}>
                        <span className="flex flex-wrap items-center justify-between gap-2">
                          <strong className="text-sm text-slate-900">{saved.recipient}</strong>
                          <span className="text-xs font-semibold text-slate-500">{saved.phone}</span>
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-slate-600">
                          {[saved.addressLine, saved.ward, saved.district, saved.province].filter(Boolean).join(', ')}
                        </span>
                        {saved.isDefault && <span className="mt-1 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">Mặc định</span>}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => { setSelectedAddressId(''); setName(''); setPhone(''); setAddress(initialAddress); setAddressFormKey((key) => key + 1); invalidateQuote(); }}
                      className="w-full rounded-2xl border border-dashed border-slate-300 p-3 text-sm font-bold text-emerald-700 hover:border-emerald-400"
                    >
                      + Giao tới địa chỉ khác
                    </button>
                  </div>
                )}

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="text-xs font-bold text-slate-700">Người nhận <span className="text-rose-600">*</span><input value={name} onChange={(e) => { setName(e.target.value); invalidateQuote(); }} autoComplete="name" className={inputClass} /></label>
                  <label className="text-xs font-bold text-slate-700">Số điện thoại <span className="text-rose-600">*</span><input value={phone} inputMode="tel" autoComplete="tel" onChange={(e) => { setPhone(e.target.value); invalidateQuote(); }} className={inputClass} /></label>
                  <label className="text-xs font-bold text-slate-700 sm:col-span-2">Email (nhận thông báo đơn hàng)<input type="email" value={email} autoComplete="email" onChange={(e) => { setEmail(e.target.value); invalidateQuote(); }} className={inputClass} /></label>
                </div>
                <div className="mt-5"><VietnamAddressSelector key={addressFormKey} initialData={address} onChange={(value) => { setAddress(value); invalidateQuote(); }} required /></div>
                <label className="mt-4 block text-xs font-bold text-slate-700">Ghi chú giao hàng<textarea rows={2} value={note} onChange={(e) => { setNote(e.target.value); invalidateQuote(); }} className={inputClass} placeholder="Gọi trước khi giao, giờ nhận hàng..." /></label>

                <div className="mt-6 flex justify-end">
                  <button type="button" disabled={!addressValid} onClick={() => setStep(2)} className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300">
                    Tiếp tục
                  </button>
                </div>
                {!addressValid && <p className="mt-2 text-right text-xs text-slate-500">Điền người nhận, số điện thoại và chọn đủ tỉnh, quận, phường.</p>}
              </section>
            )}

            {step === 2 && (
              <>
                <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="flex items-center gap-2 font-black text-slate-900"><Truck className="size-5 text-emerald-600" /> Phương thức vận chuyển</h2>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Cách giao hàng">
                    <button type="button" role="radio" aria-checked={!requestConsultation} onClick={() => { setRequestConsultation(false); invalidateQuote(); }} className={optionClass(!requestConsultation)}>
                      <strong className="text-sm text-slate-900">Giao hàng tiêu chuẩn</strong>
                      <span className="mt-1 block text-xs leading-5 text-slate-500">Shop tự giao miễn phí trong 10 km, xa hơn giao qua GHN.</span>
                      {!requestConsultation && (
                        <span className="mt-3 block text-sm font-bold" aria-live="polite">
                          {autoQuoting || (!quote && !error) ? (
                            <span className="inline-flex items-center gap-1.5 text-slate-500"><LoaderCircle className="size-4 animate-spin" /> Đang tính phí vận chuyển...</span>
                          ) : quoteView ? (
                            <span className="text-emerald-700">
                              {quoteView.shippingTotalAmount === 0 ? 'Miễn phí' : quoteView.shippingTotalLabel} · {quoteView.shippingMethodLabel}
                              <span className="block text-xs font-semibold text-slate-500">Dự kiến {quoteView.etaLabel}</span>
                            </span>
                          ) : (
                            <span className="text-rose-600">Chưa tính được phí</span>
                          )}
                        </span>
                      )}
                    </button>
                    <button type="button" role="radio" aria-checked={requestConsultation} onClick={() => { setRequestConsultation(true); invalidateQuote(); }} className={optionClass(requestConsultation)}>
                      <strong className="text-sm text-slate-900">Nhờ shop gửi</strong>
                      <span className="mt-1 block text-xs leading-5 text-slate-500">Shop gọi báo phí vận chuyển và tính riêng; đơn hiện chỉ tính tiền hàng. Hợp với hàng cồng kềnh, gửi xe khách.</span>
                    </button>
                  </div>
                  {!requestConsultation && (
                    <button type="button" onClick={useCurrentLocation} className="mt-4 inline-flex items-center gap-2 rounded-xl border border-emerald-200 px-3 py-2 text-xs font-bold text-emerald-700">
                      <LocateFixed className="size-4" /> {coordinates ? 'Đã dùng vị trí hiện tại' : 'Dùng vị trí hiện tại — miễn phí giao nếu cách chi nhánh dưới 10 km'}
                    </button>
                  )}
                  {error && !autoQuoting && !quote && (
                    <div role="alert" className="mt-4 flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 sm:flex-row sm:items-center sm:justify-between">
                      <span className="flex items-start gap-2 font-semibold"><AlertTriangle className="mt-0.5 size-4 shrink-0" /> {error}</span>
                      <button type="button" onClick={retryQuote} className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-black text-white">
                        <RotateCcw className="size-3.5" /> Thử lại
                      </button>
                    </div>
                  )}
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="flex items-center gap-2 font-black text-slate-900"><CreditCard className="size-5 text-emerald-600" /> Phương thức thanh toán</h2>
                  {/* Storefront chỉ còn 2 cách: COD và chuyển khoản qua QR VNPay. Chuyển khoản tay
                      (BANK_TRANSFER) cần nhân viên đối soát nên chỉ còn dùng ở quầy. */}
                  <div className="mt-4 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Phương thức thanh toán">
                    {([
                      ['COD', 'Nhận hàng trả tiền', 'Thanh toán đủ một lần cho nhân viên giao hàng.'],
                      ['VNPAY', 'Chuyển khoản (QR qua VNPay)', 'Đặt hàng xong chuyển sang VNPay để quét QR. Đơn xác nhận khi VNPay báo thành công.'],
                    ] as const).map(([value, label, description]) => (
                      <button key={value} type="button" role="radio" aria-checked={paymentMethod === value} onClick={() => { setPaymentMethod(value); invalidateQuote(); }} className={optionClass(paymentMethod === value)}>
                        <strong className="text-sm text-slate-900">{label}</strong><span className="mt-1 block text-xs leading-5 text-slate-500">{description}</span>
                      </button>
                    ))}
                  </div>
                </section>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                  <button type="button" onClick={() => setStep(1)} className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700">Quay lại</button>
                  <button type="button" disabled={!quote || autoQuoting} onClick={() => { setAcceptedTerms(false); setStep(3); }} className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300">
                    {autoQuoting ? 'Đang tính phí...' : 'Tiếp tục'}
                  </button>
                </div>
              </>
            )}

            {step === 3 && quote && (
              <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="font-black text-slate-900">Xác nhận đơn hàng</h2>
                {[
                  { title: 'Địa chỉ nhận', body: <>{name} · {phone}<br />{addressLine}</>, edit: 1 as Step },
                  { title: 'Chi nhánh phục vụ', body: <>{quoteView?.branchName}</>, edit: null },
                  {
                    title: 'Vận chuyển',
                    body: quote.requiresShippingConsultation
                      ? <>Nhờ shop gửi — phí vận chuyển shop báo và tính riêng</>
                      : <>{quoteView?.shippingMethodLabel} · {quoteView?.shippingTotalAmount === 0 ? 'Miễn phí' : quoteView?.shippingTotalLabel}<br />Dự kiến {quoteView?.etaLabel}</>,
                    edit: 2 as Step,
                  },
                  { title: 'Thanh toán', body: <>{paymentLabel}</>, edit: 2 as Step },
                ].map(({ title, body, edit }) => (
                  <div key={title} className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4 last:border-0">
                    <div className="min-w-0 text-sm">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{title}</p>
                      <p className="mt-1 break-words font-semibold leading-6 text-slate-800">{body}</p>
                    </div>
                    {edit && (
                      <button type="button" onClick={() => setStep(edit)} className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-emerald-700">
                        <Pencil className="size-3.5" /> Sửa
                      </button>
                    )}
                  </div>
                ))}

                {quote.requiresShippingConsultation ? (
                  <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-semibold text-amber-900">Đơn hiện chỉ tính tiền hàng. Shop sẽ gọi báo phí vận chuyển và thời gian gửi; bấm kiểm tra lại sau khi shop đã báo để đặt hàng.</p>
                    <button type="button" onClick={refreshConsultedQuote} disabled={busy} className="shrink-0 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-black text-white disabled:bg-slate-300">
                      {busy ? 'Đang kiểm tra...' : 'Kiểm tra lại phí'}
                    </button>
                  </div>
                ) : (
                  <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                    <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="mt-0.5 size-4 accent-emerald-600" />
                    <span>
                      Tôi đã đọc và đồng ý{' '}
                      <Link href={STORE_POLICY_PAGES.TERMS.href} target="_blank" className="font-bold text-emerald-700 underline-offset-2 hover:underline">{STORE_POLICY_PAGES.TERMS.title.toLowerCase()}</Link>{' '}
                      và{' '}
                      <Link href={STORE_POLICY_PAGES.RETURNS.href} target="_blank" className="font-bold text-emerald-700 underline-offset-2 hover:underline">chính sách đổi trả</Link>.
                    </span>
                  </label>
                )}

                <p className="text-xs text-slate-500">Giá, tồn kho và phí giao được hệ thống kiểm tra lại khi đặt hàng; hàng được giữ 30 phút sau khi bạn bấm đặt hàng.</p>
              </section>
            )}

            {error && (step === 3 || (step === 1 && !autoQuoting)) && (
              <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">{error}</div>
            )}
          </div>

          <CheckoutOrderSummary
            items={items}
            localSubtotal={localSubtotal}
            quote={quoteView}
            busy={busy || redirectingToVnpay}
            quoting={autoQuoting}
            authLoaded={isLoaded}
            shopArranged={requestConsultation}
            showSubmit={step === 3}
            submitDisabled={!canConfirm || !acceptedTerms}
            submitLabel={redirectingToVnpay ? 'Đang chuyển sang VNPay...' : paymentMethod === 'VNPAY' ? 'Đặt hàng & thanh toán VNPay' : 'Đặt hàng'}
          />
        </form>
      </div>
    </StorefrontLayout>
  );
}
