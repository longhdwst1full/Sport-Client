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
    <div className="flex items-start gap-2 rounded-xl bg-neutral-50 p-3 text-xs text-neutral-600 border border-neutral-200/70">
      <MapPin className="mt-0.5 size-4 shrink-0 text-neutral-900" aria-hidden />
      <div>
        <span className="font-bold text-neutral-700">Địa chỉ đầy đủ: </span>
        <span className="font-semibold text-neutral-900">
          {[streetAddress.trim(), wardName, districtName, provinceName]
            .filter(Boolean)
            .join(', ') || 'Chưa nhập địa chỉ đầy đủ'}
        </span>
      </div>
    </div>
  );
}
