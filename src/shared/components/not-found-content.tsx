import Link from 'next/link';
import { Home, LayoutGrid, Phone, SearchX } from 'lucide-react';
import { buttonVariants } from '@/foundation/components/buttons';
import { STORE_CONTACT } from '@/shared/constants';

/**
 * Nội dung trang không tìm thấy (404) đã được làm mới theo yêu cầu:
 * Bỏ số "404" to cứng nhắc, thay bằng icon trạng thái và thông báo thân thiện, hiện đại.
 */
export function NotFoundContent() {
  return (
    <div className="mx-auto max-w-xl text-center py-8 sm:py-12">
      {/* Friendly Athletic Status Icon */}
      <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-3xl bg-gradient-to-br from-red-50 to-red-100/60 border border-red-200/80 text-brand-600 shadow-md shadow-red-500/10">
        <SearchX className="size-10 text-red-600" aria-hidden="true" />
      </div>

      <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-neutral-600">
        Liên kết không khả dụng
      </span>

      <h1 className="mt-3 text-balance text-2xl font-black tracking-tight text-neutral-900 sm:text-4xl">
        Không tìm thấy trang bạn yêu cầu
      </h1>

      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-neutral-600 sm:text-base">
        Đường dẫn có thể đã được thay đổi hoặc sản phẩm/bài viết không còn tồn tại trên hệ thống. Bạn có thể quay về trang chủ hoặc khám phá các danh mục thể thao bên dưới.
      </p>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
        <Link
          href="/"
          className={buttonVariants({ variant: 'primary', size: 'lg', className: 'font-bold shadow-md shadow-red-600/20' })}
        >
          <Home aria-hidden className="size-4" />
          Về trang chủ
        </Link>
        <Link
          href="/category"
          className={buttonVariants({ variant: 'outline', size: 'lg', className: 'font-bold border-neutral-300' })}
        >
          <LayoutGrid aria-hidden className="size-4" />
          Khám phá danh mục
        </Link>
      </div>

      {/* Support Helpline */}
      <p className="mt-8 text-xs sm:text-sm text-neutral-500">
        Cần hỗ trợ tìm kiếm thiết bị?{' '}
        <a
          href={`tel:${STORE_CONTACT.primaryHotlineRaw}`}
          className="inline-flex items-center gap-1.5 font-bold text-neutral-900 underline-offset-2 hover:underline"
        >
          <Phone aria-hidden className="size-3.5" />
          Hotline: {STORE_CONTACT.primaryHotline}
        </a>
      </p>
    </div>
  );
}
