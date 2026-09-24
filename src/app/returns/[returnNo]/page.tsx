import { ReturnDetailPage } from '@/features/returns';

export const dynamic = 'force-dynamic';

export default async function ReturnPage({ params }: { params: Promise<{ returnNo: string }> }) {
  const { returnNo } = await params;
  return <ReturnDetailPage returnNo={decodeURIComponent(returnNo)} />;
}
