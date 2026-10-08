'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, XCircle } from 'lucide-react';
import { Button, buttonVariants } from '@/foundation/components/buttons';
import { ErrorState } from '@/foundation/components/feedback';
import {
  getGetAccountOrderQueryKey,
  getGetGuestOrderQueryKey,
  getListAccountOrdersQueryKey,
} from '@/generated/api/orders/orders';
import { OrderReturnCta } from '@/features/returns';
import { ReviewFormDialog } from '@/features/reviews';
import { OrderPaymentPanel } from '../components/order-payment-panel';
import { OrderDetailSkeleton } from '../components/order-skeletons';
import { OrderActionsBar } from '../components/order-detail/order-actions-bar';
import { OrderCancelDialog } from '../components/order-detail/order-cancel-dialog';
import { OrderDeliveryAddressCard } from '../components/order-detail/order-delivery-address-card';
import { OrderDetailHeader } from '../components/order-detail/order-detail-header';
import { OrderProductsCard } from '../components/order-detail/order-products-card';
import { OrderShipmentSection } from '../components/order-detail/order-shipment-section';
import { OrderStatusHero } from '../components/order-detail/order-status-hero';
import { OrderSupportCard } from '../components/order-detail/order-support-card';
import { OrderSupportDialog } from '../components/order-detail/order-support-dialog';
import { OrderReceiptPrint } from '../components/order-detail/order-receipt-print';
import { printOrderReceipt } from '../model/print-receipt';
import { useCancelOrder } from '../hooks/use-cancel-order';
import { useOrderCopy } from '../hooks/use-order-copy';
import { useOrderDetail } from '../hooks/use-order-detail';
import { useToast } from '@/shared/components/global-toast';
import { useReorder } from '../hooks/use-reorder';
import { apiErrorMessage } from '@/lib/api/error-message';
import { ORDER_LOAD_ERROR_MESSAGE } from '../model/order.constants';
import { GUEST_LOOKUP_COPY, GUEST_LOOKUP_ROUTE } from '../model/guest-order-lookup.constants';
import { guestLookupErrorMessage } from '../model/guest-order-lookup-error';
import { formatDateTime } from '@/shared/format/date-time';

const PRIMARY_ACTION = buttonVariants({ variant: 'primary', className: 'px-5 font-bold shadow-sm' });
const DANGER_ACTION = buttonVariants({ variant: 'danger', className: 'px-5 font-bold shadow-sm' });
const HOME_ACTION = buttonVariants({ variant: 'outline', className: 'px-5 font-bold text-slate-700' });

