import { Skeleton, SkeletonText, SummaryCardSkeleton } from '@/foundation/components/feedback';

/** 5 thẻ đơn giữ đúng chiều cao thẻ thật trong lịch sử đơn (`12-skeleton-loading.md` RULE-SKEL-04). */
export function OrderListSkeleton({ count = 5, label = 'Đang tải danh sách đơn hàng' }: { count?: number; label?: string }) {
  return (
    <div className="grid gap-4" role="status" aria-label={label}>
      {Array.from({ length: count }, (_, index) => (
        <SummaryCardSkeleton
          key={index}
          cells={3}
          titleClassName="h-4 w-36"
          subtitleClassName="h-3 w-52"
          badgeClassName="h-6 w-24 rounded-full"
        />
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
        <div className="surface-card p-6">
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
