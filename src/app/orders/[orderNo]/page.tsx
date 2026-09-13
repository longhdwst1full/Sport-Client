import { OrderDetailPage } from '@/features/orders/pages/order-detail-page';

export const dynamic = 'force-dynamic';

export default async function OrderPage({ params }: { params: Promise<{ orderNo: string }> }) {
  const { orderNo } = await params;
  return <OrderDetailPage orderNo={orderNo} />;
}
