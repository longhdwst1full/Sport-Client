import type { ElementType, ReactNode } from 'react';

export type StateBlockProps = {
  as?: ElementType;
  className?: string;
  iconWrapClassName?: string;
  icon?: ReactNode;
  titleAs?: ElementType;
  titleClassName?: string;
  title: ReactNode;
  descriptionClassName?: string;
  description?: ReactNode;
  actions?: ReactNode;
  /** Vd. `alert` cho khối lỗi cần đọc ngay, `status` cho thông báo không khẩn. */
  role?: 'alert' | 'status';
};

/**
 * Khung chung cho `EmptyState`/`ErrorState`: icon + tiêu đề + mô tả + hành động.
 * Caller truyền class nào thì dùng đúng class đó (giữ markup cũ khi chuyển đổi); bỏ trống thì
 * dùng style mặc định của tone để chỗ mới không phải viết lại cả chuỗi class.
 */
function StateBlock({
  as: Tag = 'div',
  className,
  iconWrapClassName,
  icon,
  titleAs: TitleTag = 'h2',
  titleClassName,
  title,
  descriptionClassName,
  description,
  actions,
  role,
  tone,
}: StateBlockProps & { tone: 'neutral' | 'error' }) {
  return (
    <Tag role={role} className={className ?? 'mx-auto flex max-w-md flex-col items-center px-4 py-12 text-center'}>
      {icon ? (
        <div
          className={
            iconWrapClassName ??
            `mb-4 grid size-14 place-items-center rounded-2xl ${tone === 'error' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'}`
          }
        >
          {icon}
        </div>
      ) : null}
      <TitleTag className={titleClassName ?? 'text-lg font-bold text-slate-900'}>{title}</TitleTag>
      {description ? (
        <p className={descriptionClassName ?? 'mt-2 text-sm text-slate-600'}>{description}</p>
      ) : null}
      {/* Chỉ bọc hàng nút ở chế độ mặc định; caller tự truyền className thì tự lo bố cục actions như cũ. */}
      {actions && className === undefined ? (
        <div className="mt-6 flex flex-wrap justify-center gap-3">{actions}</div>
      ) : (
        actions
      )}
    </Tag>
  );
}

/** Khối "chưa có gì ở đây". */
export function EmptyState(props: StateBlockProps) {
  return <StateBlock tone="neutral" {...props} />;
}

/** Khối lỗi (tải thất bại / không có quyền); mặc định `section` + `h1` vì thường thay cả trang. */
export function ErrorState({ as = 'section', titleAs = 'h1', ...props }: StateBlockProps) {
  return <StateBlock tone="error" as={as} titleAs={titleAs} {...props} />;
}
