import type { ComponentType, ReactNode, SVGProps } from 'react';

/** Thẻ lựa chọn (địa chỉ, phương thức giao/thanh toán) dùng chung cho các section. */
export const optionClass = (selected: boolean) =>
  `rounded-2xl border p-4 text-left transition ${selected ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900' : 'border-neutral-200 hover:border-neutral-300'} focus-ring`;

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
    <section className="surface-card p-4 shadow-sm sm:p-6 transition hover:border-neutral-300">
      <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
        <span className="grid size-8 place-items-center rounded-xl bg-neutral-900 text-sm font-bold text-white shadow-sm shadow-neutral-900/30">
          {step}
        </span>
        <div>
          <h2 className="flex items-center gap-2 text-base font-bold text-neutral-900 sm:text-lg">
            <Icon aria-hidden className="size-5 text-neutral-900" /> {title}
          </h2>
          <p className="text-xs text-neutral-500">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}
