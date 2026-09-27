import { CreateReturnPage } from '@/features/returns';
import { NOINDEX_ROBOTS } from '@/shared/seo/page-metadata';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Tạo yêu cầu đổi trả', robots: NOINDEX_ROBOTS };

export default async function OrderReturnPage({ params }: { params: Promise<{ orderNo: string }> }) {
  const { orderNo } = await params;
  return <CreateReturnPage orderNo={decodeURIComponent(orderNo)} />;
}
