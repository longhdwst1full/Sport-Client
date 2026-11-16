import { Skeleton } from '@/foundation/components/feedback';
import { PRODUCT_CARD_SHELL, PRODUCT_CARD_STAGE } from './product-card.styles';

/**
 * Khung chờ cùng hộp với `ProductCard` (RULE-SKEL-03, CLS = 0): chung vỏ/bục ảnh qua
 * `product-card.styles`, danh mục 1 dòng `text-xs`, tiêu đề 2 dòng `min-h-10`, mô tả `text-2xs`,
 * giá `h-7`, cụm nút `h-11` (nút `Button` md/icon 44px).
 */
export function ProductCardSkeleton({ withAction = true }: { withAction?: boolean } = {}) {
  return (
    <div aria-hidden className={`flex flex-col overflow-hidden ${PRODUCT_CARD_SHELL}`}>
      <Skeleton className={`${PRODUCT_CARD_STAGE} block`} />
      <div className="flex flex-1 flex-col pt-3">
        <Skeleton className="h-4 w-24 rounded-full" />
        <div className="mt-1 min-h-10 space-y-1">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-2/3 rounded" />
        </div>
        <Skeleton className="mt-1.5 h-4 w-36 rounded" />
        <div className="mt-auto pt-3.5">
          <Skeleton className="h-7 w-28 rounded" />
        </div>
        {withAction && (
          <div className="mt-2.5 flex items-center gap-1.5 sm:gap-2">
            <Skeleton className="size-11 shrink-0 rounded-2xl" />
            <Skeleton className="h-11 flex-1 rounded-2xl" />
          </div>
        )}
      </div>
    </div>
  );
}
