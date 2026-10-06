import { Skeleton, SkeletonText } from '@/foundation/components/feedback';

/** 5 thẻ đơn giữ đúng chiều cao thẻ thật trong lịch sử đơn (`12-skeleton-loading.md` RULE-SKEL-04). */
export function OrderListSkeleton({ count = 5, label = 'Đang tải danh sách đơn hàng' }: { count?: number; label?: string }) {
  return (
    <div className="grid gap-4" role="status" aria-label={label}>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-52" />
            </div>
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <div className="mt-5 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-3">
            {[0, 1, 2].map((cell) => (
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

/** Khung chờ chi tiết đơn: hero, tiến trình, rồi 2 cột sản phẩm / thanh toán. */
export function OrderDetailSkeleton() {
  return (
    <div role="status" aria-label="Đang tải thông tin đơn hàng">
      <Skeleton className="h-4 w-56" />
      <Skeleton className="mt-5 h-64 w-full rounded-3xl" />
      <Skeleton className="mt-6 h-44 w-full rounded-3xl" />
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <Skeleton className="h-5 w-40" />
          <div className="mt-5 space-y-4">
            {[0, 1].map((row) => (
              <div key={row} className="flex gap-3">
                <Skeleton className="size-20 shrink-0" />
                <SkeletonText lines={2} className="flex-1" />
              </div>
            ))}
          </div>
          <SkeletonText lines={4} className="mt-6" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-56 w-full rounded-3xl" />
          <Skeleton className="h-40 w-full rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
