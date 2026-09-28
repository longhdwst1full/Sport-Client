import { X } from 'lucide-react';
import { VietnamAddressSelector, type SelectedAddressData } from '@/features/address';
import type { AddressView } from '../model/address.mapper';

interface AddressFormDialogProps {
  editingAddress: AddressView | null;
  addressFormName: string;
  onAddressFormNameChange: (value: string) => void;
  addressFormPhone: string;
  onAddressFormPhoneChange: (value: string) => void;
  addressFormIsDefault: boolean;
  onAddressFormIsDefaultChange: (value: boolean) => void;
  modalAddressData: SelectedAddressData;
  onModalAddressDataChange: (data: SelectedAddressData) => void;
  addressMutating: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

/**
 * Add/edit address modal. Kept as its pre-existing markup rather than foundation's Modal
 * primitive — that primitive adds backdrop-click-close and dialog/aria-modal semantics this
 * dialog does not have today, so swapping it in would change behavior.
 */
export function AddressFormDialog({
  editingAddress,
  addressFormName,
  onAddressFormNameChange,
  addressFormPhone,
  onAddressFormPhoneChange,
  addressFormIsDefault,
  onAddressFormIsDefaultChange,
  modalAddressData,
  onModalAddressDataChange,
  addressMutating,
  onClose,
  onSubmit,
}: AddressFormDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-lg font-black text-slate-900">
            {editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ nhận hàng mới'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Tên người nhận *
              </label>
              <input
                type="text"
                required
                value={addressFormName}
                onChange={(e) => onAddressFormNameChange(e.target.value)}
                placeholder="Nguyễn Văn An"
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-medium text-slate-800 outline-none focus:border-emerald-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Số điện thoại *
              </label>
              <input
                type="tel"
                required
                value={addressFormPhone}
                onChange={(e) => onAddressFormPhoneChange(e.target.value)}
                placeholder="0912 345 678"
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-medium text-slate-800 outline-none focus:border-emerald-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Vietnam Cascading Address Selector Component */}
          <div className="border-y border-slate-100 py-4">
            <VietnamAddressSelector
              initialData={modalAddressData}
              onChange={onModalAddressDataChange}
              required
            />
          </div>

          {/* Default toggle — contract chưa có nhãn loại địa chỉ nên bỏ phần chọn nhãn. */}
          <div className="flex flex-wrap items-center justify-end gap-4 pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
              <input
                type="checkbox"
                checked={addressFormIsDefault}
                onChange={(e) => onAddressFormIsDefaultChange(e.target.checked)}
                className="size-4 rounded text-emerald-600"
              />
              <span>Đặt làm địa chỉ mặc định</span>
            </label>
          </div>

          {/* Modal Footer Buttons */}
          <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={addressMutating}
              className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {addressMutating ? 'Đang lưu…' : 'Lưu địa chỉ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
