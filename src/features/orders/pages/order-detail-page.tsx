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
  LoaderCircle,
  MapPin,
  Package,
  PackageCheck,
  Phone,
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
import { ApiError } from '@/lib/api/fetcher';
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
import { OrderPaymentPanel } from '../components/order-payment-panel';

function errorMessage(error: unknown): string {
  if (error instanceof ApiError && error.payload && typeof error.payload === 'object' && 'message' in error.payload) {
    const value = (error.payload as { message?: unknown }).message;
    if (typeof value === 'string') return value;
  }
  return 'Không tải được đơn hàng. Vui lòng kiểm tra tài khoản hoặc đường dẫn truy cập.';
}

function getOrderStatusBadge(statusCode: string, label: string) {
  switch (statusCode) {
    case 'PENDING_CONFIRMATION':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/20 px-3.5 py-1.5 text-xs font-bold text-amber-300 backdrop-blur-md">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-amber-400" />
          </span>
          {label}
        </span>
      );
    case 'CONFIRMED':
    case 'PICKING':
    case 'PACKED':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/20 px-3.5 py-1.5 text-xs font-bold text-blue-300 backdrop-blur-md">
          <Package className="size-3.5" />
          {label}
        </span>
      );
    case 'SHIPPED':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/20 px-3.5 py-1.5 text-xs font-bold text-indigo-300 backdrop-blur-md">
          <Truck className="size-3.5" />
          {label}
        </span>
      );
    case 'DELIVERED':
    case 'COMPLETED':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/20 px-3.5 py-1.5 text-xs font-bold text-emerald-300 backdrop-blur-md">
          <CheckCircle2 className="size-3.5" />
          {label}
        </span>
      );
    case 'CANCELLED':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/20 px-3.5 py-1.5 text-xs font-bold text-rose-300 backdrop-blur-md">
          <XCircle className="size-3.5" />
          {label}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-slate-200 backdrop-blur-md">
          {label}
        </span>
      );
  }
}

function getPaymentStatusBadge(statusCode: string, label: string) {
  switch (statusCode) {
    case 'SUCCESS':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-2 py-0.5 text-[11px] font-bold text-emerald-300">
          <CheckCircle2 className="size-3" /> {label}
        </span>
      );
    case 'FAILED':
    case 'CANCELLED':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/20 border border-rose-400/30 px-2 py-0.5 text-[11px] font-bold text-rose-300">
          <XCircle className="size-3" /> {label}
        </span>
      );
    case 'PENDING':
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 border border-amber-400/30 px-2 py-0.5 text-[11px] font-bold text-amber-300">
          <Clock3 className="size-3" /> {label}
        </span>
      );
  }
}

