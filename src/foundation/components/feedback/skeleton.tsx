import { twMerge } from 'tailwind-merge';

/**
 * Preset skeleton dùng chung (`12-skeleton-loading.md` RULE-SKEL-01).
 * Feature không tự viết shimmer riêng; thiếu preset thì bổ sung tại đây.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={twMerge('animate-pulse rounded-xl bg-stone-200/80', className)}
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

export function SkeletonCircle({ className }: { className?: string }) {
  return <Skeleton className={twMerge('rounded-full', className)} />;
}
