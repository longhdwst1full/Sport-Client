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
    <div className="space-y-2 rounded-2xl border border-neutral-800 bg-neutral-900 p-4 transition-colors hover:border-neutral-700">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-white flex items-center gap-1.5 min-w-0">
          <MapPin aria-hidden className="size-4 shrink-0 text-brand-400" />
          <span className="truncate">{showroom.name}</span>
        </span>
        <span className="shrink-0 whitespace-nowrap rounded-full bg-brand-500/15 px-2.5 py-0.5 text-2xs font-bold text-brand-300">
          {showroom.badge}
        </span>
      </div>
      <address className="text-xs not-italic leading-relaxed text-neutral-400">{showroom.address}</address>
      <div className="pt-0.5">
        <a
          href={`tel:${showroom.hotlineRaw}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-200 hover:text-white transition"
        >
          <Phone aria-hidden className="size-3.5 text-brand-400" />
          Hotline: {showroom.hotlineDisplay}
        </a>
      </div>
    </div>
  );
}
