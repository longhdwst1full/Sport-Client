import { NotFoundContent } from '@/shared/components/not-found-content';

/** `notFound()` trong các trang storefront: giữ header/footer, chỉ thay vùng nội dung. */
export default function StorefrontNotFound() {
  return (
    <main className="bg-white px-4 py-16 sm:px-6 sm:py-24">
      <NotFoundContent />
    </main>
  );
}
