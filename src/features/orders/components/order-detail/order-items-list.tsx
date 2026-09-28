import Image from 'next/image';
import { CheckCircle2, MessageSquarePlus, RotateCcw } from 'lucide-react';
import type { OrderDetailDto } from '@/generated/api/orders/orders.schemas';
import { PRODUCT_PLACEHOLDER_IMAGE } from '@/shared/constants';
import type { OrderDetailView } from '../../model/order.mapper';

type ReorderItem = { id: string; sku: string; productName: string; imageUrl: string | null; quantity: number };

/**
 * Dòng sản phẩm của đơn. Nút đánh giá chỉ có với khách đã đăng nhập và đơn đã hoàn tất (đánh giá gắn với
 * dòng đơn của tài khoản); nút mua lại lấy đơn giá từ DTO gốc để cộng vào giỏ đúng số.
 */
export function OrderItemsList({
  view,
  order,
  isAuthenticated,
  submittedReviewItems,
  onReview,
  onReorderItem,
}: {
  view: OrderDetailView | undefined;
  order: OrderDetailDto;
  isAuthenticated: boolean;
  submittedReviewItems: Set<string>;
  onReview: (item: { id: string; productName: string }) => void;
  onReorderItem: (item: ReorderItem, unitPrice: number) => void;
}) {
  return (
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
                    onClick={() => onReview({ id: item.id, productName: item.productName })}
                    className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 px-2.5 py-1 text-xs font-bold text-emerald-700 transition hover:bg-emerald-50"
                  >
                    <MessageSquarePlus className="size-3" /> Đánh giá
                  </button>
                )
              )}

              {order.status === 'COMPLETED' && (
                <button
                  type="button"
                  onClick={() => onReorderItem(item, Number(order.items.find((i) => i.id === item.id)?.unitPrice) || 0)}
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
  );
}
