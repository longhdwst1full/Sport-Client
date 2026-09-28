'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  Clock3,
  Copy,
  ExternalLink,
  FileText,
  Headphones,
  HelpCircle,
  Info,
  LoaderCircle,
  MapPin,
  MessageCircle,
  MessageSquarePlus,
  Package,
  PackageCheck,
  Phone,
  RotateCcw,
  Share2,
  ShoppingBag,
  Store,
  Truck,
  User,
  X,
  XCircle,
} from 'lucide-react';
import { useCustomerAuth } from '@/features/auth';
import {
  cancelAccountOrder,
  cancelGuestOrder,
  getAccountOrder,
  getGetAccountOrderQueryKey,
  getGetGuestOrderQueryKey,
  getListAccountOrdersQueryKey,
  getGuestOrder,
} from '@/generated/api/orders/orders';
import type { OrderDetailDto } from '@/generated/api/orders/orders.schemas';
import { StorefrontLayout } from '@/layouts/storefront-layout';
import { apiErrorMessage } from '@/lib/api/error-message';
import { PRODUCT_PLACEHOLDER_IMAGE } from '@/shared/constants';
import { toOrderDetailView } from '../model/order.mapper';
import {
  CANCELLABLE_PAYMENT_STATUSES,
  FULFILLMENT_STATUS,
  GUEST_ACCESS_RETIRED_ORDER_STATUSES,
  statusIn,
} from '../model/order.constants';
import { readGuestOrderAccessToken, retireGuestOrderAccessToken } from '../model/guest-order-access.store';
import { OrderReturnCta } from '@/features/returns';
import { ReviewFormDialog } from '@/features/reviews';
import { OrderPaymentPanel } from '../components/order-payment-panel';
import { useAppDispatch } from '@/app/store/hooks';
import { addCartItem } from '@/app/store/cart.slice';

function errorMessage(error: unknown): string {
  return apiErrorMessage(error, 'Không tải được đơn hàng. Vui lòng kiểm tra tài khoản hoặc đường dẫn truy cập.');
}

const CANCEL_REASONS = [
  'Đổi ý không muốn mua nữa',
  'Muốn thay đổi sản phẩm / kích cỡ / màu sắc',
  'Muốn thay đổi địa chỉ hoặc số điện thoại nhận hàng',
  'Tìm được giá hoặc ưu đãi tốt hơn',
  'Đặt trùng lặp đơn hàng',
];

function getOrderStatusBadge(statusCode: string, label: string) {
  switch (statusCode) {
    case 'PENDING_CONFIRMATION':
      return (
        <span className="inline-flex items-center gap-2 rounded-2xl border border-amber-400/40 bg-amber-500/20 px-4 py-2 text-sm font-black text-amber-300 backdrop-blur-md shadow-sm">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex size-2.5 rounded-full bg-amber-400" />
          </span>
          {label}
        </span>
      );
    case 'CONFIRMED':
    case 'PICKING':
    case 'PACKED':
      return (
        <span className="inline-flex items-center gap-2 rounded-2xl border border-blue-400/40 bg-blue-500/25 px-4 py-2 text-sm font-black text-blue-200 backdrop-blur-md shadow-sm">
          <Package className="size-4" />
          {label}
        </span>
      );
    case 'SHIPPED':
      return (
        <span className="inline-flex items-center gap-2 rounded-2xl border border-teal-400/40 bg-teal-500/25 px-4 py-2 text-sm font-black text-teal-200 backdrop-blur-md shadow-sm">
          <Truck className="size-4" />
          {label}
        </span>
      );
    case 'DELIVERED':
    case 'COMPLETED':
      return (
        <span className="inline-flex items-center gap-2 rounded-2xl border border-emerald-400/40 bg-emerald-500/25 px-4 py-2 text-sm font-black text-emerald-300 backdrop-blur-md shadow-sm">
          <CheckCircle2 className="size-4" />
          {label}
        </span>
      );
    case 'CANCELLED':
      return (
        <span className="inline-flex items-center gap-2 rounded-2xl border border-rose-400/40 bg-rose-500/25 px-4 py-2 text-sm font-black text-rose-300 backdrop-blur-md shadow-sm">
          <XCircle className="size-4" />
          {label}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-black text-slate-200 backdrop-blur-md">
          {label}
        </span>
      );
  }
}

function getPaymentStatusBadge(statusCode: string, label: string) {
  switch (statusCode) {
    case 'SUCCESS':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-0.5 text-xs font-bold text-emerald-300">
          <CheckCircle2 className="size-3" /> {label}
        </span>
      );
    case 'FAILED':
    case 'CANCELLED':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/20 border border-rose-400/30 px-2.5 py-0.5 text-xs font-bold text-rose-300">
          <XCircle className="size-3" /> {label}
        </span>
      );
    case 'PENDING':
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 border border-amber-400/30 px-2.5 py-0.5 text-xs font-bold text-amber-300">
          <Clock3 className="size-3" /> {label}
        </span>
      );
  }
}

