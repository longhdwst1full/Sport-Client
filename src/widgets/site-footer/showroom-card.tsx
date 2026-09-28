import { MapPin, Phone } from 'lucide-react';

export interface ShowroomCardData {
  name: string;
  badge: string;
  address: string;
  hotlineRaw: string;
  hotlineDisplay: string;
}

export function ShowroomCard({ showroom }: { showroom: ShowroomCardData }) {
  return (
    <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-4 space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-bold text-white flex items-center gap-1.5 min-w-0">
          <MapPin className="size-4 text-emerald-400 shrink-0" />
          <span className="truncate">{showroom.name}</span>
        </span>
        <span className="shrink-0 whitespace-nowrap rounded bg-emerald-950 px-2.5 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-800/40">
          {showroom.badge}
        </span>
      </div>
      <p className="text-xs sm:text-[13px] leading-relaxed text-slate-300">{showroom.address}</p>
      <div className="pt-1">
        <a
          href={`tel:${showroom.hotlineRaw}`}
          className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-emerald-400 hover:underline"
        >
          <Phone className="size-3.5" />
          Hotline: {showroom.hotlineDisplay}
        </a>
      </div>
    </div>
  );
}
