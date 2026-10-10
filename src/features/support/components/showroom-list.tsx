import { Clock, MapPin, Phone } from 'lucide-react';
import { buttonVariants } from '@/foundation/components/buttons';
import { STORE_SHOWROOMS } from '@/shared/constants';

export function ShowroomList() {
  return (
    <>
      <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50/80 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-neutral-700 shadow-2xs">
        <span className="size-1.5 rounded-full bg-neutral-600 animate-pulse" />
        Hệ thống Showroom chính hãng
      </div>
      <div className="grid gap-4 sm:grid-cols-2 mt-3">
        {STORE_SHOWROOMS.map((s) => (
          <div
            key={s.name}
            className="flex flex-col justify-between rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-xs transition-all duration-300 hover:border-neutral-400 hover:shadow-xl hover:-translate-y-1"
          >
            <div>
              <span className="inline-block rounded-full border border-amber-300 bg-amber-100/90 px-3 py-0.5 text-xs font-bold text-amber-900 shadow-2xs">
                {s.city}
              </span>
              <h3 className="mt-2.5 text-base font-bold text-neutral-900">{s.name}</h3>
              <p className="mt-1 text-xs font-semibold text-neutral-600">
                {s.isHeadquarter ? 'Trụ sở chính & Kho trung tâm' : 'Chi nhánh miền Nam & Kho hàng'}
              </p>

              <address className="mt-4 space-y-2.5 text-xs not-italic text-neutral-600 font-medium">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-neutral-500" aria-hidden />
                  <span className="leading-relaxed">{s.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="size-4 shrink-0 text-neutral-700 animate-phone-ring" aria-hidden />
                  <strong className="text-neutral-900 font-semibold">{s.phone}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-4 shrink-0 text-neutral-500" aria-hidden />
                  <span>{s.hours}</span>
                </div>
              </address>
            </div>

            <a
              href={`tel:${s.phoneRaw}`}
              aria-label={`Gọi ${s.name}: ${s.phone}`}
              className={buttonVariants({
                variant: 'secondary',
                fullWidth: true,
                className: 'mt-6 gap-2 text-xs font-bold',
              })}
            >
              <Phone className="size-4" aria-hidden="true" />
              <span>Gọi showroom này</span>
            </a>
          </div>
        ))}
      </div>
    </>
  );
}
