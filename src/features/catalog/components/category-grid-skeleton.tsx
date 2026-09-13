import { Skeleton, SkeletonText } from '@/foundation/components/feedback';

/** Khớp đúng hộp của `CategoryGrid` để không gây layout shift (RULE-SKEL-03). */
export function CategoryGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="flex flex-col overflow-hidden rounded-[32px] border border-stone-200/80 bg-white shadow-sm"
        >
          <Skeleton className="aspect-[16/10] rounded-none" />
          <div className="flex flex-1 flex-col justify-between p-6">
            <div>
              <Skeleton className="h-6 w-2/3" />
              <SkeletonText lines={2} className="mt-3" />
            </div>
            <Skeleton className="mt-6 h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
