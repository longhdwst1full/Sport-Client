import { Plus } from 'lucide-react';
import { AddressCard } from './address-card';
import type { AddressView } from '../model/address.mapper';

interface AddressBookPanelProps {
  addresses: AddressView[];
  addressesLoading: boolean;
  addressesError: boolean;
  onRetry: () => void;
  onAdd: () => void;
  onEdit: (addr: AddressView) => void;
  onDelete: (id: string) => void;
  onSetDefault: (addr: AddressView) => void;
}

export function AddressBookPanel({
  addresses,
  addressesLoading,
  addressesError,
  onRetry,
  onAdd,
  onEdit,
  onDelete,
  onSetDefault,
}: AddressBookPanelProps) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-xl font-black text-slate-900">Sổ địa chỉ nhận hàng</h2>
          <p className="mt-1 text-xs text-slate-500">
            Quản lý các địa chỉ giao hàng và lắp đặt thiết bị tận nơi
          </p>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-500"
        >
          <Plus className="size-4" />
          <span>Thêm địa chỉ mới</span>
        </button>
      </div>

      {/* Address List */}
      {addressesLoading && addresses.length === 0 ? (
        <div className="mt-6 space-y-4" aria-busy="true">
          {[0, 1].map((row) => (
            <div key={row} className="rounded-2xl border border-slate-200 p-5">
              <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
              <div className="mt-3 h-3 w-full animate-pulse rounded bg-slate-100" />
            </div>
          ))}
        </div>
      ) : addressesError ? (
        <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-xs text-rose-700">
          <p className="font-bold">Không tải được sổ địa chỉ.</p>
          <button type="button" onClick={onRetry} className="mt-2 font-bold underline">
            Thử lại
          </button>
        </div>
      ) : addresses.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-500">
          Chưa có địa chỉ nhận hàng nào. Thêm địa chỉ để thanh toán nhanh hơn.
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              addr={addr}
              canDelete={addresses.length > 1}
              onSetDefault={onSetDefault}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
