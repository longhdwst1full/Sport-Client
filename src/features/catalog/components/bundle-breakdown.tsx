import { CheckCircle2 } from 'lucide-react';
import { DescriptionList } from '@/foundation/components/structure';
import type { BundleComponentView } from '../model/product.mapper';

interface BundleBreakdownProps {
  components: BundleComponentView[];
}

export function BundleBreakdown({ components }: BundleBreakdownProps) {
  if (components.length === 0) return null;

  return (
    <div className="rounded-2xl border border-neutral-200/60 bg-neutral-50/40 p-4">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-950">
        <CheckCircle2 aria-hidden className="size-4 text-success-600" />
        <span>Combo này bao gồm các linh kiện:</span>
      </div>
      <DescriptionList
        layout="inline"
        className="mt-2.5 gap-y-1.5 text-xs text-neutral-700"
        itemClassName="items-center"
        labelClassName="font-semibold text-neutral-700"
        valueClassName="rounded bg-white px-2 py-0.5 text-2xs font-bold text-neutral-900 shadow-sm"
        items={components.map((component) => ({
          key: component.componentVariantId,
          label: component.componentName,
          value: `SL: ${component.quantity}`,
        }))}
      />
      <p className="mt-2 text-2xs text-neutral-500">
        * Combo được đóng gói nguyên đai kiện từ nhà sản xuất; khi bảo hành/đổi trả cần giữ nguyên phụ kiện.
      </p>
    </div>
  );
}
