import { Skeleton, SkeletonText } from '@/foundation/components/feedback';

/** Khớp thẻ yêu cầu đổi trả trong danh sách (mã + trạng thái, 2 cột thông tin). */
export function ReturnListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="grid gap-4" role="status" aria-label="Đang tải yêu cầu đổi trả">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-56" />
            </div>
            <Skeleton className="h-6 w-28 rounded-full" />
          </div>
          <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
            {[0, 1].map((cell) => (
              <div key={cell} className="space-y-1.5">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-28" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Khung chờ chi tiết yêu cầu: hero, tiến trình, rồi 2 cột sản phẩm / hoàn tiền. */
export function ReturnDetailSkeleton() {
  return (
    <div role="status" aria-label="Đang tải yêu cầu đổi trả">
      <Skeleton className="h-52 w-full rounded-[30px]" />
      <Skeleton className="mt-6 h-20 w-full rounded-3xl" />
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <Skeleton className="h-5 w-32" />
          <SkeletonText lines={4} className="mt-5" />
        </div>
        <div className="space-y-5">
          <Skeleton className="h-28 w-full rounded-3xl" />
          <Skeleton className="h-36 w-full rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