export function OrderDetailPage({ orderNo }: { orderNo: string }) {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoaded } = useCustomerAuth();
  const queryClient = useQueryClient();
  const [reason, setReason] = useState('');
  const [showCancel, setShowCancel] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [copiedOrderNo, setCopiedOrderNo] = useState(false);
  const [copiedTrackingNo, setCopiedTrackingNo] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showTimeline, setShowTimeline] = useState(false);
  const [reviewingItem, setReviewingItem] = useState<{ id: string; productName: string }>();
  const [submittedReviewItems, setSubmittedReviewItems] = useState<Set<string>>(() => new Set());
  const idempotencyRef = useRef<{ signature: string; key: string } | undefined>(undefined);

  const guestToken = useMemo(
    () => isLoaded && !isAuthenticated ? readGuestOrderAccessToken(orderNo) : null,
    [isAuthenticated, isLoaded, orderNo],
  );

  const orderQuery = useQuery({
    queryKey: isAuthenticated ? getGetAccountOrderQueryKey(orderNo) : getGetGuestOrderQueryKey(orderNo),
    enabled: isLoaded && (isAuthenticated || Boolean(guestToken)),
    retry: false,
    queryFn: ({ signal }) => isAuthenticated
      ? getAccountOrder(orderNo, undefined, signal)
      : getGuestOrder(orderNo, { headers: { 'x-cart-token': guestToken } }, signal),
  });

  const order = orderQuery.data;

  useEffect(() => {
    if (!isAuthenticated && order && statusIn(GUEST_ACCESS_RETIRED_ORDER_STATUSES, order.status)) {
      retireGuestOrderAccessToken(order.orderNo);
    }
  }, [isAuthenticated, order]);

  const cancel = useMutation({
    mutationFn: async (): Promise<OrderDetailDto> => {
      if (!order) throw new Error('Chưa tải được đơn hàng');
      const normalizedReason = reason.trim();
      const signature = `${order.id}:${order.version}:${normalizedReason}`;
      if (idempotencyRef.current?.signature !== signature) {
        idempotencyRef.current = { signature, key: crypto.randomUUID() };
      }
      const headers = { 'idempotency-key': idempotencyRef.current.key };
      return isAuthenticated
        ? cancelAccountOrder(orderNo, { expectedVersion: order.version, reason: normalizedReason }, { headers })
        : cancelGuestOrder(orderNo, { expectedVersion: order.version, reason: normalizedReason }, { headers: { ...headers, 'x-cart-token': guestToken } });
    },
    retry: false,
    onSuccess: async (updated) => {
      const key = isAuthenticated ? getGetAccountOrderQueryKey(orderNo) : getGetGuestOrderQueryKey(orderNo);
      queryClient.setQueryData(key, updated);
      if (isAuthenticated) {
        await queryClient.invalidateQueries({ queryKey: getListAccountOrdersQueryKey() });
      }
      idempotencyRef.current = undefined;
      cancel.reset();
      setShowCancel(false);
      setReason('');
      triggerToast('Đã hủy đơn hàng thành công');
    },
  });

  const view = useMemo(() => (order ? toOrderDetailView(order) : undefined), [order]);

  const canCancel = order?.status === 'PENDING_CONFIRMATION'
    && statusIn(CANCELLABLE_PAYMENT_STATUSES, order.paymentStatus)
    && order.fulfillmentStatus === FULFILLMENT_STATUS.PENDING;

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const closeCancel = () => {
    if (cancel.isPending) return;
    cancel.reset();
    idempotencyRef.current = undefined;
    setReason('');
    setShowCancel(false);
  };

  const handleCopyOrderNo = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedOrderNo(true);
      triggerToast(`Đã sao chép mã đơn #${code}`);
      setTimeout(() => setCopiedOrderNo(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleCopyTrackingNo = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedTrackingNo(true);
      triggerToast(`Đã sao chép mã vận đơn ${code}`);
      setTimeout(() => setCopiedTrackingNo(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleCopyAddress = async () => {
    if (!view) return;
    try {
      const text = `${view.recipientName} - ${view.recipientPhone}\n${view.recipientAddress}`;
      await navigator.clipboard.writeText(text);
      setCopiedAddress(true);
      triggerToast('Đã sao chép thông tin người nhận và địa chỉ');
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleReorderAll = () => {
    if (!order || !order.items.length) return;
    order.items.forEach((item) => {
      dispatch(
        addCartItem({
          productId: item.id,
          variantId: item.id,
          sku: item.sku,
          productType: item.itemType === 'BUNDLE' ? 'BUNDLE' : 'STANDARD',
          name: item.productName,
          imageUrl: item.imageUrl ?? undefined,
          price: Number(item.unitPrice) || 0,
          quantity: item.quantity || 1,
        }),
      );
    });
    triggerToast(`Đã thêm ${order.items.length} sản phẩm vào giỏ hàng!`);
  };

  const handleReorderItem = (item: { id: string; sku: string; productName: string; imageUrl: string | null; quantity: number }, unitPrice: number) => {
    dispatch(
      addCartItem({
        productId: item.id,
        variantId: item.id,
        sku: item.sku,
        productType: 'STANDARD',
        name: item.productName,
        imageUrl: item.imageUrl ?? undefined,
        price: unitPrice,
        quantity: item.quantity || 1,
      }),
    );
    triggerToast(`Đã thêm "${item.productName}" vào giỏ hàng!`);
  };

  return (
    <StorefrontLayout>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-xs font-bold text-white shadow-2xl border border-slate-700 animate-fade-in-up">
          <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="mx-auto min-h-[65vh] max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
        {!isLoaded || orderQuery.isLoading ? (
          <div className="grid min-h-80 place-items-center">
            <div className="flex flex-col items-center gap-3">
              <LoaderCircle className="size-10 animate-spin text-emerald-600" />
              <span className="text-sm font-semibold text-slate-500">Đang tải thông tin đơn hàng...</span>
            </div>
          </div>
        ) : !isAuthenticated && !guestToken ? (
          <section className="mx-auto max-w-xl rounded-3xl border border-amber-200 bg-amber-50/70 p-8 sm:p-10 text-center shadow-card">
            <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-amber-100 text-amber-600">
              <XCircle className="size-9" />
            </div>
            <h1 className="mt-5 text-xl font-black text-slate-900">Không tìm thấy mã truy cập đơn hàng</h1>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-amber-900">
              Hãy mở đơn trên trình duyệt đã dùng để đặt hàng hoặc đăng nhập tài khoản để xem toàn bộ lịch sử đơn.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/login" className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700">
                Đăng nhập
              </Link>
              <Link href="/" className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
                Về trang chủ
              </Link>
            </div>
          </section>
        ) : orderQuery.isError ? (
          <section className="mx-auto max-w-xl rounded-3xl border border-rose-200 bg-rose-50/80 p-8 sm:p-10 text-center shadow-card">
            <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-rose-100 text-rose-600">
              <AlertTriangle className="size-9" />
            </div>
            <h1 className="mt-5 text-xl font-black text-rose-950">Không thể tải thông tin đơn hàng</h1>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-rose-800">
              {errorMessage(orderQuery.error)}
            </p>
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
          </section>
        ) : order ? (
          <>
            {/* Breadcrumb Navigation Bar */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <Link href="/" className="hover:text-emerald-700 transition">Trang chủ</Link>
                <ChevronRight className="size-3 text-slate-400" />
                {isAuthenticated ? (
                  <>
                    <Link href="/orders" className="hover:text-emerald-700 transition">Đơn hàng của tôi</Link>
                    <ChevronRight className="size-3 text-slate-400" />
                  </>
                ) : null}
                <span className="text-slate-600">Chi tiết đơn hàng</span>
                <ChevronRight className="size-3 text-slate-400" />
                <span className="font-mono font-bold text-slate-900">{order.orderNo}</span>
              </nav>

              <div className="flex items-center gap-2">
                {isAuthenticated && (
                  <Link
                    href="/orders"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700"
                  >
                    <ArrowLeft className="size-3.5" /> Danh sách đơn
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => setShowSupportModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/70 px-3.5 py-1.5 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100"
                >
                  <Headphones className="size-3.5 text-emerald-600" /> Cần hỗ trợ?
                </button>
              </div>
            </div>

            {/* Hero Order Status Header (P0 - Trạng thái nổi bật nhất) */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-6 sm:p-8 text-white shadow-xl">
              <div className="pointer-events-none absolute -right-16 -top-16 size-80 rounded-full bg-emerald-500/15 blur-3xl" />
              <div className="pointer-events-none absolute -left-16 -bottom-16 size-64 rounded-full bg-teal-600/10 blur-2xl" />

              <div className="relative flex flex-col md:flex-row md:items-start justify-between gap-5">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-300 border border-emerald-500/25">
                      <span className="size-1.5 rounded-full bg-emerald-400" />
                      Đơn hàng trực tuyến
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm sm:text-base font-extrabold text-slate-300">
                        #{order.orderNo}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyOrderNo(order.orderNo)}
                        className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2 py-0.5 text-xs font-medium text-slate-300 hover:bg-white/20 hover:text-white transition"
                        title="Sao chép mã đơn"
                      >
                        {copiedOrderNo ? (
                          <>
                            <Check className="size-3 text-emerald-400" />
                            <span className="text-emerald-300 font-bold">Đã chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="size-3" />
                            <span>Chép mã</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Status Banner Title & Description (P0) */}
                  <div className="mt-4">
                    <div className="flex flex-wrap items-center gap-3">
                      {view && getOrderStatusBadge(view.statusCode, view.statusLabel)}
                    </div>
                    <p className="mt-2.5 text-sm sm:text-base font-medium leading-relaxed text-slate-200 max-w-2xl">
                      {view?.statusDescription}
                    </p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-medium">
                      <span className="inline-flex items-center gap-1.5 text-emerald-300/90 font-semibold">
                        <Clock className="size-3.5 text-emerald-400" /> Cập nhật lần cuối: {view?.lastUpdatedLabel}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-slate-300">
                        <Calendar className="size-3.5 text-slate-400" /> Đặt lúc: {view?.placedLabel}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-slate-300">
                        <Store className="size-3.5 text-slate-400" /> Xuất phát từ: {view?.branchName}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metric Grid (3 cards) */}
              <div className="relative mt-7 grid gap-3.5 sm:grid-cols-3 pt-6 border-t border-white/10">
                <div className="rounded-2xl bg-white/[0.06] p-4 backdrop-blur-sm border border-white/[0.08]">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Người nhận hàng</span>
                  <strong className="mt-1 block truncate text-sm font-bold text-white">{view?.recipientName}</strong>
                  <span className="mt-0.5 block text-xs text-slate-300 font-mono">{view?.recipientPhone}</span>
                  <span className="mt-1 block truncate text-[11px] text-slate-400">{view?.recipientAddress}</span>
                </div>

                <div className="rounded-2xl bg-white/[0.06] p-4 backdrop-blur-sm border border-white/[0.08]">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Phương thức thanh toán</span>
                  <strong className="mt-1 block text-sm font-bold text-white">{view?.paymentMethodLabel}</strong>
                  <div className="mt-1.5 flex items-center gap-2">
                    {view && getPaymentStatusBadge(view.paymentStatusCode, view.paymentStatusLabel)}
                  </div>
                  <span className="mt-1 block text-[11px] text-slate-300">
                    {view?.paymentMethodCode === 'COD'
                      ? 'Thanh toán tiền mặt khi nhận hàng'
                      : view?.paymentStatusCode === 'SUCCESS'
                      ? 'Đã thanh toán đủ'
                      : 'Chờ hoàn tất thanh toán'}
                  </span>
                </div>

                <div className="rounded-2xl bg-white/[0.06] p-4 backdrop-blur-sm border border-white/[0.08]">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Tổng thanh toán</span>
                  <strong className="mt-1 block text-2xl font-black text-emerald-400 tracking-tight">
                    {view?.grandTotalLabel}
                  </strong>
                  <div className="mt-0.5 flex items-center justify-between text-[11px] text-emerald-300/80">
                    <span>{view?.itemCount} món sản phẩm</span>
                    {view?.paymentMethodCode === 'COD' && (
                      <span className="font-semibold text-amber-300">(Trả khi nhận)</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Milestones Progress Timeline & Shipping Info (P0 & P1) */}
            <section className="mt-6 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-card transition-shadow hover:shadow-card-hover">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="grid size-9 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
                    <Truck className="size-4.5" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-900">Tiến trình giao hàng</h2>
                    <p className="text-xs text-slate-500">Quy trình xử lý đóng gói và vận chuyển đơn hàng đến tay bạn</p>
                  </div>
                </div>

                {view?.shipment?.trackingNo && (
                  <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-1.5 border border-slate-200/80">
                    <span className="text-[11px] font-semibold text-slate-500">Mã vận đơn:</span>
                    <span className="font-mono text-xs font-black text-slate-900">{view.shipment.trackingNo}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyTrackingNo(view.shipment?.trackingNo ?? '')}
                      className="rounded p-1 text-slate-400 hover:text-slate-700 transition"
                      title="Sao chép mã vận đơn"
                    >
                      {copiedTrackingNo ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                    </button>
                  </div>
                )}
              </div>

              {/* Desktop / Tablet Horizontal Stepper (sm: and above) */}
              <div className="hidden sm:block mt-7 mb-4">
                <div className="grid grid-cols-5 gap-2 relative">
                  {(view?.milestones ?? []).map((milestone, index, list) => {
                    const isDone = milestone.state === 'done';
                    const isCurrent = milestone.state === 'current';
                    const isFailed = milestone.state === 'failed';

                    return (
                      <div key={milestone.key} className="relative flex flex-col items-center text-center px-1">
                        {/* Connecting line to the next step */}
                        {index < list.length - 1 && (
                          <div
                            className={`absolute top-4 left-1/2 w-full h-1 -translate-y-1/2 z-0 ${
                              isDone
                                ? 'bg-emerald-500'
                                : isCurrent
                                ? 'bg-gradient-to-r from-emerald-500 to-slate-200'
                                : 'bg-slate-200'
                            }`}
                          />
                        )}

                        {/* Node Circle */}
                        <div className="relative z-10 grid size-9 place-items-center rounded-full bg-white">
                          {isDone ? (
                            <span className="grid size-9 place-items-center rounded-full bg-emerald-600 text-white shadow-sm ring-4 ring-emerald-50">
                              <Check className="size-4 stroke-[3]" />
                            </span>
                          ) : isCurrent ? (
                            <span className="relative flex size-9 items-center justify-center">
                              <span className="absolute size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                              <span className="relative grid size-9 place-items-center rounded-full border-2 border-emerald-600 bg-white text-emerald-600 shadow-sm ring-4 ring-emerald-50">
                                <span className="size-3 rounded-full bg-emerald-600" />
                              </span>
                            </span>
                          ) : isFailed ? (
                            <span className="grid size-9 place-items-center rounded-full bg-rose-600 text-white shadow-sm ring-4 ring-rose-50">
                              <X className="size-4 stroke-[3]" />
                            </span>
                          ) : (
                            <span className="grid size-9 place-items-center rounded-full border-2 border-slate-200 bg-white text-slate-300 ring-4 ring-slate-50">
                              <span className="size-2.5 rounded-full bg-slate-200" />
                            </span>
                          )}
                        </div>

                        {/* Step Label, Subtitle & Date */}
                        <div className="mt-3 w-full">
                          {isCurrent && (
                            <span className="mb-1 inline-block rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-800">
                              Hiện tại
                            </span>
                          )}
                          <strong
                            className={`block text-xs leading-snug ${
                              isCurrent
                                ? 'font-black text-emerald-800 text-sm'
                                : isDone
                                ? 'font-bold text-slate-900'
                                : isFailed
                                ? 'font-bold text-rose-700'
                                : 'font-medium text-slate-400'
                            }`}
                          >
                            {milestone.label}
                          </strong>
                          {milestone.subLabel && (
                            <span className="block mt-0.5 text-[11px] text-slate-500 leading-tight">
                              {milestone.subLabel}
                            </span>
                          )}
                          {milestone.occurredLabel && (
                            <p className="mt-1 text-[11px] font-medium text-slate-400">
                              {milestone.occurredLabel}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Vertical Stepper (< sm) */}
              <div className="block sm:hidden mt-5">
                <ol className="space-y-0">
                  {(view?.milestones ?? []).map((milestone, index, list) => {
                    const isDone = milestone.state === 'done';
                    const isCurrent = milestone.state === 'current';
                    const isFailed = milestone.state === 'failed';

                    return (
                      <li key={milestone.key} className="relative flex gap-3.5 pb-6 last:pb-0">
                        {index < list.length - 1 && (
                          <span
                            aria-hidden
                            className={`absolute left-[13px] top-6 h-[calc(100%-1rem)] w-0.5 ${
                              isDone ? 'bg-emerald-500' : 'bg-slate-200'
                            }`}
                          />
                        )}
                        <span className="relative grid size-7 shrink-0 place-items-center rounded-full">
                          {isDone ? (
                            <span className="grid size-7 place-items-center rounded-full bg-emerald-600 text-white shadow-sm">
                              <Check className="size-4 stroke-[2.5]" />
                            </span>
                          ) : isCurrent ? (
                            <span className="relative flex size-7 items-center justify-center">
                              <span className="absolute size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                              <span className="relative grid size-7 place-items-center rounded-full border-2 border-emerald-600 bg-white text-emerald-600 shadow-sm">
                                <span className="size-2.5 rounded-full bg-emerald-600" />
                              </span>
                            </span>
                          ) : isFailed ? (
                            <span className="grid size-7 place-items-center rounded-full bg-rose-600 text-white shadow-sm">
                              <X className="size-4 stroke-[2.5]" />
                            </span>
                          ) : (
                            <span className="grid size-7 place-items-center rounded-full border-2 border-slate-200 bg-white text-slate-300">
                              <span className="size-2 rounded-full bg-slate-200" />
                            </span>
                          )}
                        </span>

                        <div className="min-w-0 pt-0.5">
                          <div className="flex items-center gap-2">
                            <strong
                              className={`text-sm ${
                                isCurrent
                                  ? 'font-black text-emerald-800'
                                  : isDone
                                  ? 'font-bold text-slate-900'
                                  : isFailed
                                  ? 'font-bold text-rose-700'
                                  : 'font-medium text-slate-400'
                              }`}
                            >
                              {milestone.label}
                            </strong>
                            {isCurrent && (
                              <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-emerald-800">
                                Hiện tại
                              </span>
                            )}
                          </div>
                          {milestone.subLabel && (
                            <p className="text-xs text-slate-500 mt-0.5">{milestone.subLabel}</p>
                          )}
                          {milestone.occurredLabel && (
                            <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
                              <Clock className="size-3 text-slate-400" />
                              {milestone.occurredLabel}
                            </p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>

              {/* Dedicated Shipping Information Block (Vấn đề 2 - P0) */}
              <div className="mt-6 rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 sm:p-5">
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                  <div className="flex items-center gap-2">
                    <Truck className="size-4 text-emerald-600" />
                    <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                      Thông tin vận chuyển thực tế
                    </span>
                  </div>
                  {view?.shipment?.trackingUrl && (
                    <a
                      href={view.shipment.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline"
                    >
                      <span>Tra cứu trên hệ thống hãng</span>
                      <ExternalLink className="size-3" />
                    </a>
                  )}
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-xl bg-white p-3 border border-slate-200/80 shadow-xs">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase">Đơn vị vận chuyển</span>
                    <strong className="mt-1 block text-sm font-bold text-slate-900">
                      {view?.shipment?.carrierLabel || 'Chưa phân bổ'}
                    </strong>
                    <span className="mt-0.5 block text-[11px] text-slate-500">Đối tác giao nhận tiêu chuẩn</span>
                  </div>

                  <div className="rounded-xl bg-white p-3 border border-slate-200/80 shadow-xs">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase">Mã vận đơn</span>
                    {view?.shipment?.trackingNo ? (
                      <div className="mt-1 flex items-center gap-1.5">
                        <strong className="font-mono text-sm font-black text-slate-900">
                          {view.shipment.trackingNo}
                        </strong>
                        <button
                          type="button"
                          onClick={() => handleCopyTrackingNo(view.shipment?.trackingNo ?? '')}
                          className="rounded p-1 text-slate-400 hover:text-slate-700 transition"
                          title="Sao chép"
                        >
                          {copiedTrackingNo ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                        </button>
                      </div>
                    ) : (
                      <strong className="mt-1 block text-sm font-semibold text-slate-500">Chưa có mã vận đơn</strong>
                    )}
                    <span className="mt-0.5 block text-[11px] text-slate-500">
                      {view?.shipment?.hasTracking ? 'Đã tạo vận đơn điện tử' : 'Đang chuẩn bị bàn giao'}
                    </span>
                  </div>

                  <div className="rounded-xl bg-white p-3 border border-slate-200/80 shadow-xs">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase">Dự kiến giao hàng</span>
                    <strong className="mt-1 block text-sm font-bold text-emerald-700">
                      {view?.shipment?.estimatedDeliveryLabel}
                    </strong>
                    <span className="mt-0.5 block text-[11px] text-slate-500">Trong giờ hành chính</span>
                  </div>

                  <div className="rounded-xl bg-white p-3 border border-slate-200/80 shadow-xs">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase">Tình trạng bưu kiện</span>
                    <strong className="mt-1 block text-sm font-bold text-slate-900 truncate">
                      {view?.shipment?.statusText}
                    </strong>
                    <span className="mt-0.5 block text-[11px] text-slate-500 truncate">
                      Kho xuất: {view?.warehouseName}
                    </span>
                  </div>
                </div>

                {/* Tracking & Timeline Toggle */}
                <div className="mt-4 pt-3 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                  {view?.shipment?.trackingUrl ? (
                    <a
                      href={view.shipment.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 font-bold text-white shadow-sm transition hover:bg-emerald-700"
                    >
                      <Truck className="size-3.5" /> Theo dõi lộ trình trực tiếp <ExternalLink className="size-3" />
                    </a>
                  ) : (
                    <span className="text-slate-500 text-xs">
                      {view?.shipment?.hasTracking
                        ? `Vận đơn ${view.shipment.trackingNo} đang được phân bổ tới bưu tá phát.`
                        : 'Đơn hàng đang trong quy trình đóng gói tại kho và chuẩn bị bàn giao cho bưu cục.'}
                    </span>
                  )}

                  {(view?.timeline ?? []).length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowTimeline(!showTimeline)}
                      className="inline-flex items-center gap-1.5 font-bold text-slate-700 hover:text-emerald-700 transition ml-auto"
                    >
                      <PackageCheck className="size-3.5 text-emerald-600" />
                      Lịch sử cập nhật chi tiết ({view?.timeline.length})
                      {showTimeline ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                    </button>
                  )}
                </div>

                {/* Collapsible status history */}
                {showTimeline && (view?.timeline ?? []).length > 0 && (
                  <div className="mt-3 space-y-2 rounded-2xl bg-white p-4 border border-slate-200/80 animate-fade-in text-xs">
                    {(view?.timeline ?? []).map((entry) => (
                      <div key={entry.key} className="flex items-start justify-between gap-3 border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                        <div>
                          <span className="font-bold text-slate-900">{entry.statusLabel}</span>
                          {entry.note && <p className="mt-0.5 text-slate-600">{entry.note}</p>}
                        </div>
                        <span className="shrink-0 text-[11px] text-slate-400 font-mono">{entry.occurredLabel}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Main Content Two Columns */}
            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] items-start">
              {/* Left Column: Products & Bill Summary */}
              <div className="space-y-6">
                {/* Product List Card */}
                <section className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-card transition-shadow hover:shadow-card-hover">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="grid size-9 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
                        <ShoppingBag className="size-4.5" />
                      </div>
                      <div>
                        <h2 className="text-base font-black text-slate-900">Danh sách sản phẩm</h2>
                        <p className="text-xs text-slate-500">Sản phẩm thuộc đơn hàng #{order.orderNo}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                      {view?.items.length} món
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {(view?.items ?? []).map((item) => (
                      <div key={item.id} className="flex gap-4 py-5 items-center">
                        <div className="relative size-18 sm:size-20 shrink-0 overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-50">
                          <Image
                            src={item.imageUrl || PRODUCT_PLACEHOLDER_IMAGE}
                            alt={item.productName}
                            fill
                            sizes="80px"
                            className="object-contain p-1.5"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-2">
                            {item.productName}
                          </h3>
                          <div className="mt-1.5 flex flex-wrap items-center gap-2">
                            {item.variantName && (
                              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                                {item.variantName}
                              </span>
                            )}
                            <span className="font-mono text-xs text-slate-400">SKU: {item.sku}</span>
                          </div>
                          <p className="mt-1.5 text-xs text-slate-600 font-medium">
                            {item.unitPriceLabel} × {item.quantity}
                          </p>
                        </div>
                        <div className="text-right flex flex-col items-end">
                          <strong className="block text-sm sm:text-base font-black text-slate-900">
                            {item.lineTotalLabel}
                          </strong>

                          <div className="mt-2 flex flex-wrap justify-end gap-1.5">
                            {isAuthenticated && order.status === 'COMPLETED' && (
                              submittedReviewItems.has(item.id) ? (
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                                  <CheckCircle2 className="size-3.5" /> Đã gửi đánh giá
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setReviewingItem({ id: item.id, productName: item.productName })}
                                  className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 px-2.5 py-1 text-xs font-bold text-emerald-700 transition hover:bg-emerald-50"
                                >
                                  <MessageSquarePlus className="size-3" /> Đánh giá
                                </button>
                              )
                            )}

                            {order.status === 'COMPLETED' && (
                              <button
                                type="button"
                                onClick={() => handleReorderItem(item, Number(order.items.find((i) => i.id === item.id)?.unitPrice) || 0)}
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                                title="Thêm vào giỏ hàng để mua lại"
                              >
                                <RotateCcw className="size-3" /> Mua lại
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bill Breakdown Summary (P0 & P1) */}
                  <div className="mt-5 space-y-3 rounded-2xl bg-slate-50/80 p-4 sm:p-5 border border-slate-100 text-sm">
                    <div className="flex justify-between text-slate-600">
                      <span>Tiền hàng (tạm tính)</span>
                      <span className="font-semibold text-slate-900">{view?.subtotalLabel}</span>
                    </div>
                    {view?.hasDiscount && (
                      <div className="flex justify-between text-emerald-700">
                        <span>Chiết khấu / Khuyến mãi</span>
                        <span className="font-semibold">- {view.discountTotalLabel}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-600">
                      <span>Phí vận chuyển</span>
                      <span className="font-semibold text-slate-900">
                        {view?.shippingTotalLabel === '0 ₫' ? 'Miễn phí' : view?.shippingTotalLabel}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between border-t border-slate-200/80 pt-3 text-base">
                      <span className="font-black text-slate-900">Tổng thanh toán</span>
                      <span className="text-xl sm:text-2xl font-black text-emerald-700">
                        {view?.grandTotalLabel}
                      </span>
                    </div>

                    {/* Contextual payment instruction note */}
                    <div className="mt-2 rounded-xl p-3 text-xs leading-relaxed border">
                      {view?.paymentMethodCode === 'COD' ? (
                        <div className="flex items-start gap-2 text-emerald-900 bg-emerald-50/90 border-emerald-200/80 rounded-lg p-2.5">
                          <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <strong>Hình thức thanh toán khi nhận hàng (COD):</strong>
                            <p className="mt-0.5 text-slate-700">
                              Quý khách vui lòng chuẩn bị đúng số tiền <strong className="text-emerald-800">{view?.grandTotalLabel}</strong> tiền mặt để thanh toán cho bưu tá khi nhận kiện hàng.
                            </p>
                          </div>
                        </div>
                      ) : view?.paymentStatusCode === 'SUCCESS' ? (
                        <div className="flex items-start gap-2 text-emerald-900 bg-emerald-50/90 border-emerald-200/80 rounded-lg p-2.5">
                          <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <strong>Đã thanh toán thành công:</strong>
                            <p className="mt-0.5 text-slate-700">
                              Đơn hàng đã được thanh toán đủ số tiền <strong className="text-emerald-800">{view?.grandTotalLabel}</strong>. Quý khách không cần trả thêm bất kỳ khoản phí nào khi nhận kiện hàng.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-2 text-amber-900 bg-amber-50/90 border-amber-200/80 rounded-lg p-2.5">
                          <Clock3 className="size-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <strong>Chờ thanh toán:</strong>
                            <p className="mt-0.5 text-slate-700">
                              Đơn hàng đang chờ thanh toán qua cổng {view?.paymentMethodLabel}. Vui lòng hoàn tất thanh toán để đơn được xử lý và xuất kho nhanh nhất.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-400 text-right">
                      (Đã bao gồm thuế GTGT/VAT nếu có)
                    </p>
                  </div>

                  {view?.customerNote && (
                    <div className="mt-4 flex items-start gap-2.5 rounded-2xl bg-amber-50/80 p-3.5 border border-amber-200/60 text-xs text-amber-900">
                      <FileText className="size-4 shrink-0 text-amber-600 mt-0.5" />
                      <div>
                        <strong className="block font-bold">Ghi chú đơn hàng từ bạn:</strong>
                        <p className="mt-0.5 leading-relaxed">{view.customerNote}</p>
                      </div>
                    </div>
                  )}
                </section>

                {/* Actions Bar (P1 - Vấn đề 4) */}
                <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-card">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-2.5">
                      <Link
                        href="/products"
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
                      >
                        <ShoppingBag className="size-3.5" /> Tiếp tục mua sắm
                      </Link>

                      {order.status === 'COMPLETED' && (
                        <button
                          type="button"
                          onClick={handleReorderAll}
                          className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100"
                        >
                          <RotateCcw className="size-3.5 text-emerald-600" /> Mua lại cả đơn
                        </button>
                      )}

                      {isAuthenticated && (
                        <Link
                          href="/orders"
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
                        >
                          <ArrowLeft className="size-3.5" /> Danh sách đơn
                        </Link>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {canCancel ? (
                        <button
                          type="button"
                          onClick={() => setShowCancel(true)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/70 px-4 py-2.5 text-xs font-bold text-rose-700 transition hover:bg-rose-100 hover:border-rose-300"
                        >
                          <X className="size-3.5" /> Hủy đơn hàng
                        </button>
                      ) : order.status !== 'CANCELLED' ? (
                        <button
                          type="button"
                          onClick={() => setShowSupportModal(true)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
                        >
                          <Headphones className="size-3.5 text-emerald-600" /> Cần hỗ trợ về đơn này?
                        </button>
                      ) : null}
                    </div>
                  </div>

                  {canCancel && (
                    <p className="mt-3 text-[11px] text-slate-500">
                      * Đơn hàng đang ở trạng thái chờ xác nhận. Bạn có thể tự thao tác hủy đơn trực tiếp trên website trước khi đơn được tiếp nhận tại kho.
                    </p>
                  )}
                </div>
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

                {/* Delivery Address Card (P1 - Vấn đề 6) */}
                <section className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-card transition-shadow hover:shadow-card-hover">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="grid size-9 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
                        <MapPin className="size-4.5" />
                      </div>
                      <div>
                        <h2 className="text-base font-black text-slate-900">Địa chỉ giao hàng</h2>
                        <p className="text-xs text-slate-500">Thông tin nhận kiện hàng</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyAddress}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
                      title="Sao chép toàn bộ thông tin người nhận"
                    >
                      {copiedAddress ? (
                        <>
                          <Check className="size-3 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">Đã chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-3" />
                          <span>Chép địa chỉ</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="mt-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm sm:text-base">
                        <User className="size-4 text-emerald-600" />
                        <span>{view?.recipientName}</span>
                      </div>
                      <span className="text-slate-300">|</span>
                      <a
                        href={`tel:${view?.recipientPhone}`}
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:underline"
                        title="Bấm để gọi"
                      >
                        <Phone className="size-3.5" />
                        {view?.recipientPhone}
                      </a>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-slate-700 font-normal">
                      {view?.recipientAddress}
                    </p>

                    <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 border border-slate-100">
                      <Store className="size-4 text-emerald-600 shrink-0" />
                      <span>
                        Chuẩn bị và xuất phát từ: <strong className="text-slate-900">{view?.branchName}</strong>
                      </span>
                    </div>
                  </div>
                </section>

                {/* Quick Support Card (P1 - Vấn đề 5) */}
                <section className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/40 p-6 shadow-card">
                  <div className="flex items-center gap-2.5 border-b border-emerald-100 pb-3">
                    <div className="grid size-9 place-items-center rounded-2xl bg-emerald-600 text-white shadow-sm">
                      <Headphones className="size-4.5" />
                    </div>
                    <div>
                      <h2 className="text-sm font-black text-slate-900">Bạn cần hỗ trợ về đơn hàng?</h2>
                      <p className="text-[11px] text-slate-500">Đội ngũ Bảo An Sport sẵn sàng phục vụ 8h00 - 22h00</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2.5">
                    <a
                      href="tel:0862576222"
                      className="flex items-center justify-between rounded-xl border border-emerald-200/80 bg-white p-3 text-xs font-bold text-slate-800 transition hover:bg-emerald-50/50"
                    >
                      <div className="flex items-center gap-2">
                        <Phone className="size-4 text-emerald-600" />
                        <span>Hotline tổng đài (miễn phí)</span>
                      </div>
                      <span className="font-mono text-emerald-700 font-black">0862 576 222</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => setShowSupportModal(true)}
                      className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-xs font-bold text-slate-800 transition hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-2">
                        <MessageCircle className="size-4 text-blue-600" />
                        <span>Chat tư vấn trực tuyến</span>
                      </div>
                      <span className="text-[11px] text-slate-400">Đính kèm #{order.orderNo} →</span>
                    </button>
                  </div>

                  <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
                    * Mẹo: Khi liên hệ hỗ trợ, mã đơn <strong className="font-mono text-slate-800">#{order.orderNo}</strong> sẽ giúp nhân viên tra cứu nhanh nhất.
                  </p>
                </section>
              </aside>
            </div>

            {/* Cancel Order Modal Dialog (P1 - Vấn đề 4) */}
            {showCancel && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
                <div className="relative w-full max-w-lg rounded-3xl border border-slate-100 bg-white p-6 sm:p-7 shadow-2xl animate-fade-in-up">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="grid size-11 place-items-center rounded-2xl bg-rose-100 text-rose-600">
                        <AlertTriangle className="size-5.5" />
                      </div>
                      <div>
                        <h2 className="text-base font-black text-slate-900">Xác nhận hủy đơn hàng</h2>
                        <p className="font-mono text-xs text-slate-500">#{order.orderNo}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={closeCancel}
                      disabled={cancel.isPending}
                      className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                    >
                      <X className="size-5" />
                    </button>
                  </div>

                  <div className="mt-4 rounded-2xl bg-rose-50/80 p-3.5 border border-rose-100 text-xs leading-relaxed text-rose-900">
                    <strong className="block font-bold">Lưu ý quan trọng:</strong>
                    Sau khi hủy, hệ thống sẽ tự động giải phóng toàn bộ sản phẩm đang giữ chỗ cho bạn. Nếu đơn đã thanh toán online, nhân viên sẽ liên hệ để hoàn tiền theo chính sách. Thao tác hủy không thể hoàn tác.
                  </div>

                  <div className="mt-4">
                    <label className="block text-xs font-bold text-slate-800">
                      Chọn lý do hủy nhanh:
                    </label>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {CANCEL_REASONS.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setReason(preset)}
                          className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition ${
                            reason === preset
                              ? 'bg-rose-600 text-white font-bold'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label htmlFor="customer-cancel-reason" className="block text-xs font-bold text-slate-800">
                      Chi tiết lý do hủy đơn <span className="text-rose-600">*</span>
                    </label>
                    <textarea
                      id="customer-cancel-reason"
                      value={reason}
                      onChange={(event) => setReason(event.target.value)}
                      maxLength={500}
                      rows={3}
                      placeholder="Vui lòng cho Bảo An Sport biết lý do bạn muốn hủy đơn (tối thiểu 3 ký tự)..."
                      className="mt-1.5 w-full rounded-2xl border border-slate-200 p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400"
                    />
                    <div className="mt-1 flex justify-between text-[11px] text-slate-400">
                      <span>Tối thiểu 3 ký tự</span>
                      <span>{reason.trim().length}/500</span>
                    </div>
                  </div>

                  {cancel.isError && (
                    <p className="mt-2 text-xs font-semibold text-rose-700">
                      {errorMessage(cancel.error)}
                    </p>
                  )}

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      disabled={cancel.isPending}
                      onClick={closeCancel}
                      className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                      Đóng
                    </button>
                    <button
                      type="button"
                      disabled={cancel.isPending || reason.trim().length < 3}
                      onClick={() => cancel.mutate()}
                      className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-50"
                    >
                      {cancel.isPending ? <LoaderCircle className="size-4 animate-spin" /> : <X className="size-4" />}
                      {cancel.isPending ? 'Đang hủy...' : 'Xác nhận hủy đơn'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Contextual Support Modal Dialog (P1 - Vấn đề 4) */}
            {showSupportModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
                <div className="relative w-full max-w-md rounded-3xl border border-slate-100 bg-white p-6 sm:p-7 shadow-2xl animate-fade-in-up">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="grid size-11 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
                        <Headphones className="size-5.5" />
                      </div>
                      <div>
                        <h2 className="text-base font-black text-slate-900">Hỗ trợ đơn hàng #{order.orderNo}</h2>
                        <p className="text-xs text-slate-500">Bảo An Sport Support Center</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowSupportModal(false)}
                      className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                    >
                      <X className="size-5" />
                    </button>
                  </div>

                  <p className="mt-4 text-xs leading-relaxed text-slate-600">
                    Nếu bạn muốn thay đổi thông tin người nhận, điều chỉnh sản phẩm, kiểm tra tiến độ giao hàng hoặc yêu cầu hỗ trợ đặc biệt, hãy chọn một trong các kênh dưới đây:
                  </p>

                  <div className="mt-4 space-y-2.5">
                    <a
                      href="tel:0862576222"
                      className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3.5 text-xs font-bold text-emerald-950 hover:bg-emerald-100 transition"
                    >
                      <div className="flex items-center gap-2.5">
                        <Phone className="size-4 text-emerald-700" />
                        <div>
                          <strong className="block text-sm">Gọi tổng đài ngay</strong>
                          <span className="text-[11px] font-normal text-slate-600">Hỗ trợ tức thì (8:00 - 22:00)</span>
                        </div>
                      </div>
                      <span className="font-mono text-sm font-black text-emerald-700">0862 576 222</span>
                    </a>

                    <a
                      href={`mailto:support@baoansport.vn?subject=${encodeURIComponent(`[Hỗ trợ đơn hàng] ${order.orderNo}`)}`}
                      className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs font-bold text-slate-800 hover:bg-slate-100 transition"
                    >
                      <div className="flex items-center gap-2.5">
                        <MessageCircle className="size-4 text-blue-600" />
                        <div>
                          <strong className="block text-sm">Gửi email hỗ trợ</strong>
                          <span className="text-[11px] font-normal text-slate-500">support@baoansport.vn</span>
                        </div>
                      </div>
                      <span className="text-slate-400">Gửi mail →</span>
                    </a>
                  </div>

                  <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 border border-slate-200/70 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Mã đơn hàng cần đọc khi gọi</span>
                      <strong className="font-mono text-sm font-black text-slate-900">#{order.orderNo}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyOrderNo(order.orderNo)}
                      className="rounded-lg bg-white border border-slate-200 px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                    >
                      {copiedOrderNo ? 'Đã sao chép' : 'Sao chép'}
                    </button>
                  </div>

                  <div className="mt-5 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowSupportModal(false)}
                      className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
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
    </StorefrontLayout>
  );
}
