import { CheckCircle2, Clock3, Package, Truck, XCircle } from 'lucide-react';
import { Badge } from '@/foundation/components/tabs-chips';
import { ORDER_STATUS, PAYMENT_STATUS } from '../../model/order.constants';

export function getOrderStatusBadge(statusCode: string, label: string) {
  switch (statusCode) {
    case ORDER_STATUS.PENDING_CONFIRMATION:
      return (
        <Badge className="inline-flex items-center gap-2 rounded-2xl border border-amber-400/40 bg-amber-500/20 px-4 py-2 text-sm font-black text-amber-300 backdrop-blur-md shadow-sm">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex size-2.5 rounded-full bg-amber-400" />
          </span>
          {label}
        </Badge>
      );
    case ORDER_STATUS.CONFIRMED:
    case ORDER_STATUS.PICKING:
    case ORDER_STATUS.PACKED:
      return (
        <Badge className="inline-flex items-center gap-2 rounded-2xl border border-neutral-400/40 bg-neutral-500/25 px-4 py-2 text-sm font-black text-neutral-200 backdrop-blur-md shadow-sm">
          <Package className="size-4" />
          {label}
        </Badge>
      );
    case ORDER_STATUS.SHIPPED:
      return (
        <Badge className="inline-flex items-center gap-2 rounded-2xl border border-neutral-400/40 bg-neutral-500/25 px-4 py-2 text-sm font-black text-neutral-200 backdrop-blur-md shadow-sm">
          <Truck className="size-4" />
          {label}
        </Badge>
      );
    case ORDER_STATUS.DELIVERED:
    case ORDER_STATUS.COMPLETED:
      return (
        <Badge className="inline-flex items-center gap-2 rounded-2xl border border-success-400/40 bg-success-500/25 px-4 py-2 text-sm font-black text-success-200 backdrop-blur-md shadow-sm">
          <CheckCircle2 className="size-4" />
          {label}
        </Badge>
      );
    case ORDER_STATUS.CANCELLED:
      return (
        <Badge className="inline-flex items-center gap-2 rounded-2xl border border-red-400/40 bg-red-500/25 px-4 py-2 text-sm font-black text-red-300 backdrop-blur-md shadow-sm">
          <XCircle className="size-4" />
          {label}
        </Badge>
      );
    default:
      return (
        <Badge className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-black text-neutral-200 backdrop-blur-md">
          {label}
        </Badge>
      );
  }
}

export function getPaymentStatusBadge(statusCode: string, label: string) {
  switch (statusCode) {
    case PAYMENT_STATUS.SUCCESS:
      return (
        <Badge className="inline-flex items-center gap-1 rounded-full bg-success-500/20 border border-success-400/30 px-2.5 py-0.5 text-xs font-bold text-success-200">
          <CheckCircle2 className="size-3" /> {label}
        </Badge>
      );
    case PAYMENT_STATUS.FAILED:
    case PAYMENT_STATUS.CANCELLED:
      return (
        <Badge className="inline-flex items-center gap-1 rounded-full bg-red-500/20 border border-red-400/30 px-2.5 py-0.5 text-xs font-bold text-red-300">
          <XCircle className="size-3" /> {label}
        </Badge>
      );
    case PAYMENT_STATUS.PENDING:
    default:
      return (
        <Badge className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 border border-amber-400/30 px-2.5 py-0.5 text-xs font-bold text-amber-300">
          <Clock3 className="size-3" /> {label}
        </Badge>
      );
  }
}
