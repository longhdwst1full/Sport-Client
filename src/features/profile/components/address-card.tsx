import { Button } from '@/foundation/components/buttons';
import type { AddressView } from '../model/address.mapper';

interface AddressCardProps {
  addr: AddressView;
  canDelete: boolean;
  onSetDefault: (addr: AddressView) => void;
  onEdit: (addr: AddressView) => void;
  onDelete: (id: string) => void;
}

/** Nút chữ (không phải CTA): `Button variant="link"` + vùng chạm 44px trên mobile. */
const ACTION_BASE = 'min-h-11 rounded px-1 font-bold sm:min-h-0 focus-visible:ring-offset-0';

export function AddressCard({ addr, canDelete, onSetDefault, onEdit, onDelete }: AddressCardProps) {
  const actions = [
    {
      key: 'default',
      visible: !addr.isDefault,
      label: 'Đặt làm mặc định',
      ariaLabel: `Đặt địa chỉ của ${addr.recipient} làm mặc định`,
      onClick: () => onSetDefault(addr),
      className: 'text-neutral-900 hover:underline focus-visible:ring-neutral-900',
    },
    {
      key: 'edit',
      visible: true,
      label: 'Sửa',
      ariaLabel: `Sửa địa chỉ của ${addr.recipient}`,
      onClick: () => onEdit(addr),
      className: 'text-neutral-600 hover:text-neutral-900 hover:no-underline focus-visible:ring-neutral-900',
    },
    {
      key: 'delete',
      visible: canDelete,
      label: 'Xóa',
      ariaLabel: `Xóa địa chỉ của ${addr.recipient}`,
      onClick: () => onDelete(addr.id),
      className: 'text-red-600 hover:underline focus-visible:ring-red-500',
    },
  ];

  return (
    <div
      className={`relative rounded-2xl border p-5 transition ${
        addr.isDefault
          ? 'border-2 border-neutral-900/60 bg-neutral-50/20 shadow-sm'
          : 'border-neutral-200 hover:border-neutral-300'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <strong className="text-sm font-bold text-neutral-900">{addr.recipient}</strong>
          <span className="text-xs text-neutral-500">· {addr.phone}</span>
          {addr.isDefault && (
            <span className="rounded-full bg-neutral-900 px-2.5 py-0.5 text-3xs font-bold uppercase text-white">
              Mặc định
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 text-xs sm:gap-3">
          {actions
            .filter((action) => action.visible)
            .map((action) => (
              <Button
                key={action.key}
                variant="link"
                onClick={action.onClick}
                aria-label={action.ariaLabel}
                className={`${ACTION_BASE} ${action.className}`}
              >
                {action.label}
              </Button>
            ))}
        </div>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-neutral-600 sm:text-sm">
        {addr.fullAddress}
      </p>
    </div>
  );
}
