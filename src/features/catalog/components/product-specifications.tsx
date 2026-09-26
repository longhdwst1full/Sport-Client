'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

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

  return (
    <div className="rounded-[28px] border border-[var(--dc-border)] bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-black text-ink sm:text-2xl">Thông số kỹ thuật chi tiết</h2>
        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-600">
          {specs.length} thông số
        </span>
      </div>

      <div className="mt-6 divide-y divide-stone-100 rounded-2xl border border-stone-100 bg-stone-50/50">
        {displayedSpecs.map(({ label, value }) => (
          <div
            key={label}
            className="grid grid-cols-1 gap-1 px-4 py-3.5 text-xs sm:grid-cols-[1fr_1.3fr] sm:gap-4 sm:px-6 sm:text-sm"
          >
            <span className="font-bold text-stone-500">{label}</span>
            <span className="font-semibold text-ink">{value}</span>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-expanded={isExpanded}
            className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-5 py-2.5 text-xs font-bold text-stone-700 shadow-sm transition hover:border-emerald-500 hover:bg-emerald-50/50 hover:text-emerald-700 active:scale-95"
          >
            {isExpanded ? (
              <>
                <span>Thu gọn thông số</span>
                <ChevronUp className="size-4" />
              </>
            ) : (
              <>
                <span>Xem thêm thông số ({remainingCount} mục)</span>
                <ChevronDown className="size-4" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
