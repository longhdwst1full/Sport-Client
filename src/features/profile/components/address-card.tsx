import type { AddressView } from '../model/address.mapper';

interface AddressCardProps {
  addr: AddressView;
  canDelete: boolean;
  onSetDefault: (addr: AddressView) => void;
  onEdit: (addr: AddressView) => void;
  onDelete: (id: string) => void;
}

/** Nút chữ (không phải CTA) — kiểu link nên không dùng `Button` variant. */
const ACTION_BASE =
  'inline-flex min-h-11 items-center px-1 font-bold sm:min-h-0 rounded focus-visible:outline-none focus-visible:ring-2';

export function AddressCard({ addr, canDelete, onSetDefault, onEdit, onDelete }: AddressCardProps) {
  const actions = [
    {
      key: 'default',
      visible: !addr.isDefault,
      label: 'Đặt làm mặc định',
      ariaLabel: `Đặt địa chỉ của ${addr.recipient} làm mặc định`,
      onClick: () => onSetDefault(addr),
      className: 'text-brand-700 hover:underline focus-visible:ring-brand-500',
    },
    {
      key: 'edit',
      visible: true,
      label: 'Sửa',
      ariaLabel: `Sửa địa chỉ của ${addr.recipient}`,
      onClick: () => onEdit(addr),
      className: 'text-slate-600 hover:text-slate-900 focus-visible:ring-brand-500',
    },
    {
      key: 'delete',
      visible: canDelete,
      label: 'Xóa',
      ariaLabel: `Xóa địa chỉ của ${addr.recipient}`,
      onClick: () => onDelete(addr.id),
      className: 'text-rose-600 hover:underline focus-visible:ring-rose-500',
    },
  ];

  return (
    <div
      className={`relative rounded-2xl border p-5 transition ${
        addr.isDefault
          ? 'border-2 border-brand-500/60 bg-brand-50/20 shadow-sm'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <strong className="text-sm font-bold text-slate-900">{addr.recipient}</strong>
          <span className="text-xs text-slate-500">· {addr.phone}</span>
          {addr.isDefault && (
            <span className="rounded-full bg-brand-600 px-2.5 py-0.5 text-[10px] font-black uppercase text-white">
              Mặc định
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 text-xs sm:gap-3">
          {actions
            .filter((action) => action.visible)
            .map((action) => (
              <button
                key={action.key}
                type="button"
                onClick={action.onClick}
                aria-label={action.ariaLabel}
                className={`${ACTION_BASE} ${action.className}`}
              >
                {action.label}
              </button>
            ))}
        </div>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
        {addr.fullAddress}
      </p>
    </div>
  );
}