export function OrderDetailPage({ orderNo }: { orderNo: string }) {
  const { isAuthenticated, isLoaded } = useCustomerAuth();
  const queryClient = useQueryClient();
  const [reason, setReason] = useState('');
  const [showCancel, setShowCancel] = useState(false);
  const [copiedOrderNo, setCopiedOrderNo] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
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
        // CACHE: Hủy đơn có thể thay đổi dữ liệu mọi trang list Account.
        await queryClient.invalidateQueries({ queryKey: getListAccountOrdersQueryKey() });
      }
      idempotencyRef.current = undefined;
      cancel.reset();
      setShowCancel(false);
      setReason('');
    },
  });

  // Hiển thị dùng view model; DTO giữ lại cho lệnh huỷ vì cần id và version thô.
  const view = useMemo(() => (order ? toOrderDetailView(order) : undefined), [order]);

  const canCancel = order?.status === 'PENDING_CONFIRMATION'
    && statusIn(CANCELLABLE_PAYMENT_STATUSES, order.paymentStatus)
    && order.fulfillmentStatus === FULFILLMENT_STATUS.PENDING;

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
      setTimeout(() => setCopiedOrderNo(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <StorefrontLayout>
      <main className="mx-auto min-h-[65vh] max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
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
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <Link href="/" className="hover:text-emerald-700 transition">Trang chủ</Link>
                <ChevronRight className="size-3 text-slate-400" />
                {isAuthenticated ? (
                  <>
                    <Link href="/orders" className="hover:text-emerald-700 transition">Đơn hàng của tôi</Link>
                    <ChevronRight className="size-3 text-slate-400" />
                  </>
                ) : null}
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
              </div>
            </div>

            {/* Hero Order Status Header */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-6 sm:p-8 text-white shadow-xl">
              <div className="pointer-events-none absolute -right-16 -top-16 size-72 rounded-full bg-emerald-500/10 blur-3xl" />
              <div className="pointer-events-none absolute -left-16 -bottom-16 size-60 rounded-full bg-emerald-600/10 blur-2xl" />

              <div className="relative flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-emerald-300 border border-emerald-500/20">
                      <Package className="size-3" /> Đơn hàng trực tuyến
                    </span>
                  </div>
                  <div className="mt-2.5 flex flex-wrap items-center gap-3">
                    <h1 className="font-mono text-2xl sm:text-3xl font-black tracking-tight text-white">
                      {order.orderNo}
                    </h1>
                    <button
                      type="button"
                      onClick={() => handleCopyOrderNo(order.orderNo)}
                      className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-white/20 hover:text-white transition"
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
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="size-3.5 text-emerald-400" /> {view?.placedLabel}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Store className="size-3.5 text-emerald-400" /> {view?.branchName}
                    </span>
                  </div>
                </div>

                {view && getOrderStatusBadge(view.statusCode, view.statusLabel)}
              </div>

              {/* Metric Grid */}
              <div className="relative mt-7 grid gap-3 sm:grid-cols-3 pt-6 border-t border-white/10">
                <div className="rounded-2xl bg-white/[0.05] p-3.5 backdrop-blur-sm border border-white/[0.08]">
                  <span className="block text-[11px] font-medium uppercase tracking-wider text-slate-400">Người nhận</span>
                  <strong className="mt-1 block truncate text-sm font-bold text-white">{view?.recipientName}</strong>
                  <span className="mt-0.5 block text-xs text-slate-300 font-mono">{view?.recipientPhone}</span>
                </div>

                <div className="rounded-2xl bg-white/[0.05] p-3.5 backdrop-blur-sm border border-white/[0.08]">
                  <span className="block text-[11px] font-medium uppercase tracking-wider text-slate-400">Thanh toán</span>
                  <strong className="mt-1 block text-sm font-bold text-white">{view?.paymentMethodLabel}</strong>
                  <div className="mt-1">{view && getPaymentStatusBadge(view.paymentStatusCode, view.paymentStatusLabel)}</div>
                </div>

                <div className="rounded-2xl bg-white/[0.05] p-3.5 backdrop-blur-sm border border-white/[0.08]">
                  <span className="block text-[11px] font-medium uppercase tracking-wider text-slate-400">Tổng thanh toán</span>
                  <strong className="mt-1 block text-xl sm:text-2xl font-black text-emerald-400 tracking-tight">
                    {view?.grandTotalLabel}
                  </strong>
                  <span className="mt-0.5 block text-[11px] text-emerald-300/80">({view?.itemCount} sản phẩm)</span>
                </div>
              </div>
            </div>

            {/* Order Milestones Progress Timeline (Full Width, directly below Hero Box) */}
            <section className="mt-6 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-card transition-shadow hover:shadow-card-hover">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="grid size-8 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                    <Truck className="size-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-900">Tiến trình đơn hàng</h2>
                    <p className="text-xs text-slate-500">Cập nhật trạng thái xử lý và vận chuyển theo thời gian thực</p>
                  </div>
                </div>

                {view?.shipment?.trackingNo && (
                  <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-1.5 border border-slate-200/80">
                    <span className="text-[11px] font-semibold text-slate-500">Mã vận đơn ({view.shipment.carrierLabel}):</span>
                    <span className="font-mono text-xs font-black text-slate-900">{view.shipment.trackingNo}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyOrderNo(view.shipment?.trackingNo ?? '')}
                      className="rounded p-1 text-slate-400 hover:text-slate-700 transition"
                      title="Sao chép mã vận đơn"
                    >
                      <Copy className="size-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Desktop / Tablet Horizontal Stepper (sm: and above) */}
              <div className="hidden sm:block mt-7 mb-2">
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
                        <div className="relative z-10 grid size-8 place-items-center rounded-full bg-white">
                          {isDone ? (
                            <span className="grid size-8 place-items-center rounded-full bg-emerald-600 text-white shadow-sm ring-4 ring-emerald-50">
                              <Check className="size-4 stroke-[3]" />
                            </span>
                          ) : isCurrent ? (
                            <span className="relative flex size-8 items-center justify-center">
                              <span className="absolute size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                              <span className="relative grid size-8 place-items-center rounded-full border-2 border-emerald-600 bg-white text-emerald-600 shadow-sm ring-4 ring-emerald-50">
                                <span className="size-3 rounded-full bg-emerald-600" />
                              </span>
                            </span>
                          ) : isFailed ? (
                            <span className="grid size-8 place-items-center rounded-full bg-rose-600 text-white shadow-sm ring-4 ring-rose-50">
                              <X className="size-4 stroke-[3]" />
                            </span>
                          ) : (
                            <span className="grid size-8 place-items-center rounded-full border-2 border-slate-200 bg-white text-slate-300 ring-4 ring-slate-50">
                              <span className="size-2 rounded-full bg-slate-200" />
                            </span>
                          )}
                        </div>

                        {/* Step Label & Date */}
                        <div className="mt-3 w-full">
                          <strong
                            className={`block text-xs leading-snug ${
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
                          {milestone.occurredLabel && (
                            <p className="mt-1 text-[11px] font-medium text-slate-500">
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
                      <li key={milestone.key} className="relative flex gap-3.5 pb-5 last:pb-0">
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
                          {milestone.occurredLabel && (
                            <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500">
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

              {/* Shipment Link & Detailed History Toggle */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                {view?.shipment?.trackingUrl ? (
                  <a
                    href={view.shipment.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 font-bold text-white shadow-sm transition hover:bg-emerald-700"
                  >
                    <Truck className="size-3.5" /> Tra cứu vận đơn trên hệ thống hãng <ExternalLink className="size-3" />
                  </a>
                ) : (
                  <span className="text-slate-400 text-xs">
                    {view?.shipment ? `Đơn vị vận chuyển: ${view.shipment.carrierLabel}` : 'Đơn hàng đang trong quy trình xử lý tại kho'}
                  </span>
                )}

                {(view?.timeline ?? []).length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowTimeline(!showTimeline)}
                    className="inline-flex items-center gap-1.5 font-bold text-slate-700 hover:text-emerald-700 transition ml-auto"
                  >
                    <PackageCheck className="size-3.5 text-emerald-600" />
                    Lịch sử cập nhật ({view?.timeline.length})
                    {showTimeline ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                  </button>
                )}
              </div>

              {/* Collapsible status history */}
              {showTimeline && (view?.timeline ?? []).length > 0 && (
                <div className="mt-4 space-y-2.5 rounded-2xl bg-slate-50 p-4 border border-slate-100 animate-fade-in text-xs">
                  {(view?.timeline ?? []).map((entry) => (
                    <div key={entry.key} className="flex items-start justify-between gap-3 border-b border-slate-200/50 pb-2 last:border-0 last:pb-0">
                      <div>
                        <span className="font-bold text-slate-900">{entry.statusLabel}</span>
                        {entry.note && <p className="mt-0.5 text-slate-600">{entry.note}</p>}
                      </div>
                      <span className="shrink-0 text-[11px] text-slate-400">{entry.occurredLabel}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Main Content Two Columns */}
            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] items-start">
              {/* Left Column: Products & Bill Summary */}
              <div className="space-y-6">
                {/* Product List Card */}
                <section className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-card transition-shadow hover:shadow-card-hover">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="grid size-8 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                        <ShoppingBag className="size-4" />
                      </div>
                      <h2 className="text-base font-black text-slate-900">Danh sách sản phẩm</h2>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                      {view?.items.length} món
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {(view?.items ?? []).map((item) => (
                      <div key={item.id} className="flex gap-4 py-4.5 items-center">
                        <div className="relative size-16 sm:size-20 shrink-0 overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-50">
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
                              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                                {item.variantName}
                              </span>
                            )}
                            <span className="font-mono text-[11px] text-slate-400">SKU: {item.sku}</span>
                          </div>
                          <p className="mt-1.5 text-xs text-slate-500 font-medium">
                            {item.unitPriceLabel} × {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <strong className="block text-sm sm:text-base font-black text-slate-900">
                            {item.lineTotalLabel}
                          </strong>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bill Breakdown Summary */}
                  <div className="mt-5 space-y-3 rounded-2xl bg-slate-50/80 p-4 sm:p-5 border border-slate-100 text-sm">
                    <div className="flex justify-between text-slate-600">
                      <span>Tiền hàng (tạm tính)</span>
                      <span className="font-semibold text-slate-900">{view?.subtotalLabel}</span>
                    </div>
                    {view?.hasDiscount && (
                      <div className="flex justify-between text-emerald-700">
                        <span>Chiết khấu / Giảm giá</span>
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

                {/* Actions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex flex-wrap gap-2.5">
                    <Link
                      href="/orders"
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      <ArrowLeft className="size-3.5" /> Danh sách đơn
                    </Link>
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
                    >
                      <ShoppingBag className="size-3.5" /> Tiếp tục mua sắm
                    </Link>
                  </div>

                  {canCancel && (
                    <button
                      type="button"
                      onClick={() => setShowCancel(true)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/50 px-4 py-2.5 text-xs font-bold text-rose-700 transition hover:bg-rose-100 hover:border-rose-300"
                    >
                      <X className="size-3.5" /> Hủy đơn hàng
                    </button>
                  )}
                </div>
              </div>

              {/* Right Aside Column: Payment Panel & Delivery Address */}
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

                {/* Delivery Address Card */}
                <section className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-card transition-shadow hover:shadow-card-hover">
                  <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
                    <div className="grid size-8 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                      <MapPin className="size-4" />
                    </div>
                    <h2 className="text-base font-black text-slate-900">Địa chỉ giao hàng</h2>
                  </div>

                  <div className="mt-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                        <User className="size-4 text-emerald-600" />
                        <span>{view?.recipientName}</span>
                      </div>
                      <span className="text-slate-300">|</span>
                      <a
                        href={`tel:${view?.recipientPhone}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline"
                      >
                        <Phone className="size-3.5" />
                        {view?.recipientPhone}
                      </a>
                    </div>
                    <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                      {view?.recipientAddress}
                    </p>

                    <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 border border-slate-100">
                      <Store className="size-4 text-emerald-600 shrink-0" />
                      <span>Đơn hàng được chuẩn bị và xuất phát từ: <strong className="text-slate-900">{view?.branchName}</strong></span>
                    </div>
                  </div>
                </section>
              </aside>
            </div>

            {/* Cancel Order Modal Dialog */}
            {showCancel && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
                <div className="relative w-full max-w-lg rounded-3xl border border-slate-100 bg-white p-6 sm:p-7 shadow-2xl animate-fade-in-up">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="grid size-10 place-items-center rounded-2xl bg-rose-100 text-rose-600">
                        <AlertTriangle className="size-5" />
                      </div>
                      <div>
                        <h2 className="text-base font-black text-slate-900">Xác nhận hủy đơn hàng</h2>
                        <p className="font-mono text-xs text-slate-500">{order.orderNo}</p>
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

                  <p className="mt-4 text-xs leading-relaxed text-slate-600 bg-rose-50/70 p-3 rounded-2xl border border-rose-100">
                    Sau khi hủy, hệ thống sẽ tự động giải phóng toàn bộ sản phẩm đang giữ chỗ cho đơn hàng này. Thao tác này không thể hoàn tác.
                  </p>

                  <div className="mt-4">
                    <label htmlFor="customer-cancel-reason" className="block text-xs font-bold text-slate-800">
                      Lý do hủy đơn <span className="text-rose-600">*</span>
                    </label>
                    <textarea
                      id="customer-cancel-reason"
                      value={reason}
                      onChange={(event) => setReason(event.target.value)}
                      maxLength={500}
                      rows={3}
                      placeholder="Vui lòng cung cấp lý do bạn muốn hủy đơn (tối thiểu 3 ký tự)..."
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
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
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
          </>
        ) : null}
      </main>
    </StorefrontLayout>
  );
}
