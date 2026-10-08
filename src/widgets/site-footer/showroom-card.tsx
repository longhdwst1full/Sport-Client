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
          <MapPin aria-hidden className="size-4 shrink-0 text-slate-300" />
          <span className="truncate">{showroom.name}</span>
        </span>
        <span className="shrink-0 whitespace-nowrap rounded border border-slate-700 bg-slate-800 px-2.5 py-0.5 text-xs font-bold text-slate-200">
          {showroom.badge}
        </span>
      </div>
      <address className="text-xs not-italic leading-relaxed text-slate-300 sm:text-[13px]">{showroom.address}</address>
      <div className="pt-1">
        <a
          href={`tel:${showroom.hotlineRaw}`}
          className="inline-flex min-h-10 items-center gap-1.5 text-sm font-bold text-white hover:text-slate-300 hover:underline"
        >
          <Phone aria-hidden className="size-3.5 text-slate-400" />
          Hotline: {showroom.hotlineDisplay}
        </a>
      </div>
    </div>
  );
}
