import { CheckCircle2 } from 'lucide-react';
import type { BundleComponentView } from '../model/product.mapper';

interface BundleBreakdownProps {
  components: BundleComponentView[];
}

export function BundleBreakdown({ components }: BundleBreakdownProps) {
  if (components.length === 0) return null;

  return (
    <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/40 p-4">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
        <CheckCircle2 className="size-4 text-emerald-600" />
        <span>Combo này bao gồm các linh kiện:</span>
      </div>
      <ul className="mt-2.5 space-y-1.5 text-xs text-stone-700">
        {components.map((component) => (
          <li key={component.componentVariantId} className="flex items-center justify-between">
            <span className="font-semibold">{component.componentName}</span>
            <span className="rounded bg-white px-2 py-0.5 text-[11px] font-bold text-emerald-700 shadow-sm">
              SL: {component.quantity}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[11px] text-stone-500">
        * Combo được đóng gói nguyên đai kiện từ nhà sản xuất; khi bảo hành/đổi trả cần giữ nguyên phụ kiện.
      </p>
    </div>
  );
}
