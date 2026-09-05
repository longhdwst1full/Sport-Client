import type { ReactNode } from 'react';

export function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-5">
      <div>
        <p className="text-xs font-black uppercase tracking-[.2em] text-emerald-700">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}
