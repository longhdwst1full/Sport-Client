import type { ReactNode } from 'react';
import { RotateCcw, Search } from 'lucide-react';
import { Button } from '@/foundation/components/buttons';
import { EmptyState, InlineAlert } from '@/foundation/components/feedback';
import type { ProductShowcaseItem } from '../../model/product.mapper';
import { ProductCard, ProductCardSkeleton } from '../product-card';

interface CatalogProductGridProps {
  isPending: boolean;
  isError: boolean;
  /** Đang hiện kết quả của bộ lọc trước trong lúc chờ kết quả mới: giữ lưới, làm mờ. */
  isShowingPreviousResults?: boolean;
  refetch: () => unknown;
  displayedProducts: ProductShowcaseItem[];
  hasActiveFilters?: boolean;
  onResetFilters?: () => void;
  onBuyNow: (product: ProductShowcaseItem, e: React.MouseEvent) => void;
  hasMore: boolean;
  isLoadingMore: boolean;
  isLoadMoreError: boolean;
  onLoadMore: () => void;
  /** Lưới cột/khoảng cách riêng của nơi dùng (lưới trưng bày trang chủ rộng hơn, không có sidebar). */
  gridClassName?: string;
  errorTitle?: string;
  /** Thay khối "không tìm thấy" mặc định (vd. lưới trưng bày không có bộ lọc để xoá). */
  emptyState?: ReactNode;
}

const GRID_CLASS = 'grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4';

export function CatalogProductGrid({
  isPending,
  isError,
  isShowingPreviousResults = false,
  refetch,
  displayedProducts,
  hasActiveFilters = false,
  onResetFilters,
  onBuyNow,
  hasMore,
  isLoadingMore,
  isLoadMoreError,
  onLoadMore,
  gridClassName = GRID_CLASS,
  errorTitle = 'Không thể tải danh sách sản phẩm lúc này.',
  emptyState,
}: CatalogProductGridProps) {
  const hasProducts = displayedProducts.length > 0;

  // RULE-SKEL-05: skeleton chỉ khi chưa có gì để hiện; có dữ liệu thì giữ lưới.
  if (!hasProducts && isPending) {
    return (
      <div className={gridClassName} role="status" aria-label="Đang tải danh sách sản phẩm">
        {Array.from({ length: 8 }, (_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  const retryButton = (
    <Button
      variant="danger"
      size="sm"
      onClick={() => void refetch()}
      className="rounded-full bg-rose-700 px-5 text-xs font-bold shadow-xs hover:bg-rose-800"
    >
      <RotateCcw aria-hidden className="size-3.5" /> Thử lại
    </Button>
  );

  if (!hasProducts && isError) {
    return (
      <InlineAlert role="alert" className="rounded-3xl border border-rose-200 bg-rose-50/70 p-8 text-center text-rose-800">
        <p className="font-bold">{errorTitle}</p>
        <div className="mt-4">{retryButton}</div>
      </InlineAlert>
    );
  }

  if (!hasProducts) {
    return (
      emptyState ?? (
        <EmptyState
          className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-4 py-16 text-center"
          iconWrapClassName="mb-4 grid size-14 place-items-center rounded-2xl bg-slate-50 text-slate-900"
          icon={<Search aria-hidden className="size-6" />}
          titleAs="h3"
          titleClassName="text-base font-black text-slate-900"
          title="Không tìm thấy sản phẩm phù hợp"
          descriptionClassName="mt-1 max-w-sm text-xs text-slate-600"
          description="Rất tiếc không có thiết bị nào đáp ứng các bộ lọc hiện tại. Bạn vui lòng thử xóa bớt bộ lọc hoặc tìm kiếm từ khóa khác."
          actions={
            hasActiveFilters && onResetFilters ? (
              <Button size="sm" onClick={onResetFilters} className="mt-5 gap-1.5 rounded-full px-5 text-xs font-bold shadow-sm">
                <RotateCcw aria-hidden className="size-3.5" />
                <span>Xóa tất cả bộ lọc</span>
              </Button>
            ) : null
          }
        />
      )
    );
  }

  return (
    <>
      {/* Làm mới thất bại nhưng vẫn còn dữ liệu cũ: giữ lưới, báo lỗi gọn phía trên. */}
      {isError && (
        <InlineAlert
          role="alert"
          className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50/70 px-4 py-3 text-sm text-rose-800"
        >
          <span className="font-semibold">Chưa cập nhật được danh sách mới nhất.</span>
          {retryButton}
        </InlineAlert>
      )}

      <div
        className={`${gridClassName} transition-opacity ${isShowingPreviousResults ? 'opacity-60' : ''}`}
        aria-busy={isShowingPreviousResults}
      >
        {displayedProducts.map((product) => (
          <ProductCard key={product.id} product={product} onBuyNow={onBuyNow} />
        ))}
      </div>

      {hasMore && !isShowingPreviousResults && (
        <div className="mt-10 flex flex-col items-center gap-4">
          {isLoadingMore && (
            <div className={`${gridClassName} w-full`} aria-hidden="true">
              {Array.from({ length: 4 }, (_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          )}
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="rounded-full border-slate-200 px-7 text-xs font-bold uppercase tracking-wider text-slate-700 shadow-xs hover:border-slate-900 hover:bg-slate-50 disabled:opacity-60"
          >
            {isLoadingMore
              ? 'Đang tải…'
              : isLoadMoreError
                ? 'Tải thêm chưa được — thử lại'
                : 'Xem thêm'}
          </Button>
        </div>
      )}
    </>
  );
}
