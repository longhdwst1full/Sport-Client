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
        <p className="eyebrow text-neutral-900">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl lg:text-4xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}
