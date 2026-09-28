'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, XCircle } from 'lucide-react';
import { Spinner, ErrorState } from '@/foundation/components/feedback';
import {
  getGetAccountOrderQueryKey,
  getGetGuestOrderQueryKey,
  getListAccountOrdersQueryKey,
} from '@/generated/api/orders/orders';
import { OrderReturnCta } from '@/features/returns';
import { ReviewFormDialog } from '@/features/reviews';
import { OrderPaymentPanel } from '../components/order-payment-panel';
import { OrderActionsBar } from '../components/order-detail/order-actions-bar';
import { OrderCancelDialog } from '../components/order-detail/order-cancel-dialog';
import { OrderDeliveryAddressCard } from '../components/order-detail/order-delivery-address-card';
import { OrderDetailHeader } from '../components/order-detail/order-detail-header';
import { OrderDetailToast } from '../components/order-detail/order-detail-toast';
import { OrderProductsCard } from '../components/order-detail/order-products-card';
import { OrderShipmentSection } from '../components/order-detail/order-shipment-section';
import { OrderStatusHero } from '../components/order-detail/order-status-hero';
import { OrderSupportCard } from '../components/order-detail/order-support-card';
import { OrderSupportDialog } from '../components/order-detail/order-support-dialog';
import { useCancelOrder } from '../hooks/use-cancel-order';
import { useOrderCopy } from '../hooks/use-order-copy';
import { useOrderDetail } from '../hooks/use-order-detail';
import { useOrderDetailToast } from '../hooks/use-order-detail-toast';
import { useReorder } from '../hooks/use-reorder';
import { errorMessage } from '../model/order-detail-error';

export function OrderDetailPage({ orderNo }: { orderNo: string }) {
  // Hook tải đơn gọi trước hook hủy đơn: effect thu hồi mã truy cập vãng lai giữ nguyên thứ tự chạy cũ.
  const { isAuthenticated, isLoaded, guestToken, orderQuery, order, view, canCancel } = useOrderDetail(orderNo);
  const queryClient = useQueryClient();
  const { toastMessage, triggerToast } = useOrderDetailToast();
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
      {toastMessage && (
        <OrderDetailToast message={toastMessage} />
      )}

      <main className="mx-auto min-h-[65vh] max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
        {!isLoaded || orderQuery.isLoading ? (
          <div className="grid min-h-80 place-items-center">
            <div className="flex flex-col items-center gap-3">
              <Spinner className="size-10 animate-spin text-emerald-600" />
              <span className="text-sm font-semibold text-slate-500">Đang tải thông tin đơn hàng...</span>
            </div>
          </div>
        ) : !isAuthenticated && !guestToken ? (
          <ErrorState
            className="mx-auto max-w-xl rounded-3xl border border-amber-200 bg-amber-50/70 p-8 sm:p-10 text-center shadow-card"
            iconWrapClassName="mx-auto grid size-16 place-items-center rounded-2xl bg-amber-100 text-amber-600"
            icon={<XCircle className="size-9" />}
            titleClassName="mt-5 text-xl font-black text-slate-900"
            title="Không tìm thấy mã truy cập đơn hàng"
            descriptionClassName="mx-auto mt-2 max-w-md text-sm leading-relaxed text-amber-900"
            description="Hãy mở đơn trên trình duyệt đã dùng để đặt hàng hoặc đăng nhập tài khoản để xem toàn bộ lịch sử đơn."
            actions={
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link href="/login" className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700">
                  Đăng nhập
                </Link>
                <Link href="/" className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
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
            description={errorMessage(orderQuery.error)}
            actions={
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => orderQuery.refetch()}
                  className="rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-rose-700"
                >
                  Thử lại
                </button>
                <Link href="/" className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
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
                  onOpenSupport={() => setShowSupportModal(true)}
                />
              </div>

              {/* Right Aside Column: Payment Panel, Address & Contextual Support */}
              <aside className="space-y-6">
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
          }}
        />
      )}
    </>
  );
}
