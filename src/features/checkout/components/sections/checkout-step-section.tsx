import type { ComponentType, ReactNode, SVGProps } from 'react';

/** Khung chung cho các bước 1–3 của checkout: thẻ trắng + số bước + tiêu đề có icon + mô tả ngắn. */
export function CheckoutStepSection({
  step,
  icon: Icon,
  title,
  description,
  children,
}: {
  step: number;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200/90 bg-white p-4 shadow-sm sm:p-6 transition hover:border-slate-300">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <span className="grid size-8 place-items-center rounded-xl bg-brand-600 text-sm font-black text-white shadow-sm shadow-brand-600/30">
          {step}
        </span>
        <div>
          <h2 className="flex items-center gap-2 text-base font-black text-slate-900 sm:text-lg">
            <Icon aria-hidden className="size-5 text-brand-600" /> {title}
          </h2>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}
