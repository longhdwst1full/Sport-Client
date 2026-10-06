import { X } from 'lucide-react';
import { useId, useRef } from 'react';
import { useDialogA11y } from '@/foundation/components/overlay/use-dialog-a11y';
import { Button } from '@/foundation/components/buttons';
import { Field, TextInput } from '@/foundation/components/field-system';
import { VietnamAddressSelector } from '@/features/address';
import type { AddressFormValues, AddressView } from '../model/address.mapper';
import { PROFILE_LABEL_CLASS, PROFILE_SUBMIT_CLASS } from './profile-form-field';

interface AddressFormDialogProps {
  editingAddress: AddressView | null;
  form: AddressFormValues;
  onFormChange: (patch: Partial<AddressFormValues>) => void;
  addressMutating: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

/**
 * Add/edit address modal. Kept as its pre-existing markup rather than foundation's Modal
 * primitive — that primitive adds backdrop-click-close, which would discard a half-filled form on a
 * stray click. Dialog semantics, Escape, focus trap/restore come from `useDialogA11y` instead.
 */
export function AddressFormDialog({
  editingAddress,
  form,
  onFormChange,
  addressMutating,
  onClose,
  onSubmit,
}: AddressFormDialogProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const fieldId = useId();
  useDialogA11y(dialogRef, { onClose, disableClose: addressMutating, trapFocus: true });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="address-form-dialog-title"
        tabIndex={-1}
        className="w-full max-w-2xl rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-2xl sm:p-8 outline-none"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 id="address-form-dialog-title" className="text-lg font-black text-slate-900">
            {editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ nhận hàng mới'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="rounded-xl p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Field label="Tên người nhận *" labelClassName={PROFILE_LABEL_CLASS}>
                <TextInput
                  id={`${fieldId}-recipient`}
                  type="text"
                  required
                  autoComplete="name"
                  value={form.recipient}
                  onChange={(e) => onFormChange({ recipient: e.target.value })}
                  placeholder="Nguyễn Văn An"
                  size="md"
                  className="mt-1.5 font-medium"
                />
              </Field>
            </div>

            <div>
              <Field label="Số điện thoại *" labelClassName={PROFILE_LABEL_CLASS}>
                <TextInput
                  id={`${fieldId}-phone`}
                  type="tel"
                  required
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => onFormChange({ phone: e.target.value })}
                  placeholder="0912 345 678"
                  size="md"
                  className="mt-1.5 font-medium"
                />
              </Field>
            </div>
          </div>

          {/* Vietnam Cascading Address Selector Component */}
          <div className="border-y border-slate-100 py-4">
            <VietnamAddressSelector
              initialData={form.location}
              onChange={(location) => onFormChange({ location })}
              required
            />
          </div>

          {/* Default toggle — contract chưa có nhãn loại địa chỉ nên bỏ phần chọn nhãn. Chưa có primitive Checkbox. */}
          <div className="flex flex-wrap items-center justify-end gap-4 pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) => onFormChange({ isDefault: e.target.checked })}
                className="size-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <span>Đặt làm địa chỉ mặc định</span>
            </label>
          </div>

          {/* Modal Footer Buttons */}
          <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
            <Button
              variant="outline"
              size="md"
              onClick={onClose}
              className="h-auto border-slate-200 py-2.5 text-xs font-bold text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-600"
            >
              Hủy bỏ
            </Button>
            <Button type="submit" size="md" disabled={addressMutating} className={PROFILE_SUBMIT_CLASS}>
              {addressMutating ? 'Đang lưu…' : 'Lưu địa chỉ'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
