import { HomePage as StorefrontHomePage } from '@/features/home';

// Rail danh mục lấy từ API lúc render; ISR 5 phút để trang chủ không bị
// đóng băng dữ liệu build-time (`01-next-rendering.md`).
export const revalidate = 300;

export default function HomePage() {
  return <StorefrontHomePage />;
}
