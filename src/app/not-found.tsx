import Image from 'next/image';
import Link from 'next/link';
import { NotFoundContent } from '@/shared/components/not-found-content';

/** URL không khớp route nào (ngoài vỏ storefront): logo + nội dung 404 chung. */
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-12 sm:px-6">
      <Link href="/" aria-label="Bảo An Sport - Trang chủ" className="mb-10 rounded-lg">
        <Image src="/images/logo.png" alt="" width={202} height={48} className="h-12 w-auto" priority />
      </Link>
      <NotFoundContent />
    </main>
  );
}
