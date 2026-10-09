'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckoutSkeleton } from '../components/checkout-skeleton';
import { useCartActions } from '@/features/cart';
import { useCustomerAuth } from '@/features/auth';
import { useToast } from '@/shared/components/global-toast';
import { usePublicNumberParameter } from '@/features/site-config';
import { toOrderDetailView } from '@/features/orders';
import { CheckoutOrderSummary } from '../components/checkout-order-summary';
import { CheckoutSuccess } from '../components/checkout-success';
import { CheckoutEmptyCart } from '../components/checkout-empty-cart';
import { CheckoutShippingInfoSection } from '../components/sections/checkout-shipping-info-section';
import { CheckoutDeliveryMethodSection } from '../components/sections/checkout-delivery-method-section';
import { CheckoutPaymentMethodSection } from '../components/sections/checkout-payment-method-section';
import { CheckoutConfirmSection } from '../components/sections/checkout-confirm-section';
import { useCheckoutCart } from '../hooks/use-checkout-cart';
import { useCheckoutForm } from '../hooks/use-checkout-form';
import { useAutoQuote, useCheckoutQuote } from '../hooks/use-checkout-quote';
import { useCheckoutSavedAddresses } from '../hooks/use-checkout-saved-addresses';
import { usePlaceOrder } from '../hooks/use-place-order';
import { CheckoutPaymentMethod } from '@/generated/api/checkout/checkout.schemas';

export function CheckoutPage() {
  // Bán kính giao miễn phí do Admin cấu hình; 10 km là giá trị mặc định của API khi chưa tải được.
  const freeRadiusKm = usePublicNumberParameter('SHIPPING_FREE_RADIUS_KM', 10);
  const router = useRouter();
  const { removeItem } = useCartActions();
  const { toast } = useToast();
  const { isAuthenticated, isLoaded } = useCustomerAuth();
  const { effectiveItems, localSubtotal, cartHydrated } = useCheckoutCart();

  const form = useCheckoutForm();
  const { shopArranged, paymentMethod } = form;
  const checkoutQuote = useCheckoutQuote({ form, removeItem, toast });
  const { quote, displayQuoteView, refreshingQuote, busy, error, autoQuoting, quotePending, invalidateQuote, retryQuote, refreshConsultedQuote, setError, confirmIdempotencyKey } = checkoutQuote;
  const { placedOrder, redirectingToVnpay, submit } = usePlaceOrder({
    form,
    checkoutQuote,
    effectiveItems,
    isLoaded,
    isAuthenticated,
    removeItem,
    toast,
  });
  // Effect điền sẵn sổ địa chỉ phải đăng ký trước effect báo giá tự động (effect chạy theo thứ tự gọi
  // hook): nó tăng `quoteSeq` trước để lượt báo giá không bắt đầu trên form sắp bị thay địa chỉ.
  const { savedAddresses, applySavedAddress, deliverToOtherAddress } = useCheckoutSavedAddresses({
    form,
    isLoaded,
    isAuthenticated,
    invalidateQuote,
  });
  useAutoQuote({ form, checkoutQuote, effectiveItems, isLoaded, isAuthenticated, placedOrder });

  /**
   * Đổi phương thức thanh toán / "Nhờ shop gửi": phí tính một lần theo địa chỉ + giỏ nên KHÔNG gọi API.
   * Ngoại lệ: đã bấm đặt hàng một lần (có khoá xác nhận) — phiên có thể đã giữ hàng với lựa chọn cũ và
   * Backend băm lựa chọn vào khoá idempotency, nên báo giá lại (giữ số cũ, mờ) để xác nhận bằng phiên mới.
   */
  const changeSelection = () => {
    if (confirmIdempotencyKey.current) invalidateQuote(true);
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) return setError('Trình duyệt không hỗ trợ xác định vị trí.');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        form.setCoordinates({ latitude: coords.latitude, longitude: coords.longitude });
        invalidateQuote();
        toast({ type: 'success', title: 'Đã lấy vị trí', message: 'Sẽ ưu tiên chi nhánh đủ hàng gần nhất.' });
      },
      () => setError('Không lấy được vị trí. Hệ thống vẫn có thể báo phí theo địa chỉ.'),
      { timeout: 8000 },
    );
  };

  if (!cartHydrated) {
    return (
        <CheckoutSkeleton />
    );
  }

  if (placedOrder) {
    return (
        <CheckoutSuccess order={toOrderDetailView(placedOrder)} />
    );
  }

  if (!effectiveItems.length) {
    return <CheckoutEmptyCart />;
  }

  // Layout storefront chỉ là `div` (xem `layouts/storefront-layout.tsx`), nên trang tự giữ landmark `<main>`.
  // `pb-28` trên mobile chừa chỗ cho thanh đặt hàng dính đáy trong `CheckoutOrderSummary`.
  return (
      <main className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pb-8">
        <div className="mb-6 sm:mb-8">
          <Link href="/cart" className="-ml-1 inline-flex min-h-11 items-center gap-1.5 px-1 text-xs font-bold text-neutral-900 hover:underline">
            ← Quay lại giỏ hàng
          </Link>
          <div className="mt-2 flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
                Đặt hàng & Thanh toán
              </h1>
              <p className="mt-1 text-sm text-neutral-500">
                Vui lòng điền thông tin nhận hàng và chọn phương thức thanh toán phù hợp.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_400px] [&>*]:min-w-0">
          <div className="min-w-0 space-y-6">
            <CheckoutShippingInfoSection
              form={form}
              savedAddresses={savedAddresses}
              applySavedAddress={applySavedAddress}
              onDeliverToOtherAddress={deliverToOtherAddress}
              invalidateQuote={invalidateQuote}
              useCurrentLocation={useCurrentLocation}
              freeRadiusKm={freeRadiusKm}
            />

            <CheckoutDeliveryMethodSection
              shopArranged={shopArranged}
              setShopArranged={form.setShopArranged}
              onSelectionChange={changeSelection}
              freeRadiusKm={freeRadiusKm}
              quotePending={quotePending && !refreshingQuote}
              refreshingQuote={refreshingQuote}
              quoteView={displayQuoteView}
              readyToQuote={form.readyToQuote}
              error={error}
              autoQuoting={autoQuoting}
              quote={quote}
              retryQuote={retryQuote}
            />

            <CheckoutPaymentMethodSection
              paymentMethod={paymentMethod}
              setPaymentMethod={form.setPaymentMethod}
              onSelectionChange={changeSelection}
            />

            <CheckoutConfirmSection
              quote={quote}
              refreshConsultedQuote={refreshConsultedQuote}
              busy={busy}
              error={error}
            />
          </div>

          <CheckoutOrderSummary
            items={effectiveItems}
            localSubtotal={localSubtotal}
            quote={displayQuoteView}
            busy={busy || redirectingToVnpay}
            quoting={quotePending && !refreshingQuote}
            refreshing={refreshingQuote}
            authLoaded={isLoaded}
            shopArranged={shopArranged}
            showSubmit={true}
            acceptedTerms={form.acceptedTerms}
            setAcceptedTerms={form.setAcceptedTerms}
            submitDisabled={busy || redirectingToVnpay}
            submitLabel={
              redirectingToVnpay
                ? 'Đang chuyển sang VNPay...'
                : busy
                ? 'Đang xử lý...'
                : paymentMethod === CheckoutPaymentMethod.VNPAY
                ? 'Đặt hàng & Thanh toán VNPay'
                : 'Đặt hàng'
            }
          />
        </form>
      </main>
  );
}
