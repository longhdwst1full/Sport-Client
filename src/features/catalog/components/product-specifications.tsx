'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/foundation/components/buttons';
import { DescriptionList } from '@/foundation/components/structure';

export interface ProductSpecItem {
  label: string;
  value: string;
}

interface ProductSpecificationsProps {
  specs: ProductSpecItem[];
  initialLimit?: number;
}

export function ProductSpecifications({
  specs,
  initialLimit = 5,
}: ProductSpecificationsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!specs || specs.length === 0) return null;

  const hasMore = specs.length > initialLimit;
  const displayedSpecs = isExpanded ? specs : specs.slice(0, initialLimit);
  const remainingCount = specs.length - initialLimit;
  const ToggleIcon = isExpanded ? ChevronUp : ChevronDown;

  return (
    <div className="rounded-4xl border border-[var(--dc-border)] bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-ink sm:text-2xl">Thông số kỹ thuật chi tiết</h2>
        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-600">
          {specs.length} thông số
        </span>
      </div>

      <DescriptionList
        items={displayedSpecs.map(({ label, value }) => ({ key: label, label, value }))}
        className="mt-6 gap-0 divide-y divide-neutral-100 rounded-2xl border border-neutral-100 bg-neutral-50/50"
        itemClassName="grid grid-cols-1 gap-1 px-4 py-3.5 text-xs sm:grid-cols-[1fr_1.3fr] sm:gap-4 sm:px-6 sm:text-sm"
        labelClassName="font-bold text-neutral-500"
        valueClassName="font-semibold text-ink"
      />

      {hasMore && (
        <div className="mt-5 flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-expanded={isExpanded}
            className="rounded-full text-xs"
          >
            <span>{isExpanded ? 'Thu gọn thông số' : `Xem thêm thông số (${remainingCount} mục)`}</span>
            <ToggleIcon aria-hidden className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
