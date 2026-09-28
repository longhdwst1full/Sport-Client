'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { CartItem } from '@/features/cart';
import { UnavailableCartLinesError } from '@/features/cart';
import type { CheckoutQuoteDto } from '@/generated/api/checkout/checkout.schemas';
import type { OrderDetailDto } from '@/generated/api/orders/orders.schemas';
import { apiErrorMessage } from '@/lib/api/error-message';
import type { useToast } from '@/shared/components/global-toast';
import { prepareCheckout, reloadCheckout, type CheckoutContext } from '../api/checkout.workflow';
import { toCheckoutQuoteView } from '../model/checkout.mapper';
import type { CheckoutForm } from './use-checkout-form';

type Toast = ReturnType<typeof useToast>['toast'];

function messageOf(error: unknown): string {
  return apiErrorMessage(
    error,
    error instanceof Error ? error.message : 'Không thể xử lý yêu cầu. Vui lòng thử lại.',
  );
}

/**
 * Báo giá, ngữ cảnh checkout, khóa idempotency và trạng thái lỗi/bận dùng chung cho báo giá và đặt đơn.
 * Không chứa effect báo giá tự động (xem `useAutoQuote`) để effect điền sẵn sổ địa chỉ vẫn chạy trước nó.
 */
export function useCheckoutQuote({
  form,
  removeItem,
  toast,
}: {
  form: CheckoutForm;
  removeItem: (variantId: string) => void;
  toast: Toast;
}) {
  const [quote, setQuote] = useState<CheckoutQuoteDto>();
  // DTO giữ nguyên cho luồng xác nhận; phần hiển thị dùng view model để không
  // rải định dạng và nhãn khắp JSX (`09-data-transformation.md`).
  const quoteView = useMemo(() => (quote ? toCheckoutQuoteView(quote) : undefined), [quote]);
  const [context, setContext] = useState<CheckoutContext>();
  // IDEMPOTENCY: Retry cùng ý định phải dùng lại key; tạo key mới sau timeout mạng có thể biến retry thành lệnh thứ hai.
  const confirmIdempotencyKey = useRef<string | undefined>(undefined);
  const orderIdempotencyKey = useRef<string | undefined>(undefined);
  // Mỗi lượt báo giá tự động mang một số thứ tự; phản hồi của lượt cũ (khách đã sửa địa chỉ) bị bỏ.
  const quoteSeq = useRef(0);
  const [autoQuoting, setAutoQuoting] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

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
      caught.variantIds.forEach((variantId) => removeItem(variantId));
    }
    const msg = messageOf(caught);
    setError(msg);
    toast({
      type: 'error',
      title: 'Không thể xử lý đơn hàng',
      message: msg,
    });
  };

  /** Lượt báo giá tự động lỗi (GHN timeout, mạng): khách bấm thử lại mà không phải sửa form. */
  const retryQuote = () => {
    setError('');
    setQuote(undefined);
    quoteSeq.current += 1;
    // Đổi một dependency của effect báo giá để nó chạy lại ngay.
    form.setAddress((current) => ({ ...current }));
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

  // Debounce 700 ms trước lượt báo giá cũng là "đang tính": chưa có quote nhưng không phải lỗi.
  const quotePending = autoQuoting || (form.readyToQuote && !quote && !error);

  return {
    quote, setQuote,
    quoteView,
    context, setContext,
    confirmIdempotencyKey,
    orderIdempotencyKey,
    quoteSeq,
    autoQuoting, setAutoQuoting,
    busy, setBusy,
    error, setError,
    invalidateQuote,
    handleCheckoutError,
    retryQuote,
    refreshConsultedQuote,
    quotePending,
  };
}

export type CheckoutQuoteState = ReturnType<typeof useCheckoutQuote>;

/** Tự báo giá (debounce 700 ms) khi form đủ thông tin và chưa có báo giá hiện hành. */
export function useAutoQuote({
  form,
  checkoutQuote,
  effectiveItems,
  isLoaded,
  isAuthenticated,
  placedOrder,
}: {
  form: CheckoutForm;
  checkoutQuote: CheckoutQuoteState;
  effectiveItems: CartItem[];
  isLoaded: boolean;
  isAuthenticated: boolean;
  placedOrder: OrderDetailDto | undefined;
}) {
  const { readyToQuote, name, phone, email, note, address, coordinates, paymentMethod, shopArranged, buildInput } = form;
  const { quote, quoteSeq, setAutoQuoting, setError, setQuote, setContext, handleCheckoutError } = checkoutQuote;
  useEffect(() => {
    if (!isLoaded || !readyToQuote || quote || placedOrder || !effectiveItems.length) return;
    const seq = ++quoteSeq.current;
    const timer = setTimeout(async () => {
      setAutoQuoting(true);
      setError('');
      try {
        const prepared = await prepareCheckout(
          effectiveItems.map(({ variantId, quantity }) => ({ variantId, quantity })),
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
  }, [isLoaded, readyToQuote, quote, placedOrder, effectiveItems, isAuthenticated, name, phone, email, note, address, coordinates, paymentMethod, shopArranged]);
}
