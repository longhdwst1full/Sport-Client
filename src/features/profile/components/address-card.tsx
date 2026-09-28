import type { AddressView } from '../model/address.mapper';

interface AddressCardProps {
  addr: AddressView;
  canDelete: boolean;
  onSetDefault: (addr: AddressView) => void;
  onEdit: (addr: AddressView) => void;
  onDelete: (id: string) => void;
}

export function AddressCard({ addr, canDelete, onSetDefault, onEdit, onDelete }: AddressCardProps) {
  return (
    <div
      className={`relative rounded-2xl border p-5 transition ${
        addr.isDefault
          ? 'border-2 border-emerald-500/60 bg-emerald-50/20 shadow-sm'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <strong className="text-sm font-bold text-slate-900">{addr.recipient}</strong>
          <span className="text-xs text-slate-400">· {addr.phone}</span>
          {addr.isDefault && (
            <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-black uppercase text-white">
              Mặc định
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 text-xs">
          {!addr.isDefault && (
            <button
              type="button"
              onClick={() => onSetDefault(addr)}
              className="font-bold text-emerald-700 hover:underline"
            >
              Đặt làm mặc định
            </button>
          )}
          <button
            type="button"
            onClick={() => onEdit(addr)}
            className="font-bold text-slate-600 hover:text-slate-900"
          >
            Sửa
          </button>
          {canDelete && (
            <button
              type="button"
              onClick={() => onDelete(addr.id)}
              className="font-bold text-rose-600 hover:underline"
            >
              Xóa
            </button>
          )}
        </div>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
        {addr.fullAddress}
      </p>
    </div>
  );
}
