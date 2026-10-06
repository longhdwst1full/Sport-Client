import { Plus } from 'lucide-react';
import { Button } from '@/foundation/components/buttons';
import { InlineAlert, Skeleton } from '@/foundation/components/feedback';
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

        <Button
          onClick={onAdd}
          size="md"
          className="h-auto rounded-2xl py-2.5 text-xs font-bold shadow-md shadow-brand-600/20"
        >
          <Plus className="size-4" aria-hidden />
          <span>Thêm địa chỉ mới</span>
        </Button>
      </div>

      {/* Address List */}
      {addressesLoading && addresses.length === 0 ? (
        <div className="mt-6 space-y-4" aria-busy="true" aria-label="Đang tải sổ địa chỉ">
          {[0, 1].map((row) => (
            <div key={row} className="rounded-2xl border border-slate-200 p-5">
              <Skeleton className="h-4 w-40 rounded" />
              <Skeleton className="mt-3 h-3 w-full rounded bg-stone-100" />
            </div>
          ))}
        </div>
      ) : addressesError ? (
        <InlineAlert role="alert" className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-xs text-rose-700">
          <p className="font-bold">Không tải được sổ địa chỉ.</p>
          <button type="button" onClick={onRetry} className="mt-2 font-bold underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500">
            Thử lại
          </button>
        </InlineAlert>
      ) : addresses.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-600">
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
