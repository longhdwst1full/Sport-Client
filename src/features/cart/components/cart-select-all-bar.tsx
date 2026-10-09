interface CartSelectAllBarProps {
  isAllSelected: boolean;
  onToggleSelectAll: () => void;
  itemCount: number;
  selectedCount: number;
}

export function CartSelectAllBar({
  isAllSelected,
  onToggleSelectAll,
  itemCount,
  selectedCount,
}: CartSelectAllBarProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-neutral-200/90 bg-white px-4 py-3.5 shadow-xs">
      <label className="flex min-h-11 cursor-pointer select-none items-center gap-3">
        <input
          type="checkbox"
          checked={isAllSelected}
          onChange={onToggleSelectAll}
          className="size-5 cursor-pointer rounded accent-neutral-900 focus-ring"
        />
        <span className="text-sm font-bold text-neutral-800">
          Chọn tất cả ({itemCount} sản phẩm)
        </span>
      </label>
      <span className="text-xs font-semibold text-neutral-600">
        Đã chọn: <strong className="font-bold text-neutral-900">{selectedCount}</strong>/{itemCount}
      </span>
    </div>
  );
}
