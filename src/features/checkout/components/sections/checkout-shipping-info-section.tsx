import { LocateFixed, MapPin } from 'lucide-react';
import { VietnamAddressSelector } from '@/features/address';
import type { CustomerAddressDto } from '@/generated/api/customer/customer.schemas';
import type { CheckoutForm } from '../../hooks/use-checkout-form';
import { inputClass, optionClass } from './checkout-section.styles';

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
    <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm transition hover:border-slate-300">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <span className="grid size-8 place-items-center rounded-xl bg-emerald-600 text-sm font-black text-white shadow-sm shadow-emerald-600/30">
          1
        </span>
        <div>
          <h2 className="flex items-center gap-2 text-base font-black text-slate-900 sm:text-lg">
            <MapPin className="size-5 text-emerald-600" /> Thông tin giao hàng
          </h2>
          <p className="text-xs text-slate-500">Người nhận và địa chỉ nhận hàng tận nơi</p>
        </div>
      </div>

      {savedAddresses && savedAddresses.length > 0 && (
        <div className="mt-5 space-y-2.5" role="radiogroup" aria-label="Địa chỉ đã lưu">
          <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
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
                <strong className="text-sm font-bold text-slate-900">{saved.recipient}</strong>
                <span className="text-xs font-bold text-slate-500">{saved.phone}</span>
              </span>
              <span className="mt-1 block text-xs leading-5 text-slate-600">
                {[saved.addressLine, saved.ward, saved.district, saved.province].filter(Boolean).join(', ')}
              </span>
              {saved.isDefault && (
                <span className="mt-1.5 inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-700">
                  Mặc định
                </span>
              )}
            </button>
          ))}
          <button
            type="button"
            onClick={onDeliverToOtherAddress}
            className="w-full rounded-2xl border border-dashed border-slate-300 p-3 text-xs font-bold text-emerald-700 hover:border-emerald-400 hover:bg-emerald-50/50 transition"
          >
            + Giao tới địa chỉ khác
          </button>
        </div>
      )}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="text-xs font-bold text-slate-700">
          Người nhận <span className="text-rose-600">*</span>
          <input
            value={name}
            placeholder="Họ và tên người nhận"
            onChange={(e) => { setName(e.target.value); invalidateQuote(); }}
            autoComplete="name"
            className={inputClass}
          />
        </label>
        <label className="text-xs font-bold text-slate-700">
          Số điện thoại <span className="text-rose-600">*</span>
          <input
            value={phone}
            placeholder="Ví dụ: 0912345678"
            inputMode="tel"
            autoComplete="tel"
            onChange={(e) => { setPhone(e.target.value); invalidateQuote(); }}
            className={inputClass}
          />
        </label>
        <label className="text-xs font-bold text-slate-700 sm:col-span-2">
          Email (nhận mã đơn và thông báo trạng thái giao hàng)
          <input
            type="email"
            placeholder="email@example.com"
            value={email}
            autoComplete="email"
            onChange={(e) => { setEmail(e.target.value); invalidateQuote(); }}
            className={inputClass}
          />
        </label>
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
          className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/50 px-3.5 py-2 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100"
        >
          <LocateFixed className="size-4 text-emerald-600" />
          <span>{coordinates ? 'Đã lấy vị trí của bạn' : `Định vị vị trí hiện tại (Miễn phí nếu dưới ${freeRadiusKm} km)`}</span>
        </button>
      </div>

      <label className="mt-4 block text-xs font-bold text-slate-700">
        Ghi chú giao hàng (tùy chọn)
        <textarea
          rows={2}
          value={note}
          onChange={(e) => { setNote(e.target.value); invalidateQuote(); }}
          className={inputClass}
          placeholder="Gọi trước khi giao, giao giờ hành chính..."
        />
      </label>
    </section>
  );
}
