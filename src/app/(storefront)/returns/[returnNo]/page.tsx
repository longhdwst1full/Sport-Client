import { ReturnDetailPage } from '@/features/returns';
import { NOINDEX_ROBOTS } from '@/lib/seo/page-metadata';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Chi tiết yêu cầu đổi trả', robots: NOINDEX_ROBOTS };

export default async function ReturnPage({ params }: { params: Promise<{ returnNo: string }> }) {
  const { returnNo } = await params;
  return <ReturnDetailPage returnNo={decodeURIComponent(returnNo)} />;
}
