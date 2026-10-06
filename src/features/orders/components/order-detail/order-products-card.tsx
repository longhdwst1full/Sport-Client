import { ShoppingBag } from 'lucide-react';
import { OrderBillSummary } from './order-bill-summary';
import { OrderDetailCard } from './order-detail-card';
import { OrderItemsList, type OrderItemsListProps } from './order-items-list';

export function OrderProductsCard(props: OrderItemsListProps) {
  const { view, order } = props;
  return (
    <OrderDetailCard
      icon={ShoppingBag}
      title="Danh sách sản phẩm"
      description={`Sản phẩm thuộc đơn hàng #${order.orderNo}`}
      action={
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
          {view?.items.length} món
        </span>
      }
    >
      <OrderItemsList {...props} />
      <OrderBillSummary view={view} />
    </OrderDetailCard>
  );
}
