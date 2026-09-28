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
    <div className="flex items-center justify-between rounded-2xl border border-slate-200/90 bg-white px-4 py-3.5 shadow-xs">
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={isAllSelected}
          onChange={onToggleSelectAll}
          className="size-4.5 rounded accent-emerald-600 cursor-pointer"
          aria-label="Chọn tất cả sản phẩm"
        />
        <span className="text-sm font-bold text-slate-800">
          Chọn tất cả ({itemCount} sản phẩm)
        </span>
      </label>
      <span className="text-xs font-semibold text-slate-500">
        Đã chọn: <strong className="font-bold text-emerald-700">{selectedCount}</strong>/{itemCount}
      </span>
    </div>
  );
}
