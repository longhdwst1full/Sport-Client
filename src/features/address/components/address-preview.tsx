import { MapPin } from 'lucide-react';

interface AddressPreviewProps {
  streetAddress: string;
  wardName: string;
  districtName: string;
  provinceName: string;
}

export function AddressPreview({ streetAddress, wardName, districtName, provinceName }: AddressPreviewProps) {
  if (!provinceName && !streetAddress) return null;

  return (
    <div className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 border border-slate-200/70">
      <MapPin className="size-4 shrink-0 text-emerald-600 mt-0.5" />
      <div>
        <span className="font-bold text-slate-700">Địa chỉ đầy đủ: </span>
        <span className="font-semibold text-slate-900">
          {[streetAddress.trim(), wardName, districtName, provinceName]
            .filter(Boolean)
            .join(', ') || 'Chưa nhập địa chỉ đầy đủ'}
        </span>
      </div>
    </div>
  );
}
