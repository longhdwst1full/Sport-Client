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
    <div className="rounded-2xl border border-slate-800/90 bg-slate-900/70 p-4 space-y-2 transition-all hover:border-slate-700/90 hover:bg-slate-900/90 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-extrabold text-white flex items-center gap-1.5 min-w-0">
          <MapPin aria-hidden className="size-4 shrink-0 text-red-500" />
          <span className="truncate">{showroom.name}</span>
        </span>
        <span className="shrink-0 whitespace-nowrap rounded-md border border-amber-400/30 bg-amber-500/15 px-2.5 py-0.5 text-2xs font-black text-amber-300">
          {showroom.badge}
        </span>
      </div>
      <address className="text-xs not-italic leading-relaxed text-slate-300 font-medium sm:text-[13px]">{showroom.address}</address>
      <div className="pt-0.5">
        <a
          href={`tel:${showroom.hotlineRaw}`}
          className="inline-flex items-center gap-1.5 text-xs font-black text-red-400 hover:text-red-300 transition"
        >
          <Phone aria-hidden className="size-3.5 text-red-500 animate-phone-ring" />
          Hotline: {showroom.hotlineDisplay}
        </a>
      </div>
    </div>
  );
}
