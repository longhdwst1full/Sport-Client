'use client';

import { useState, type FormEvent } from 'react';
import type { CartItem } from '@/features/cart';
import { paymentRequest, readGuestOrderAccessToken } from '@/features/orders';
import type { OrderDetailDto } from '@/generated/api/orders/orders.schemas';
import { getAccountPayment, getGuestPayment } from '@/generated/api/payments/payments';
import type { useToast } from '@/shared/components/global-toast';
import { confirmCheckout, placeOrder } from '../api/checkout.workflow';
import { resolveCheckoutQuoteGate } from '../model/checkout-quote-gate';
import type { CheckoutForm } from './use-checkout-form';
import type { CheckoutQuoteState } from './use-checkout-quote';

type Toast = ReturnType<typeof useToast>['toast'];

/** Xác nhận báo giá + đặt đơn (dùng lại khóa idempotency của báo giá hiện hành) và chuyển sang VNPay nếu cần. */
export function usePlaceOrder({
  form,
  checkoutQuote,
  effectiveItems,
  isLoaded,
  isAuthenticated,
  removeItem,
  toast,
}: {
  form: CheckoutForm;
  checkoutQuote: CheckoutQuoteState;
  effectiveItems: CartItem[];
  isLoaded: boolean;
  isAuthenticated: boolean;
  removeItem: (variantId: string) => void;
  toast: Toast;
}) {
  const [placedOrder, setPlacedOrder] = useState<OrderDetailDto>();
  const [redirectingToVnpay, setRedirectingToVnpay] = useState(false);

  const { readyToQuote, acceptedTerms, paymentMethod } = form;
  const {
    quote,
    context,
    autoQuoting,
    busy,
    setBusy,
    error,
    setError,
    confirmIdempotencyKey,
    orderIdempotencyKey,
    retryQuote,
    handleCheckoutError,
  } = checkoutQuote;
  const addressValid = readyToQuote;

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

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!isLoaded || busy) return;
    // Giữ lỗi báo giá trước khi xoá khung lỗi, để báo đúng lý do nếu chưa có phí.
    const quoteError = error;
    setError('');

    if (!addressValid) {
      const msg = 'Vui lòng điền họ tên, số điện thoại và chọn đầy đủ địa chỉ giao hàng (Tỉnh, Huyện, Phường/Xã).';
      setError(msg);
      toast({ type: 'warning', title: 'Thiếu thông tin nhận hàng', message: msg });
      return;
    }

    const gate = resolveCheckoutQuoteGate({
      readyToQuote,
      autoQuoting,
      hasQuote: Boolean(quote && context),
      quoteError,
      requiresShippingConsultation: quote?.requiresShippingConsultation,
    });
    if (gate.kind === 'QUOTING') {
      // Không setError: lỗi sẽ chặn effect báo giá đang chờ debounce và hiện khung "Thử lại" giả.
      toast({ type: 'info', title: 'Đang tính phí vận chuyển', message: 'Hệ thống đang tính phí vận chuyển, vui lòng chờ trong giây lát rồi bấm đặt hàng.' });
      return;
    }

    if (gate.kind === 'QUOTE_FAILED' || !quote || !context) {
      // Hiện đúng lý do từ API rồi báo giá lại; effect không tự chạy lại sau lỗi.
      const reason = gate.kind === 'QUOTE_FAILED' ? gate.reason : 'Vui lòng kiểm tra lại địa chỉ nhận hàng.';
      toast({ type: 'error', title: 'Chưa có phí vận chuyển', message: `${reason} Hệ thống đang thử tính lại phí.` });
      retryQuote();
      return;
    }

    // Chỉ báo giá chờ nhân viên chốt cước mới chặn; "Nhờ shop gửi" (shippingFeePending) đặt được ngay.
    if (gate.kind === 'CONSULTATION_PENDING') {
      const msg = 'Đơn hàng cần nhân viên tư vấn cước gửi xe riêng. Vui lòng bấm kiểm tra lại phí sau khi đã thống nhất.';
      setError(msg);
      toast({ type: 'warning', title: 'Cần tư vấn cước vận chuyển', message: msg });
      return;
    }

    if (!acceptedTerms) {
      const msg = 'Vui lòng đánh dấu đồng ý với Điều khoản dịch vụ và Chính sách đổi trả trước khi đặt hàng.';
      setError(msg);
      toast({ type: 'warning', title: 'Chưa đồng ý điều khoản', message: msg });
      return;
    }
    setBusy(true);
    try {
      // IDEMPOTENCY: Chỉ tạo key khi chưa có; key bị xoá khi báo giá bị huỷ (đổi form), nên retry cùng báo giá dùng lại key cũ.
      confirmIdempotencyKey.current ??= crypto.randomUUID();
      orderIdempotencyKey.current ??= crypto.randomUUID();
      await confirmCheckout(context, quote.checkoutToken, confirmIdempotencyKey.current);
      const order = await placeOrder(context, quote.checkoutToken, orderIdempotencyKey.current);
      // Xoá đúng các sản phẩm đã thanh toán khỏi giỏ hàng
      effectiveItems.forEach((item) => removeItem(item.variantId));
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

  return { placedOrder, redirectingToVnpay, submit };
}
