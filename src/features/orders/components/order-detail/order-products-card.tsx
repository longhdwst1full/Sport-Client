import { ShoppingBag } from 'lucide-react';
import type { OrderDetailDto } from '@/generated/api/orders/orders.schemas';
import type { OrderDetailView } from '../../model/order.mapper';
import { OrderBillSummary } from './order-bill-summary';
import { OrderItemsList } from './order-items-list';

type ReorderItem = { id: string; sku: string; productName: string; imageUrl: string | null; quantity: number };

export function OrderProductsCard({
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

      <OrderItemsList
        view={view}
        order={order}
        isAuthenticated={isAuthenticated}
        submittedReviewItems={submittedReviewItems}
        onReview={onReview}
        onReorderItem={onReorderItem}
      />

      <OrderBillSummary view={view} />
    </section>
  );
}