export function OrderDetailPage({ orderNo }: { orderNo: string }) {
  // Hook tải đơn gọi trước hook hủy đơn: effect thu hồi mã truy cập vãng lai giữ nguyên thứ tự chạy cũ.
  const { isAuthenticated, isLoaded, guestToken, accessMode, lookupGrant, lookupExpired, orderQuery, order, view, canCancel } =
    useOrderDetail(orderNo);
  const lookupHref = `${GUEST_LOOKUP_ROUTE}?orderNo=${encodeURIComponent(orderNo)}`;
  const queryClient = useQueryClient();
  const toast = useToast();
  const triggerToast = (message: string) => toast.success(message);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [reviewingItem, setReviewingItem] = useState<{ id: string; productName: string }>();
  const [submittedReviewItems, setSubmittedReviewItems] = useState<Set<string>>(() => new Set());
  const { reason, setReason, showCancel, setShowCancel, cancel, closeCancel } = useCancelOrder({
    orderNo,
    order,
    isAuthenticated,
    guestToken,
    triggerToast,
  });
  const { copiedOrderNo, copiedTrackingNo, copiedAddress, handleCopyOrderNo, handleCopyTrackingNo, handleCopyAddress } = useOrderCopy({
    view,
    triggerToast,
  });
  const { handleReorderAll, handleReorderItem } = useReorder({ order, triggerToast });

  return (
    <>
      {/* Toast Notification */}

      <main className="mx-auto min-h-[65vh] max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
        {!isLoaded || orderQuery.isLoading ? (
          <OrderDetailSkeleton />
        ) : accessMode === 'none' ? (
          <ErrorState
            className="mx-auto max-w-xl rounded-3xl border border-amber-200 bg-amber-50/70 p-8 sm:p-10 text-center shadow-card"
            iconWrapClassName="mx-auto grid size-16 place-items-center rounded-2xl bg-amber-100 text-amber-600"
            icon={<XCircle className="size-9" />}
            titleClassName="mt-5 text-xl font-black text-slate-900"
            title="Không tìm thấy mã truy cập đơn hàng"
            descriptionClassName="mx-auto mt-2 max-w-md text-sm leading-relaxed text-amber-900"
            description="Hãy mở đơn trên trình duyệt đã dùng để đặt hàng, tra cứu bằng email người nhận, hoặc đăng nhập tài khoản để xem toàn bộ lịch sử đơn."
            actions={
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link href={lookupHref} className={PRIMARY_ACTION}>
                  Tra cứu bằng email
                </Link>
                <Link href="/login" className={PRIMARY_ACTION}>
                  Đăng nhập
                </Link>
                <Link href="/" className={HOME_ACTION}>
                  Về trang chủ
                </Link>
              </div>
            }
          />
        ) : orderQuery.isError ? (
          <ErrorState
            className="mx-auto max-w-xl rounded-3xl border border-rose-200 bg-rose-50/80 p-8 sm:p-10 text-center shadow-card"
            iconWrapClassName="mx-auto grid size-16 place-items-center rounded-2xl bg-rose-100 text-rose-600"
            icon={<AlertTriangle className="size-9" />}
            titleClassName="mt-5 text-xl font-black text-rose-950"
            title="Không thể tải thông tin đơn hàng"
            descriptionClassName="mx-auto mt-2 max-w-md text-sm leading-relaxed text-rose-800"
            description={
              accessMode === 'lookup'
                ? guestLookupErrorMessage(orderQuery.error, apiErrorMessage(orderQuery.error, ORDER_LOAD_ERROR_MESSAGE))
                : apiErrorMessage(orderQuery.error, ORDER_LOAD_ERROR_MESSAGE)
            }
            actions={
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {lookupExpired ? (
                  <Link href={lookupHref} className={DANGER_ACTION}>
                    Xác thực lại bằng email
                  </Link>
                ) : (
                  <Button variant="danger" onClick={() => orderQuery.refetch()} className="px-5 font-bold shadow-sm">
                    Thử lại
                  </Button>
                )}
                <Link href="/" className={HOME_ACTION}>
                  Về trang chủ
                </Link>
              </div>
            }
          />
        ) : order ? (
          <>
            <OrderDetailHeader
              orderNo={order.orderNo}
              isAuthenticated={isAuthenticated}
              onOpenSupport={() => setShowSupportModal(true)}
            />

            {accessMode === 'lookup' && lookupGrant && (
              <div role="status" className="mt-4 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-xs text-sky-900">
                {GUEST_LOOKUP_COPY.viaLookupNotice} <strong>{formatDateTime(lookupGrant.expiresAt)}</strong>.{' '}
                {GUEST_LOOKUP_COPY.viaLookupReadOnly}
              </div>
            )}

            <OrderStatusHero
              orderNo={order.orderNo}
              view={view}
              copiedOrderNo={copiedOrderNo}
              onCopyOrderNo={handleCopyOrderNo}
            />

            <OrderShipmentSection
              view={view}
              copiedTrackingNo={copiedTrackingNo}
              onCopyTrackingNo={handleCopyTrackingNo}
              showTimeline={showTimeline}
              setShowTimeline={setShowTimeline}
            />

            {/* Main Content Two Columns */}
            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] items-start">
              {/* Left Column: Products & Bill Summary */}
              <div className="space-y-6">
                <OrderProductsCard
                  view={view}
                  order={order}
                  isAuthenticated={isAuthenticated}
                  submittedReviewItems={submittedReviewItems}
                  onReview={setReviewingItem}
                  onReorderItem={handleReorderItem}
                />

                <OrderActionsBar
                  orderStatus={order.status}
                  isAuthenticated={isAuthenticated}
                  canCancel={canCancel}
                  onReorderAll={handleReorderAll}
                  onOpenCancel={() => setShowCancel(true)}
                  onPrintReceipt={printOrderReceipt}
                  onOpenSupport={() => setShowSupportModal(true)}
                />
                <OrderReceiptPrint order={order} />
              </div>

              {/* Right Aside Column: Payment Panel, Address & Contextual Support */}
              <aside className="space-y-6">
                {/* Grant OTP chỉ cho xem; thanh toán khách vãng lai cần `x-cart-token` của trình duyệt đã đặt. */}
                {accessMode !== 'lookup' && (
                <OrderPaymentPanel
                  orderNo={orderNo}
                  authenticated={isAuthenticated}
                  guestToken={guestToken}
                  onPaymentChanged={async () => {
                    await queryClient.invalidateQueries({ queryKey: isAuthenticated ? getGetAccountOrderQueryKey(orderNo) : getGetGuestOrderQueryKey(orderNo) });
                    if (isAuthenticated) {
                      await queryClient.invalidateQueries({ queryKey: getListAccountOrdersQueryKey() });
                    }
                  }}
                />
                )}

                <OrderReturnCta orderNo={orderNo} authenticated={isAuthenticated} />

                <OrderDeliveryAddressCard
                  view={view}
                  copiedAddress={copiedAddress}
                  onCopyAddress={handleCopyAddress}
                />

                <OrderSupportCard orderNo={order.orderNo} onOpenSupport={() => setShowSupportModal(true)} />
              </aside>
            </div>

            {showCancel && (
              <OrderCancelDialog
                orderNo={order.orderNo}
                reason={reason}
                setReason={setReason}
                cancel={cancel}
                closeCancel={closeCancel}
              />
            )}

            {showSupportModal && (
              <OrderSupportDialog
                orderNo={order.orderNo}
                copiedOrderNo={copiedOrderNo}
                onCopyOrderNo={handleCopyOrderNo}
                onClose={() => setShowSupportModal(false)}
              />
            )}
          </>
        ) : null}
      </main>

      {reviewingItem && (
        <ReviewFormDialog
          orderItemId={reviewingItem.id}
          productName={reviewingItem.productName}
          onClose={() => setReviewingItem(undefined)}
          onSubmitted={(orderItemId) => {
            setSubmittedReviewItems((current) => new Set(current).add(orderItemId));
            setReviewingItem(undefined);
            triggerToast('Cảm ơn bạn đã gửi đánh giá sản phẩm!');
            // Đánh giá hiển thị ngay sau khi gửi (không còn chờ duyệt) nên phải làm mới cache
            // đánh giá của sản phẩm; đơn hàng không giữ productSlug nên khớp theo mẫu đường dẫn
            // thay vì một query key cụ thể.
            void queryClient.invalidateQueries({
              predicate: (query) => {
                const key = query.queryKey[0];
                return typeof key === 'string' && /^\/api\/v1\/catalog\/products\/[^/]+\/reviews$/.test(key);
              },
            });
          }}
        />
      )}
    </>
  );
}
