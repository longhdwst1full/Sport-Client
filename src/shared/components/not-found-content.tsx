import Link from 'next/link';
import { Home, LayoutGrid, Phone } from 'lucide-react';
import { buttonVariants } from '@/foundation/components/buttons';
import { STORE_CONTACT } from '@/shared/constants';

/**
 * Nội dung 404 dùng chung cho `app/not-found.tsx` (ngoài vỏ storefront) và
 * `app/(storefront)/not-found.tsx` (trong vỏ header/footer). Chỉ một `<h1>`; nơi gọi lo `<main>`.
 */
export function NotFoundContent() {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p aria-hidden className="select-none text-7xl font-black tracking-tighter text-slate-900 sm:text-8xl">
        404
      </p>
      <h1 className="mt-4 text-balance text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">
        Không tìm thấy trang bạn yêu cầu
      </h1>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-600 sm:text-base">
        Đường dẫn có thể đã bị đổi hoặc không còn tồn tại. Bạn có thể quay về trang chủ hoặc xem
        danh mục sản phẩm.
      </p>

      <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
        <Link
          href="/"
          className={buttonVariants({ variant: 'primary', size: 'lg', className: 'font-bold' })}
        >
          <Home aria-hidden className="size-4" />
          Về trang chủ
        </Link>
        <Link
          href="/category"
          className={buttonVariants({ variant: 'outline', size: 'lg', className: 'font-bold' })}
        >
          <LayoutGrid aria-hidden className="size-4" />
          Danh mục sản phẩm
        </Link>
      </div>

      <p className="mt-8 text-sm text-slate-600">
        Cần hỗ trợ tìm sản phẩm?{' '}
        <a
          href={`tel:${STORE_CONTACT.primaryHotlineRaw}`}
          className="inline-flex min-h-11 items-center gap-1.5 font-bold text-slate-900 hover:underline"
        >
          <Phone aria-hidden className="size-4" />
          {STORE_CONTACT.primaryHotline}
        </a>
      </p>
    </div>
  );
}
