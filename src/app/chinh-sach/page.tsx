import type { Metadata } from 'next';
import { PolicyListPage } from '@/features/content';
import { toPolicySummaryView } from '@/features/content/model/policy.mapper';
import { listPublishedPosts } from '@/generated/api/content/content';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Thông tin và chính sách — Bảo An Sport',
  description:
    'Quy định bảo hành, đổi trả, vận chuyển, thanh toán và bảo mật thông tin khi mua hàng tại Bảo An Sport.',
};

export default async function Page() {
  // API lỗi thì hiện danh sách rỗng, không dựng chính sách không có thật.
  let policies: Awaited<ReturnType<typeof listPublishedPosts>>['items'] = [];
  try {
    policies = (await listPublishedPosts({ postType: 'POLICY' })).items;
  } catch {
    policies = [];
  }

  return <PolicyListPage policies={policies.map(toPolicySummaryView)} />;
}
