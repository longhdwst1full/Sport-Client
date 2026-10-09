import type { Dispatch, SetStateAction } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/foundation/components/buttons';

const NAV_BUTTON_CLASS =
  'grid size-11 place-items-center rounded-xl border border-neutral-200 bg-white transition hover:bg-neutral-50 disabled:opacity-40';

/**
 * Phân trang trước/sau "Trang x / y" cho các trang danh sách tài khoản (đơn hàng, đổi trả).
 * Trung lập domain: caller tự quyết khi nào hiện (vd. `totalPages > 1`) và đặt `aria-label` cho `<nav>`.
 */
export function PaginationControls({
  page,
  totalPages,
  onPageChange,
  disabled = false,
  ariaLabel,
  className = 'mt-7 flex items-center justify-center gap-3',
}: {
  page: number;
  totalPages: number;
  onPageChange: Dispatch<SetStateAction<number>>;
  /** Khoá cả hai nút (vd. đang tải trang mới). */
  disabled?: boolean;
  ariaLabel: string;
  className?: string;
}) {
  return (
    <nav className={className} aria-label={ariaLabel}>
      <Button
        disabled={page === 1 || disabled}
        onClick={() => onPageChange((value) => Math.max(1, value - 1))}
        className={NAV_BUTTON_CLASS}
        aria-label="Trang trước"
      >
        <ChevronLeft aria-hidden className="size-4" />
      </Button>
      <span className="text-sm font-bold text-neutral-700">
        Trang {page} / {totalPages}
      </span>
      <Button
        disabled={page >= totalPages || disabled}
        onClick={() => onPageChange((value) => value + 1)}
        className={NAV_BUTTON_CLASS}
        aria-label="Trang sau"
      >
        <ChevronRight aria-hidden className="size-4" />
      </Button>
    </nav>
  );
}
