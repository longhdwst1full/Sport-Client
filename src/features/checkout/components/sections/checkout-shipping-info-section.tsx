import { LocateFixed, MapPin } from 'lucide-react';
import { VietnamAddressSelector } from '@/features/address';
import type { CustomerAddressDto } from '@/generated/api/customer/customer.schemas';
import type { CheckoutForm } from '../../hooks/use-checkout-form';
import { Button } from '@/foundation/components/buttons';
import { Field, Textarea, TextInput } from '@/foundation/components/field-system';
import { CheckoutStepSection, optionClass } from './checkout-step-section';

const FIELD_LABEL = 'block text-xs font-bold text-neutral-700';

/** Bước 1: người nhận, sổ địa chỉ (khách đã đăng nhập), địa chỉ hành chính, vị trí và ghi chú giao hàng. */
export function CheckoutShippingInfoSection({
  form,
  savedAddresses,
  applySavedAddress,
  onDeliverToOtherAddress,
  invalidateQuote,
  useCurrentLocation,
  freeRadiusKm,
}: {
  form: CheckoutForm;
  savedAddresses: CustomerAddressDto[] | undefined;
  applySavedAddress: (saved: CustomerAddressDto) => void;
  onDeliverToOtherAddress: () => void;
  invalidateQuote: () => void;
  useCurrentLocation: () => void;
  freeRadiusKm: number;
}) {
  const { name, setName, phone, setPhone, email, setEmail, note, setNote, address, setAddress, coordinates, addressFormKey, selectedAddressId } = form;

  return (
    <CheckoutStepSection step={1} icon={MapPin} title="Thông tin giao hàng" description="Người nhận và địa chỉ nhận hàng tận nơi">
      {savedAddresses && savedAddresses.length > 0 && (
        <div className="mt-5 space-y-2.5" role="radiogroup" aria-label="Địa chỉ đã lưu">
          <span className="block text-xs font-bold uppercase tracking-wider text-neutral-400">
            Sổ địa chỉ của bạn:
          </span>
          {savedAddresses.map((saved) => (
            <button
              key={saved.id}
              type="button"
              role="radio"
              aria-checked={selectedAddressId === saved.id}
              onClick={() => applySavedAddress(saved)}
              className={`w-full ${optionClass(selectedAddressId === saved.id)}`}
            >
              <span className="flex flex-wrap items-center justify-between gap-2">
                <strong className="text-sm font-bold text-neutral-900">{saved.recipient}</strong>
                <span className="text-xs font-bold text-neutral-500">{saved.phone}</span>
              </span>
              <span className="mt-1 block text-xs leading-5 text-neutral-600">
                {[saved.addressLine, saved.ward, saved.district, saved.province].filter(Boolean).join(', ')}
              </span>
              {saved.isDefault && (
                <span className="mt-1.5 inline-block rounded-full bg-neutral-100 px-2.5 py-0.5 text-3xs font-bold uppercase tracking-wider text-neutral-900">
                  Mặc định
                </span>
              )}
            </button>
          ))}
          <Button
            variant="outline"
            fullWidth
            onClick={onDeliverToOtherAddress}
            className="rounded-2xl border-dashed p-3 text-xs font-bold text-neutral-900 hover:border-neutral-400 hover:bg-neutral-50/50"
          >
            + Giao tới địa chỉ khác
          </Button>
        </div>
      )}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <Field label={<>Người nhận <span className="text-red-600">*</span></>} labelClassName={FIELD_LABEL}>
            <TextInput
              size="md"
              value={name}
              placeholder="Họ và tên người nhận"
              onChange={(e) => { setName(e.target.value); invalidateQuote(); }}
              autoComplete="name"
              className="mt-1.5"
            />
          </Field>
        </div>
        <div>
          <Field label={<>Số điện thoại <span className="text-red-600">*</span></>} labelClassName={FIELD_LABEL}>
            <TextInput
              size="md"
              value={phone}
              placeholder="Ví dụ: 0912345678"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              onChange={(e) => { setPhone(e.target.value); invalidateQuote(); }}
              className="mt-1.5"
            />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Email (nhận mã đơn và thông báo trạng thái giao hàng)" labelClassName={FIELD_LABEL}>
            <TextInput
              size="md"
              type="email"
              placeholder="email@example.com"
              value={email}
              autoComplete="email"
              onChange={(e) => { setEmail(e.target.value); invalidateQuote(); }}
              className="mt-1.5"
            />
          </Field>
        </div>
      </div>

      <div className="mt-5">
        <VietnamAddressSelector
          key={addressFormKey}
          initialData={address}
          onChange={(value) => { setAddress(value); invalidateQuote(); }}
          required
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={useCurrentLocation}
          className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-3.5 py-2 text-left text-xs font-bold transition focus-ring ${
            coordinates
              ? 'border-success-200 bg-success-50 text-success-800 hover:bg-success-100'
              : 'border-neutral-200 bg-neutral-50/50 text-neutral-950 hover:bg-neutral-100'
          }`}
        >
          <LocateFixed aria-hidden className={`size-4 shrink-0 ${coordinates ? 'text-success-600' : 'text-neutral-900'}`} />
          <span>{coordinates ? 'Đã lấy vị trí của bạn' : `Định vị vị trí hiện tại (Miễn phí nếu dưới ${freeRadiusKm} km)`}</span>
        </button>
      </div>

      <div className="mt-4">
        <Field label="Ghi chú giao hàng (tùy chọn)" labelClassName={FIELD_LABEL}>
          <Textarea
            rows={2}
            value={note}
            onChange={(e) => { setNote(e.target.value); invalidateQuote(); }}
            styled
            className="mt-1.5 min-h-16"
            placeholder="Gọi trước khi giao, giao giờ hành chính..."
          />
        </Field>
      </div>
    </CheckoutStepSection>
  );
}
