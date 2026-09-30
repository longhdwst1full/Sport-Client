import { GuestOrderLookupPage } from '@/features/orders';
import { NOINDEX_ROBOTS } from '@/lib/seo/page-metadata';

export const metadata = { title: 'Tra cứu đơn hàng', robots: NOINDEX_ROBOTS };

export default async function OrderLookupPage({ searchParams }: { searchParams: Promise<{ orderNo?: string | string[] }> }) {
  const { orderNo } = await searchParams;
  const initialOrderNo = typeof orderNo === 'string' ? orderNo.slice(0, 32) : '';
  return <GuestOrderLookupPage initialOrderNo={initialOrderNo} />;
}
