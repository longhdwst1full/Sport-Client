import { OrderDetailPage } from '@/features/orders';
import { NOINDEX_ROBOTS } from '@/shared/seo/page-metadata';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Chi tiết đơn hàng', robots: NOINDEX_ROBOTS };

export default async function OrderPage({ params }: { params: Promise<{ orderNo: string }> }) {
  const { orderNo } = await params;
  return <OrderDetailPage orderNo={orderNo} />;
}
