import { AccountOrdersPage } from '@/features/orders';
import { NOINDEX_ROBOTS } from '@/lib/seo/page-metadata';

export const metadata = { title: 'Đơn hàng của tôi', robots: NOINDEX_ROBOTS };

export default function OrdersPage() {
  return <AccountOrdersPage />;
}
