import { Clock, MapPin, Phone } from 'lucide-react';
import { STORE_SHOWROOMS } from '@/shared/constants';

export function ShowroomList() {
  return (
    <>
      <h2 className="text-xl font-black text-ink">Hệ thống Showroom chính hãng</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {STORE_SHOWROOMS.map((s) => (
          <div
            key={s.name}
            className="flex flex-col justify-between rounded-3xl border border-stone-200/80 bg-white p-6 shadow-sm transition hover:border-brand-400 hover:shadow-md"
          >
            <div>
              <span className="inline-block rounded-full bg-stone-100 px-2.5 py-0.5 text-[10px] font-bold text-stone-600">
                {s.city}
              </span>
              <h3 className="mt-2 text-base font-black text-ink">{s.name}</h3>
              <p className="mt-1 text-xs font-semibold text-brand-700">
                {s.isHeadquarter ? 'Trụ sở chính & Kho trung tâm' : 'Chi nhánh miền Nam & Kho hàng'}
              </p>

              <address className="mt-4 space-y-2 text-xs not-italic text-stone-600">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden />
                  <span>{s.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="size-4 shrink-0 text-brand-600" aria-hidden />
                  <strong className="text-ink">{s.phone}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-4 shrink-0 text-brand-600" aria-hidden />
                  <span>{s.hours}</span>
                </div>
              </address>
            </div>

            <a
              href={`tel:${s.phoneRaw}`}
              aria-label={`Gọi ${s.name}: ${s.phone}`}
              className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-stone-100 py-2.5 text-xs font-bold text-ink transition hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              Gọi showroom này
            </a>
          </div>
        ))}
      </div>
    </>
  );
}
