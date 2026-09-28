import { CheckCircle2, Clock3, Package, Truck, XCircle } from 'lucide-react';
import { Badge } from '@/foundation/components/tabs-chips';

export function getOrderStatusBadge(statusCode: string, label: string) {
  switch (statusCode) {
    case 'PENDING_CONFIRMATION':
      return (
        <Badge className="inline-flex items-center gap-2 rounded-2xl border border-amber-400/40 bg-amber-500/20 px-4 py-2 text-sm font-black text-amber-300 backdrop-blur-md shadow-sm">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex size-2.5 rounded-full bg-amber-400" />
          </span>
          {label}
        </Badge>
      );
    case 'CONFIRMED':
    case 'PICKING':
    case 'PACKED':
      return (
        <Badge className="inline-flex items-center gap-2 rounded-2xl border border-blue-400/40 bg-blue-500/25 px-4 py-2 text-sm font-black text-blue-200 backdrop-blur-md shadow-sm">
          <Package className="size-4" />
          {label}
        </Badge>
      );
    case 'SHIPPED':
      return (
        <Badge className="inline-flex items-center gap-2 rounded-2xl border border-teal-400/40 bg-teal-500/25 px-4 py-2 text-sm font-black text-teal-200 backdrop-blur-md shadow-sm">
          <Truck className="size-4" />
          {label}
        </Badge>
      );
    case 'DELIVERED':
    case 'COMPLETED':
      return (
        <Badge className="inline-flex items-center gap-2 rounded-2xl border border-emerald-400/40 bg-emerald-500/25 px-4 py-2 text-sm font-black text-emerald-300 backdrop-blur-md shadow-sm">
          <CheckCircle2 className="size-4" />
          {label}
        </Badge>
      );
    case 'CANCELLED':
      return (
        <Badge className="inline-flex items-center gap-2 rounded-2xl border border-rose-400/40 bg-rose-500/25 px-4 py-2 text-sm font-black text-rose-300 backdrop-blur-md shadow-sm">
          <XCircle className="size-4" />
          {label}
        </Badge>
      );
    default:
      return (
        <Badge className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-black text-slate-200 backdrop-blur-md">
          {label}
        </Badge>
      );
  }
}

export function getPaymentStatusBadge(statusCode: string, label: string) {
  switch (statusCode) {
    case 'SUCCESS':
      return (
        <Badge className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-0.5 text-xs font-bold text-emerald-300">
          <CheckCircle2 className="size-3" /> {label}
        </Badge>
      );
    case 'FAILED':
    case 'CANCELLED':
      return (
        <Badge className="inline-flex items-center gap-1 rounded-full bg-rose-500/20 border border-rose-400/30 px-2.5 py-0.5 text-xs font-bold text-rose-300">
          <XCircle className="size-3" /> {label}
        </Badge>
      );
    case 'PENDING':
    default:
      return (
        <Badge className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 border border-amber-400/30 px-2.5 py-0.5 text-xs font-bold text-amber-300">
          <Clock3 className="size-3" /> {label}
        </Badge>
      );
  }
}
