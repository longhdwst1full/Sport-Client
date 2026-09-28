import type { Metadata } from 'next';
import { PolicyListPage } from '@/features/content';
import { toPolicySummaryView } from '@/features/content';
import { listPublishedPosts } from '@/generated/api/content/content';
import { buildPageMetadata } from '@/lib/seo/page-metadata';

// ISR 5 phút (cùng mức LOOKUP của client): trang chính sách gần như không đổi. Bài vừa đăng/sửa
// hiện ngay khi API gọi `POST /api/revalidate` (xem `src/app/api/revalidate/route.ts`).
export const revalidate = 300;

export const metadata: Metadata = buildPageMetadata({
  title: 'Thông tin và chính sách',
  path: '/chinh-sach',
  description:
    'Quy định bảo hành, đổi trả, vận chuyển, thanh toán và bảo mật thông tin khi mua hàng tại Bảo An Sport.',
});

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
