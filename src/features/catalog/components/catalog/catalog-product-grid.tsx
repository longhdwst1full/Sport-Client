'use client';

import type { ReactNode } from 'react';
import { ChevronDown, RotateCcw, Search } from 'lucide-react';
import { Button } from '@/foundation/components/buttons';
import { EmptyState, InlineAlert } from '@/foundation/components/feedback';
import type { ProductShowcaseItem } from '../../model/product.mapper';
import { useCardBuyNow } from '../../hooks/use-card-buy-now';
import { ProductCard, ProductCardSkeleton } from '../product-card';

/** Props trạng thái trùng tên với kết quả `useProductShowcase` để nơi gọi spread thẳng. */
interface CatalogProductGridProps {
  isPending: boolean;
  isError: boolean;
  /** Đang hiện kết quả của bộ lọc trước trong lúc chờ kết quả mới: giữ lưới, làm mờ. */
  isShowingPreviousResults?: boolean;
  refetch: () => void;
  products: ProductShowcaseItem[];
  hasActiveFilters?: boolean;
  onResetFilters?: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
  isLoadMoreError: boolean;
  loadMore: () => void;
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
  products,
  hasActiveFilters = false,
  onResetFilters,
  hasMore,
  isLoadingMore,
  isLoadMoreError,
  loadMore,
  gridClassName = GRID_CLASS,
  errorTitle = 'Không thể tải danh sách sản phẩm lúc này.',
  emptyState,
}: CatalogProductGridProps) {
  const onBuyNow = useCardBuyNow();
  const hasProducts = products.length > 0;

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
      variant="primary"
      size="sm"
      onClick={refetch}
      className="rounded-full px-5 text-xs font-bold"
    >
      <RotateCcw aria-hidden className="size-3.5" /> Thử lại
    </Button>
  );

  if (!hasProducts && isError) {
    return (
      <InlineAlert role="alert" className="rounded-3xl border border-red-200 bg-red-50/70 p-8 text-center text-red-800">
        <p className="font-bold">{errorTitle}</p>
        <div className="mt-4">{retryButton}</div>
      </InlineAlert>
    );
  }

  if (!hasProducts) {
    return (
      emptyState ?? (
        <EmptyState
          className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-300 bg-white px-4 py-16 text-center"
          iconWrapClassName="mb-4 grid size-14 place-items-center rounded-2xl bg-neutral-50 text-neutral-900"
          icon={<Search aria-hidden className="size-6" />}
          titleAs="h3"
          titleClassName="text-base font-bold text-neutral-900"
          title="Không tìm thấy sản phẩm phù hợp"
          descriptionClassName="mt-1 max-w-sm text-xs text-neutral-600"
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
          className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50/70 px-4 py-3 text-sm text-red-800"
        >
          <span className="font-semibold">Chưa cập nhật được danh sách mới nhất.</span>
          {retryButton}
        </InlineAlert>
      )}

      <div
        className={`${gridClassName} transition-opacity ${isShowingPreviousResults ? 'opacity-60' : ''}`}
        aria-busy={isShowingPreviousResults}
      >
        {products.map((product) => (
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
            onClick={loadMore}
            disabled={isLoadingMore}
            className="rounded-full px-6 disabled:opacity-60"
          >
            {isLoadingMore
              ? 'Đang tải…'
              : isLoadMoreError
                ? 'Tải thêm chưa được — thử lại'
                : 'Xem thêm'}
            {!isLoadingMore && <ChevronDown className="size-4" aria-hidden="true" />}
          </Button>
        </div>
      )}
    </>
  );
}
