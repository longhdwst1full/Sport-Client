import { CheckCircle2 } from 'lucide-react';
import { DescriptionList } from '@/foundation/components/structure';
import type { BundleComponentView } from '../model/product.mapper';

interface BundleBreakdownProps {
  components: BundleComponentView[];
}

export function BundleBreakdown({ components }: BundleBreakdownProps) {
  if (components.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-slate-50/40 p-4">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-950">
        <CheckCircle2 aria-hidden className="size-4 text-success-600" />
        <span>Combo này bao gồm các linh kiện:</span>
      </div>
      <DescriptionList
        layout="inline"
        className="mt-2.5 gap-y-1.5 text-xs text-stone-700"
        itemClassName="items-center"
        labelClassName="font-semibold text-stone-700"
        valueClassName="rounded bg-white px-2 py-0.5 text-[11px] font-bold text-slate-900 shadow-sm"
        items={components.map((component) => ({
          key: component.componentVariantId,
          label: component.componentName,
          value: `SL: ${component.quantity}`,
        }))}
      />
      <p className="mt-2 text-[11px] text-stone-500">
        * Combo được đóng gói nguyên đai kiện từ nhà sản xuất; khi bảo hành/đổi trả cần giữ nguyên phụ kiện.
      </p>
    </div>
  );
}
