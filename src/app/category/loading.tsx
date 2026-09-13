import { StorefrontLayout } from '@/layouts/storefront-layout';
import { Skeleton } from '@/foundation/components/feedback';
import { CategoryGridSkeleton } from '@/features/catalog';

export default function Loading() {
  return (
    <StorefrontLayout>
      <div className="bg-stone-50/60 pb-20 pt-8">
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="mt-8 h-10 w-2/3 max-w-xl" />
          <Skeleton className="mt-4 h-5 w-full max-w-2xl" />
          <div className="mt-12">
            <CategoryGridSkeleton />
          </div>
        </main>
      </div>
    </StorefrontLayout>
  );
}
