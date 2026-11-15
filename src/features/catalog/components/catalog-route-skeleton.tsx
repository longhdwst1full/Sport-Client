import { Skeleton } from '@/foundation/components/feedback';
import { ProductCardSkeleton } from './product-card-skeleton';

/** Route fallback chỉ thay vùng nội dung; header/footer vẫn do layout chung sở hữu. */
export function CatalogRouteSkeleton({ category = false }: { category?: boolean } = {}) {
  return (
    <main className={`pb-20 pt-8 ${category ? 'bg-white' : 'bg-neutral-50/40'}`} aria-busy="true">
      <div className="page-container">
        <p role="status" className="sr-only">{category ? 'Đang tải danh mục' : 'Đang tải sản phẩm'}</p>
        <div aria-hidden="true">
          <Skeleton className="mb-6 h-5 w-56" />
          <Skeleton className="h-10 w-3/4 max-w-xl" />
          <Skeleton className="mt-3 h-5 w-2/3 max-w-lg" />
          <div className={`flex gap-8 ${category ? 'mt-12' : 'mt-6'}`}>
            {!category && (
              <div className="hidden w-64 shrink-0 space-y-6 rounded-2xl border border-neutral-200 bg-white p-5 lg:block">
                {Array.from({ length: 4 }, (_, index) => (
                  <div key={index} className="space-y-3">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ))}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <Skeleton className="mb-6 h-11 w-full" />
              <div className={`grid grid-cols-2 gap-3 md:grid-cols-3 ${category ? 'sm:gap-5 lg:grid-cols-4' : 'sm:gap-4 xl:grid-cols-4'}`}>
                {Array.from({ length: 12 }, (_, index) => <ProductCardSkeleton key={index} />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

/** Tránh kế thừa skeleton lưới từ /products khi đang mở trang chi tiết con. */
export function ProductDetailRouteSkeleton() {
  return (
    <main className="page-container py-8" aria-busy="true">
      <p role="status" className="sr-only">Đang tải chi tiết sản phẩm</p>
      <Skeleton className="mb-6 h-5 w-56" />
      <div className="grid gap-8 lg:grid-cols-2" aria-hidden="true">
        <Skeleton className="aspect-square w-full" />
        <div className="space-y-6">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </main>
  );
}
