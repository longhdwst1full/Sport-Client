import { Skeleton } from '@/foundation/components/feedback';

/**
 * Khung chờ cùng bố cục `ProductListItem` (ảnh vuông bên trái 112/160px, hãng, tên, mô tả, giá, nút)
 * để danh sách không nhảy khi dữ liệu về (RULE-SKEL-03).
 */
export function ProductListItemSkeleton() {
  return (
    <div aria-hidden className="flex gap-3 rounded-2xl border border-neutral-200/80 bg-white p-3 sm:gap-4 sm:p-4">
      <Skeleton className="aspect-square w-28 shrink-0 rounded-xl sm:w-40" />
      <div className="flex min-w-0 flex-1 flex-col">
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="mt-2 h-4 w-3/4 rounded" />
        <Skeleton className="mt-2 hidden h-3 w-full rounded sm:block" />
        <div className="mt-auto pt-3">
          <Skeleton className="h-6 w-28 rounded" />
          <Skeleton className="mt-2 h-11 w-full max-w-xs rounded-xl" />
        </div>
      </div>
    </div>
  );
}
