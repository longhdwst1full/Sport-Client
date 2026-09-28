import { Mail, Phone } from 'lucide-react';
import { STORE_CONTACT } from '@/shared/constants';

export function SupportContacts() {
  return (
    <div className="rounded-3xl bg-ink p-8 text-white">
      <h3 className="text-lg font-black text-white">Tổng đài hỗ trợ toàn quốc</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-emerald-400 text-ink">
            <Phone className="size-5" />
          </span>
          <div>
            <span className="block text-xs text-white/60">Hotline tư vấn (08:30 - 21:30)</span>
            <strong className="text-base text-white">{STORE_CONTACT.primaryHotline}</strong>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-emerald-400 text-ink">
            <Mail className="size-5" />
          </span>
          <div>
            <span className="block text-xs text-white/60">Email liên hệ</span>
            <strong className="text-base text-white">{STORE_CONTACT.email}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
