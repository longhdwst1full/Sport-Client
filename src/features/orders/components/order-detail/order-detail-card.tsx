import type { ComponentType, ReactNode, SVGProps } from 'react';

/** Thẻ khối của trang chi tiết đơn: icon trong ô màu brand + tiêu đề + mô tả, `action` nằm phải header. */
export function OrderDetailCard({
  icon: Icon,
  title,
  description,
  action,
  className = '',
  headerClassName = 'flex items-center justify-between',
  children,
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: ReactNode;
  action?: ReactNode;
  className?: string;
  headerClassName?: string;
  children: ReactNode;
}) {
  return (
    <section className={`surface-card p-6 sm:p-7 shadow-card transition-shadow hover:shadow-card-hover ${className}`}>
      <div className={`border-b border-neutral-100 pb-4 ${headerClassName}`}>
        <div className="flex items-center gap-2.5">
          <div className="grid size-9 place-items-center rounded-2xl bg-neutral-100 text-neutral-900">
            <Icon aria-hidden className="size-4.5" />
          </div>
          <div>
            <h2 className="text-base font-black text-neutral-900">{title}</h2>
            <p className="text-xs text-neutral-500">{description}</p>
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
