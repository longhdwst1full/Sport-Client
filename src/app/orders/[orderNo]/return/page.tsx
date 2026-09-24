import { CreateReturnPage } from '@/features/returns';

export const dynamic = 'force-dynamic';

export default async function OrderReturnPage({ params }: { params: Promise<{ orderNo: string }> }) {
  const { orderNo } = await params;
  return <CreateReturnPage orderNo={decodeURIComponent(orderNo)} />;
}
