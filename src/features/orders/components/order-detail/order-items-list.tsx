import Image from 'next/image';
import { CheckCircle2, MessageSquarePlus, RotateCcw } from 'lucide-react';
import type { OrderDetailDto } from '@/generated/api/orders/orders.schemas';
import { PRODUCT_PLACEHOLDER_IMAGE } from '@/shared/constants';
import type { OrderDetailView } from '../../model/order.mapper';
import { ORDER_STATUS } from '../../model/order.constants';

import { Button } from '@/foundation/components/buttons';

type ReorderItem = { id: string; sku: string; productName: string; imageUrl: string | null; quantity: number };

export type OrderItemsListProps = {
  view: OrderDetailView | undefined;
  order: OrderDetailDto;
  isAuthenticated: boolean;
  submittedReviewItems: Set<string>;
  onReview: (item: { id: string; productName: string }) => void;
  onReorderItem: (item: ReorderItem, unitPrice: number) => void;
};

/** Nút phụ nhỏ của dòng sản phẩm (đánh giá / mua lại): giữ vùng chạm 44px. */
const ITEM_ACTION_CLASS = 'min-h-11 gap-1 rounded-lg px-3 text-xs font-bold';

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
}: OrderItemsListProps) {
  return (
    <div className="divide-y divide-neutral-100">
      {(view?.items ?? []).map((item) => (
        <div key={item.id} className="flex flex-wrap items-start gap-x-4 gap-y-3 py-5 sm:flex-nowrap sm:items-center">
          <div className="relative size-16 sm:size-20 shrink-0 overflow-hidden rounded-2xl border border-neutral-200/70 bg-neutral-50">
            <Image
              src={item.imageUrl || PRODUCT_PLACEHOLDER_IMAGE}
              alt={item.productName}
              fill
              sizes="80px"
              className="object-contain p-1.5"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm sm:text-base font-bold text-neutral-900 line-clamp-2">
              {item.productName}
            </h3>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              {item.variantName && (
                <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700">
                  {item.variantName}
                </span>
              )}
              <span className="font-mono text-xs text-neutral-400">SKU: {item.sku}</span>
            </div>
            <p className="mt-1.5 text-xs text-neutral-600 font-medium">
              {item.unitPriceLabel} × {item.quantity}
            </p>
          </div>
          <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:flex-col sm:items-end sm:text-right">
            <strong className="block text-sm sm:text-base font-bold text-neutral-900">
              {item.lineTotalLabel}
            </strong>

            <div className="flex flex-wrap justify-end gap-1.5 sm:mt-2">
              {isAuthenticated && order.status === ORDER_STATUS.COMPLETED && (
                submittedReviewItems.has(item.id) ? (
                  <span className="inline-flex min-h-11 items-center gap-1 text-xs font-bold text-success-700">
                    <CheckCircle2 aria-hidden className="size-3.5" /> Đã gửi đánh giá
                  </span>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onReview({ id: item.id, productName: item.productName })}
                    className={`${ITEM_ACTION_CLASS} border-neutral-200 text-neutral-900 hover:bg-neutral-50`}
                  >
                    <MessageSquarePlus aria-hidden className="size-3.5" /> Đánh giá
                  </Button>
                )
              )}

              {order.status === ORDER_STATUS.COMPLETED && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReorderItem(item, Number(order.items.find((i) => i.id === item.id)?.unitPrice) || 0)}
                  className={`${ITEM_ACTION_CLASS} border-neutral-200 text-neutral-700 hover:border-neutral-200 hover:bg-neutral-50 hover:text-neutral-700`}
                  title="Thêm vào giỏ hàng để mua lại"
                >
                  <RotateCcw aria-hidden className="size-3.5" /> Mua lại
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
