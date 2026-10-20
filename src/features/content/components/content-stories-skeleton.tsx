import { Skeleton } from '@/foundation/components/feedback';

/** Khung chờ hai thẻ bài viết, cùng lưới với `ContentStories`; tách file để bản lazy dùng lại mà không kéo cả khối. */
export function ContentStoriesSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {Array.from({ length: 2 }, (_, index) => (
        <div key={index} className="grid overflow-hidden rounded-4xl border border-neutral-200/90 bg-white md:grid-cols-[1fr_1.2fr]">
          <Skeleton className="aspect-[16/9] bg-neutral-100 md:aspect-auto md:min-h-[220px]" />
          <div className="space-y-3 p-5 sm:p-6">
            <Skeleton className="h-4 w-24 bg-neutral-100" />
            <Skeleton className="h-6 w-3/4 bg-neutral-100" />
            <Skeleton className="h-12 w-full bg-neutral-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
