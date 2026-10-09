import { Mail, Phone } from 'lucide-react';
import { STORE_CONTACT } from '@/shared/constants';

export function SupportContacts() {
  return (
    <div className="rounded-3xl bg-ink p-8 text-white">
      <h3 className="text-lg font-black text-white">Tổng đài hỗ trợ toàn quốc</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-neutral-900 text-white">
            <Phone className="size-5" aria-hidden />
          </span>
          <div>
            <span className="block text-xs text-white/75">Hotline tư vấn (08:30 - 21:30)</span>
            <a href={`tel:${STORE_CONTACT.primaryHotlineRaw}`} className="rounded text-base font-bold text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">{STORE_CONTACT.primaryHotline}</a>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-neutral-900 text-white">
            <Mail className="size-5" aria-hidden />
          </span>
          <div>
            <span className="block text-xs text-white/75">Email liên hệ</span>
            <a href={`mailto:${STORE_CONTACT.email}`} className="break-all rounded text-base font-bold text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">{STORE_CONTACT.email}</a>
          </div>
        </div>
      </div>
    </div>
  );
}
