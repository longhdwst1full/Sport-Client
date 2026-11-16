import { twMerge } from 'tailwind-merge';

/**
 * Preset skeleton dùng chung (`12-skeleton-loading.md` RULE-SKEL-01).
 * Feature không tự viết shimmer riêng; thiếu preset thì bổ sung tại đây.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={twMerge('animate-pulse rounded-xl bg-neutral-200/80', className)}
    />
  );
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={twMerge('space-y-2', className)}>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          className={twMerge('h-3', index === lines - 1 ? 'w-2/3' : 'w-full')}
        />
      ))}
    </div>
  );
}

const SUMMARY_CELLS_CLASS = {
  2: 'mt-4 grid gap-3 border-t border-neutral-100 pt-4 sm:grid-cols-2',
  3: 'mt-5 grid gap-3 border-t border-neutral-100 pt-4 sm:grid-cols-3',
} as const;

/** Thẻ tóm tắt trong danh sách (tiêu đề + badge + lưới `cells` ô thông tin). */
export function SummaryCardSkeleton({
  cells,
  titleClassName,
  subtitleClassName,
  badgeClassName,
}: {
  cells: 2 | 3;
  titleClassName: string;
  subtitleClassName: string;
  badgeClassName: string;
}) {
  return (
    <div className="surface-card p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className={titleClassName} />
          <Skeleton className={subtitleClassName} />
        </div>
        <Skeleton className={badgeClassName} />
      </div>
      <div className={SUMMARY_CELLS_CLASS[cells]}>
        {Array.from({ length: cells }, (_, cell) => (
          <div key={cell} className="space-y-1.5">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-28" />
          </div>
        ))}
      </div>
    </div>
  );
}
