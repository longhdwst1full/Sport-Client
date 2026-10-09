import { Clock, MapPin, Phone } from 'lucide-react';
import { STORE_SHOWROOMS } from '@/shared/constants';

export function ShowroomList() {
  return (
    <>
      <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50/80 px-3 py-0.5 text-xs font-black uppercase tracking-wider text-sky-700 shadow-2xs">
        <span className="size-1.5 rounded-full bg-sky-600 animate-pulse" />
        Hệ thống Showroom chính hãng
      </div>
      <div className="grid gap-4 sm:grid-cols-2 mt-3">
        {STORE_SHOWROOMS.map((s) => (
          <div
            key={s.name}
            className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs transition-all duration-300 hover:border-red-500/80 hover:shadow-xl hover:-translate-y-1"
          >
            <div>
              <span className="inline-block rounded-full border border-amber-300 bg-amber-100/90 px-3 py-0.5 text-xs font-black text-amber-900 shadow-2xs">
                {s.city}
              </span>
              <h3 className="mt-2.5 text-base font-black text-slate-900">{s.name}</h3>
              <p className="mt-1 text-xs font-bold text-red-600">
                {s.isHeadquarter ? 'Trụ sở chính & Kho trung tâm' : 'Chi nhánh miền Nam & Kho hàng'}
              </p>

              <address className="mt-4 space-y-2.5 text-xs not-italic text-slate-600 font-medium">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-red-500" aria-hidden />
                  <span className="leading-relaxed">{s.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="size-4 shrink-0 text-rose-500 animate-phone-ring" aria-hidden />
                  <strong className="text-slate-900 font-extrabold">{s.phone}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-4 shrink-0 text-sky-500" aria-hidden />
                  <span>{s.hours}</span>
                </div>
              </address>
            </div>

            <a
              href={`tel:${s.phoneRaw}`}
              aria-label={`Gọi ${s.name}: ${s.phone}`}
              className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 via-red-600 to-rose-600 py-2.5 text-xs font-black text-white shadow-md shadow-red-600/30 border border-red-500/30 transition-all duration-200 hover:from-red-700 hover:to-rose-700 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 focus-ring"
            >
              <Phone className="size-3.5 text-amber-300" />
              <span>Gọi showroom này</span>
            </a>
          </div>
        ))}
      </div>
    </>
  );
}
