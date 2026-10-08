'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { Button } from '@/foundation/components/buttons';

interface ProductDescriptionCollapsibleProps {
  shortDescription?: string | null;
  longDescriptionHtml?: string | null;
}

export function ProductDescriptionCollapsible({
  shortDescription,
  longDescriptionHtml,
}: ProductDescriptionCollapsibleProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!shortDescription && !longDescriptionHtml) return null;

  return (
    <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
        <span className="grid size-9 place-items-center rounded-xl bg-red-50 text-red-600">
          <FileText className="size-4.5" aria-hidden="true" />
        </span>
        <h2 className="text-xl font-black text-ink sm:text-2xl">Mô tả sản phẩm</h2>
      </div>

      <div className={`relative transition-all duration-300 ${!isExpanded ? 'max-h-64 overflow-hidden' : ''}`}>
        {shortDescription && (
          <p className="mt-4 text-base font-medium leading-relaxed text-slate-700 sm:text-lg">
            {shortDescription}
          </p>
        )}

        {longDescriptionHtml && (
          <div
            className="mt-4 break-words text-sm leading-relaxed text-slate-600 sm:text-base [&_a]:text-brand-600 [&_a]:font-semibold [&_a]:underline [&_h2]:mt-6 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-ink [&_h3]:mt-4 [&_h3]:font-bold [&_h3]:text-ink [&_iframe]:my-4 [&_iframe]:aspect-video [&_iframe]:h-auto [&_iframe]:w-full [&_iframe]:max-w-full [&_iframe]:rounded-2xl [&_img]:my-4 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-2xl [&_li]:mt-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mt-3 [&_table]:my-4 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-slate-200 [&_td]:p-2 [&_th]:border [&_th]:border-slate-200 [&_th]:p-2 [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: longDescriptionHtml }}
          />
        )}

        {/* Gradient fade overlay when collapsed */}
        {!isExpanded && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent"
          />
        )}
      </div>

      {/* Expand / Collapse Button */}
      <div className="mt-4 flex justify-center pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="rounded-full px-5 text-xs font-bold text-slate-800 hover:border-slate-400 hover:bg-slate-50 shadow-2xs"
        >
          {isExpanded ? (
            <>
              Thu gọn nội dung <ChevronUp className="size-3.5 ml-1" />
            </>
          ) : (
            <>
              Xem thêm chi tiết <ChevronDown className="size-3.5 ml-1" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
