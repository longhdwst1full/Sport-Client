import { Skeleton, SkeletonText } from '@/foundation/components/feedback';

/** Khung chờ khớp bố cục 2 cột của trang thanh toán (form + tóm tắt đơn), tránh nhảy layout. */
export function CheckoutSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" role="status" aria-label="Đang tải thông tin đặt hàng">
      <div className="mb-8 space-y-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="space-y-6">
          {[0, 1, 2].map((section) => (
            <div key={section} className="surface-card p-6">
              <Skeleton className="h-5 w-48" />
              <SkeletonText lines={3} className="mt-5" />
            </div>
          ))}
        </div>
        <div className="h-fit surface-card p-6">
          <Skeleton className="h-5 w-40" />
          <div className="mt-5 space-y-4">
            {[0, 1].map((row) => (
              <div key={row} className="flex gap-3">
                <Skeleton className="size-16 shrink-0" />
                <SkeletonText lines={2} className="flex-1" />
              </div>
            ))}
          </div>
          <SkeletonText lines={3} className="mt-6" />
          <Skeleton className="mt-6 h-12 w-full" />
        </div>
      </div>
      <span className="sr-only">Đang tải thông tin đặt hàng…</span>
    </div>
  );
}
