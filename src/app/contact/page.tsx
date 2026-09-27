import { ContactPage } from '@/features/support';
import { buildPageMetadata } from '@/shared/seo/page-metadata';

export const metadata = buildPageMetadata({
  title: 'Liên hệ',
  description: 'Liên hệ Bảo An Sport để được tư vấn chọn thiết bị thể thao, báo giá và hỗ trợ bảo hành.',
  path: '/contact',
});

export default function Page() {
  return <ContactPage />;
}
