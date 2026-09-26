'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState  } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, CheckCircle2, CreditCard, LoaderCircle, LocateFixed, MapPin, Pencil, RotateCcw, ShieldCheck, Truck } from 'lucide-react';
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

/** Mã của hãng vận chuyển giữ nguyên chuỗi (mã phường GHN có thể chứa chữ); rỗng thì bắt chọn lại. */
const toCode = (value?: string | null) => value?.trim() || null;

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
      provinceCode: address.provinceCode ?? '',
      districtCode: address.districtCode ?? undefined,
      wardCode: address.wardCode ?? undefined,
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
    if (!isLoaded || busy) return;
    setError('');

    if (!addressValid) {
      setError('Vui lòng điền họ tên, số điện thoại và chọn đầy đủ địa chỉ giao hàng (Tỉnh, Huyện, Phường/Xã).');
      return;
    }

    if (autoQuoting) {
      setError('Hệ thống đang tính toán phí vận chuyển, vui lòng chờ trong giây lát...');
      return;
    }

    if (!quote || !context) {
      setError('Chưa thể tính phí vận chuyển hoặc địa chỉ không hợp lệ. Vui lòng kiểm tra lại địa chỉ nhận hàng.');
      return;
    }

    if (quote.requiresShippingConsultation) {
      setError('Đơn hàng cần nhân viên tư vấn cước gửi xe riêng. Vui lòng bấm kiểm tra lại phí sau khi đã thống nhất.');
      return;
    }

    if (!acceptedTerms) {
      setError('Vui lòng đánh dấu đồng ý với Điều khoản dịch vụ và Chính sách đổi trả trước khi đặt hàng.');
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

  if (!cartHydrated) return null;

  if (placedOrder) {
    return (
      <StorefrontLayout>
        <CheckoutSuccess order={toOrderDetailView(placedOrder)} />
      </StorefrontLayout>
    );
  }

  if (!items.length) {
    return (
      <StorefrontLayout>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link href="/cart" className="text-sm font-bold text-emerald-700 hover:underline">
              ← Quay lại giỏ hàng
            </Link>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              Thanh toán đơn hàng
            </h1>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center sm:p-12 shadow-sm">
              <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-amber-50 text-amber-600">
                <Truck className="size-8" />
              </div>
              <h2 className="mt-4 text-xl font-black text-slate-900">Giỏ hàng của bạn đang trống</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 leading-relaxed">
                Bạn chưa có sản phẩm nào trong giỏ để thực hiện thanh toán. Vui lòng chọn sản phẩm thể thao ưng ý trước khi hoàn tất đặt hàng.
              </p>

              {/* Payment Methods Info */}
              <div className="mt-8 rounded-2xl border border-slate-100 bg-slate-50 p-5 text-left">
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Phương thức thanh toán hỗ trợ:
                </span>
                <div className="mt-3 grid gap-2.5 sm:grid-cols-2 text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-2 rounded-xl bg-white p-3 border border-slate-200">
                    <span className="grid size-6 place-items-center rounded bg-emerald-100 text-emerald-700 font-extrabold text-[10px]">COD</span>
                    <span>Thanh toán khi nhận hàng (COD)</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-white p-3 border border-slate-200">
                    <CreditCard className="size-4 text-emerald-600" />
                    <span>Chuyển khoản VietQR / VNPay</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700"
                >
                  <span>Tiếp tục mua sắm</span>
                </Link>
                <Link
                  href="/cart"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  <span>Về giỏ hàng</span>
                </Link>
              </div>
            </div>

            <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-black text-slate-950">Tóm tắt đơn hàng</h2>
              <div className="mt-4 space-y-3 border-t border-slate-100 pt-4 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Tạm tính</span>
                  <span className="font-bold text-slate-900">0 ₫</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Phí vận chuyển</span>
                  <span className="text-slate-400">Tính khi có hàng</span>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-3 text-base font-black text-slate-950">
                  <span>Tổng tiền</span>
                  <span className="text-emerald-700">0 ₫</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </StorefrontLayout>
    );
  }

  const inputClass = 'mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/15';
  const optionClass = (selected: boolean) =>
    `rounded-2xl border p-4 text-left transition ${selected ? 'border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600' : 'border-slate-200 hover:border-emerald-300'}`;

  return (
    <StorefrontLayout>
      {/* StorefrontLayout đã có <main>; lồng thêm <main> là sai landmark cho trình đọc màn hình. */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/cart" className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline">
            ← Quay lại giỏ hàng
          </Link>
          <div className="mt-2 flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                Thanh toán đơn hàng
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Vui lòng điền thông tin nhận hàng và chọn phương thức thanh toán phù hợp.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/70 px-3.5 py-1.5 text-xs font-bold text-emerald-800">
              <ShieldCheck className="size-4 text-emerald-600" />
              <span>Bảo mật chuẩn SSL 256-bit</span>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_400px] [&>*]:min-w-0">
          <div className="min-w-0 space-y-6">
            {/* Section 1: Thông tin giao hàng */}
            <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm transition hover:border-slate-300">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <span className="grid size-8 place-items-center rounded-xl bg-emerald-600 text-sm font-black text-white shadow-sm shadow-emerald-600/30">
                  1
                </span>
                <div>
                  <h2 className="flex items-center gap-2 text-base font-black text-slate-900 sm:text-lg">
                    <MapPin className="size-5 text-emerald-600" /> Thông tin giao hàng
                  </h2>
                  <p className="text-xs text-slate-500">Người nhận và địa chỉ nhận hàng tận nơi</p>
                </div>
              </div>

              {savedAddresses.data && savedAddresses.data.length > 0 && (
                <div className="mt-5 space-y-2.5" role="radiogroup" aria-label="Địa chỉ đã lưu">
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Sổ địa chỉ của bạn:
                  </span>
                  {savedAddresses.data.map((saved) => (
                    <button
                      key={saved.id}
                      type="button"
                      role="radio"
                      aria-checked={selectedAddressId === saved.id}
                      onClick={() => applySavedAddress(saved)}
                      className={`w-full ${optionClass(selectedAddressId === saved.id)}`}
                    >
                      <span className="flex flex-wrap items-center justify-between gap-2">
                        <strong className="text-sm font-bold text-slate-900">{saved.recipient}</strong>
                        <span className="text-xs font-bold text-slate-500">{saved.phone}</span>
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-slate-600">
                        {[saved.addressLine, saved.ward, saved.district, saved.province].filter(Boolean).join(', ')}
                      </span>
                      {saved.isDefault && (
                        <span className="mt-1.5 inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-700">
                          Mặc định
                        </span>
                      )}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAddressId('');
                      setName('');
                      setPhone('');
                      setAddress(initialAddress);
                      setAddressFormKey((key) => key + 1);
                      invalidateQuote();
                    }}
                    className="w-full rounded-2xl border border-dashed border-slate-300 p-3 text-xs font-bold text-emerald-700 hover:border-emerald-400 hover:bg-emerald-50/50 transition"
                  >
                    + Giao tới địa chỉ khác
                  </button>
                </div>
              )}

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-bold text-slate-700">
                  Người nhận <span className="text-rose-600">*</span>
                  <input
                    value={name}
                    placeholder="Họ và tên người nhận"
                    onChange={(e) => { setName(e.target.value); invalidateQuote(); }}
                    autoComplete="name"
                    className={inputClass}
                  />
                </label>
                <label className="text-xs font-bold text-slate-700">
                  Số điện thoại <span className="text-rose-600">*</span>
                  <input
                    value={phone}
                    placeholder="Ví dụ: 0912345678"
                    inputMode="tel"
                    autoComplete="tel"
                    onChange={(e) => { setPhone(e.target.value); invalidateQuote(); }}
                    className={inputClass}
                  />
                </label>
                <label className="text-xs font-bold text-slate-700 sm:col-span-2">
                  Email (nhận mã đơn và thông báo trạng thái giao hàng)
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    autoComplete="email"
                    onChange={(e) => { setEmail(e.target.value); invalidateQuote(); }}
                    className={inputClass}
                  />
                </label>
              </div>

              <div className="mt-5">
                <VietnamAddressSelector
                  key={addressFormKey}
                  initialData={address}
                  onChange={(value) => { setAddress(value); invalidateQuote(); }}
                  required
                />
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={useCurrentLocation}
                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/50 px-3.5 py-2 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100"
                >
                  <LocateFixed className="size-4 text-emerald-600" />
                  <span>{coordinates ? 'Đã lấy vị trí của bạn' : 'Định vị vị trí hiện tại (Miễn phí nếu dưới 10 km)'}</span>
                </button>
              </div>

              <label className="mt-4 block text-xs font-bold text-slate-700">
                Ghi chú giao hàng (tùy chọn)
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => { setNote(e.target.value); invalidateQuote(); }}
                  className={inputClass}
                  placeholder="Gọi trước khi giao, giao giờ hành chính..."
                />
              </label>
            </section>

            {/* Section 2: Phương thức vận chuyển */}
            <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm transition hover:border-slate-300">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <span className="grid size-8 place-items-center rounded-xl bg-emerald-600 text-sm font-black text-white shadow-sm shadow-emerald-600/30">
                  2
                </span>
                <div>
                  <h2 className="flex items-center gap-2 text-base font-black text-slate-900 sm:text-lg">
                    <Truck className="size-5 text-emerald-600" /> Phương thức vận chuyển
                  </h2>
                  <p className="text-xs text-slate-500">Cước phí tính toán tự động và minh bạch</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3.5 sm:grid-cols-2" role="radiogroup" aria-label="Cách giao hàng">
                <button
                  type="button"
                  role="radio"
                  aria-checked={!requestConsultation}
                  onClick={() => { setRequestConsultation(false); invalidateQuote(); }}
                  className={optionClass(!requestConsultation)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <strong className="text-sm font-bold text-slate-900">Giao hàng tiêu chuẩn</strong>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-800">
                      Khuyên dùng
                    </span>
                  </div>
                  <span className="mt-1.5 block text-xs leading-5 text-slate-500">
                    Đội xe Bảo An giao miễn phí trong 10 km, giao toàn quốc qua GHN Express.
                  </span>

                  {!requestConsultation && (
                    <div className="mt-3.5 border-t border-slate-100 pt-3 text-xs" aria-live="polite">
                      {autoQuoting ? (
                        <span className="inline-flex items-center gap-1.5 font-bold text-slate-500">
                          <LoaderCircle className="size-3.5 animate-spin text-emerald-600" /> Đang tính phí vận chuyển...
                        </span>
                      ) : quoteView ? (
                        <div className="space-y-1">
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm font-black text-emerald-700">
                              {quoteView.shippingTotalAmount === 0 ? 'Miễn phí giao hàng' : quoteView.shippingTotalLabel}
                            </span>
                            <span className="text-slate-400">·</span>
                            <span className="font-semibold text-slate-600">{quoteView.shippingMethodLabel}</span>
                          </div>
                          <p className="text-[11px] font-medium text-slate-500">
                            Dự kiến nhận hàng: <strong className="font-bold text-slate-700">{quoteView.etaLabel}</strong>
                          </p>
                          {quoteView.branchName && (
                            <p className="text-[11px] text-slate-400">Phục vụ từ: {quoteView.branchName}</p>
                          )}
                        </div>
                      ) : !readyToQuote ? (
                        <span className="font-semibold text-slate-400">
                          Điền thông tin địa chỉ ở bước 1 để hệ thống báo giá giao hàng.
                        </span>
                      ) : (
                        <span className="font-semibold text-rose-600">Chưa tính được phí vận chuyển</span>
                      )}
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  role="radio"
                  aria-checked={requestConsultation}
                  onClick={() => { setRequestConsultation(true); invalidateQuote(); }}
                  className={optionClass(requestConsultation)}
                >
                  <strong className="text-sm font-bold text-slate-900">Nhờ shop tư vấn & gửi chành</strong>
                  <span className="mt-1.5 block text-xs leading-5 text-slate-500">
                    Dành cho giàn tạ, máy khối lớn gửi xe khách / xe tải liên tỉnh. Nhân viên sẽ gọi báo cước riêng.
                  </span>
                  {requestConsultation && (
                    <div className="mt-3.5 border-t border-slate-100 pt-3">
                      <span className="inline-block rounded-lg bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-800">
                        Cước vận chuyển thanh toán riêng với nhà xe
                      </span>
                    </div>
                  )}
                </button>
              </div>

              {error && !autoQuoting && !quote && (
                <div role="alert" className="mt-4 flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 sm:flex-row sm:items-center sm:justify-between">
                  <span className="flex items-start gap-2"><AlertTriangle className="mt-0.5 size-4 shrink-0" /> {error}</span>
                  <button type="button" onClick={retryQuote} className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-rose-700">
                    <RotateCcw className="size-3.5" /> Thử lại
                  </button>
                </div>
              )}
            </section>

            {/* Section 3: Phương thức thanh toán */}
            <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm transition hover:border-slate-300">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <span className="grid size-8 place-items-center rounded-xl bg-emerald-600 text-sm font-black text-white shadow-sm shadow-emerald-600/30">
                  3
                </span>
                <div>
                  <h2 className="flex items-center gap-2 text-base font-black text-slate-900 sm:text-lg">
                    <CreditCard className="size-5 text-emerald-600" /> Phương thức thanh toán
                  </h2>
                  <p className="text-xs text-slate-500">Lựa chọn hình thức thanh toán thuận tiện nhất</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3.5 sm:grid-cols-2" role="radiogroup" aria-label="Phương thức thanh toán">
                {([
                  [
                    'COD',
                    'Thanh toán khi nhận hàng (COD)',
                    'Kiểm tra hàng trước khi nhận, thanh toán tiền mặt cho nhân viên giao hàng.',
                    'COD',
                  ],
                  [
                    'VNPAY',
                    'Chuyển khoản VietQR / VNPay',
                    'Quét mã QR bằng ứng dụng ngân hàng hoặc ví điện tử VNPay, hoàn tất tức thì.',
                    'QR',
                  ],
                ] as const).map(([value, label, description, badge]) => (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={paymentMethod === value}
                    onClick={() => { setPaymentMethod(value); invalidateQuote(); }}
                    className={optionClass(paymentMethod === value)}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <strong className="text-sm font-bold text-slate-900">{label}</strong>
                      <span className="grid size-7 place-items-center rounded-lg bg-emerald-100 font-extrabold text-[11px] text-emerald-800">
                        {badge}
                      </span>
                    </div>
                    <span className="mt-2 block text-xs leading-5 text-slate-500">{description}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Section 4: Cam kết & Xác nhận */}
            <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-slate-50 p-4 text-xs sm:text-sm text-slate-700 border border-slate-200/60">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 size-4 accent-emerald-600 cursor-pointer rounded"
                />
                <span className="leading-relaxed">
                  Tôi đã đọc và đồng ý với{' '}
                  <Link href={STORE_POLICY_PAGES.TERMS.href} target="_blank" className="font-bold text-emerald-700 underline-offset-2 hover:underline">
                    {STORE_POLICY_PAGES.TERMS.title.toLowerCase()}
                  </Link>{' '}
                  và{' '}
                  <Link href={STORE_POLICY_PAGES.RETURNS.href} target="_blank" className="font-bold text-emerald-700 underline-offset-2 hover:underline">
                    chính sách đổi trả & bảo hành
                  </Link>{' '}
                  của Bảo An Sport.
                </span>
              </label>

              {quote?.requiresShippingConsultation && (
                <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs sm:text-sm font-semibold text-amber-900">
                    Đơn hàng hiện chỉ tính tiền sản phẩm. Nhân viên sẽ liên hệ thông báo cước gửi xe; bấm kiểm tra lại phí sau khi đã thống nhất để đặt hàng.
                  </p>
                  <button
                    type="button"
                    onClick={refreshConsultedQuote}
                    disabled={busy}
                    className="shrink-0 rounded-xl bg-amber-600 px-4 py-2 text-xs font-black text-white hover:bg-amber-700 disabled:bg-slate-300"
                  >
                    {busy ? 'Đang kiểm tra...' : 'Kiểm tra lại phí'}
                  </button>
                </div>
              )}

              {error && (
                <div role="alert" className="mt-4 flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-bold text-rose-700">
                  <AlertTriangle className="size-4 shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* Mobile Submit Button */}
              <div className="mt-5 lg:hidden">
                <button
                  type="submit"
                  disabled={busy || redirectingToVnpay}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-4 text-sm font-black text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {busy ? <LoaderCircle className="size-5 animate-spin" /> : <CheckCircle2 className="size-5" />}
                  <span>
                    {redirectingToVnpay
                      ? 'Đang chuyển sang VNPay...'
                      : busy
                      ? 'Đang xử lý...'
                      : paymentMethod === 'VNPAY'
                      ? 'Đặt hàng & Thanh toán VNPay'
                      : 'Hoàn tất đặt hàng'}
                  </span>
                </button>
              </div>
            </section>
          </div>

          <CheckoutOrderSummary
            items={items}
            localSubtotal={localSubtotal}
            quote={quoteView}
            busy={busy || redirectingToVnpay}
            quoting={autoQuoting}
            authLoaded={isLoaded}
            shopArranged={requestConsultation}
            showSubmit={true}
            submitDisabled={busy || redirectingToVnpay}
            submitLabel={
              redirectingToVnpay
                ? 'Đang chuyển sang VNPay...'
                : busy
                ? 'Đang xử lý...'
                : paymentMethod === 'VNPAY'
                ? 'Đặt hàng & Thanh toán VNPay'
                : 'Hoàn tất đặt hàng'
            }
          />
        </form>
      </div>
    </StorefrontLayout>
  );
}
