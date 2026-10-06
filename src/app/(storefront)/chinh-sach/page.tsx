import type { Metadata } from 'next';
import { PHASE_PRODUCTION_BUILD } from 'next/constants';
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
  let policies: Awaited<ReturnType<typeof listPublishedPosts>>['items'] = [];
  let loadFailed = false;
  try {
    policies = (await listPublishedPosts({ postType: 'POLICY' })).items;
  } catch (error) {
    // Lúc chạy: ném lỗi để ISR giữ bản tốt trước đó, không cache 5 phút một trang "chưa có chính
    // sách" giả. Lúc build (API có thể chưa với tới) không làm hỏng build: dựng trạng thái lỗi,
    // lượt revalidate đầu tiên sẽ thay bằng dữ liệu thật.
    if (process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD) throw error;
    loadFailed = true;
  }

  return <PolicyListPage policies={policies.map(toPolicySummaryView)} loadFailed={loadFailed} />;
}
