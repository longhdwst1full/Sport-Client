import { cloneElement, isValidElement, useId, type ReactElement, type ReactNode } from 'react';

/**
 * Label + control wrapper. Kept intentionally minimal (label then control)
 * so a call site's exact previous label className/text can be reproduced —
 * it does not render its own error/hint slot because existing call sites all
 * render that separately (see `InlineAlert`).
 *
 * a11y: nhãn luôn gắn với control qua `htmlFor`/`id`. Control con giữ `id` riêng nếu đã có;
 * không có thì nhận id sinh bằng `useId` (chỉ áp cho một element con duy nhất).
 */
export function Field({
  label,
  labelClassName,
  htmlFor,
  labelAction,
  children,
}: {
  label: ReactNode;
  labelClassName?: string;
  /** id của control khi con không phải một element đơn (vd. bọc trong div). */
  htmlFor?: string;
  /** Hành động phụ nằm cùng hàng với nhãn (vd. link "Quên mật khẩu?"). */
  labelAction?: ReactNode;
  children: ReactNode;
}) {
  const generatedId = useId();
  const child = isValidElement<{ id?: string }>(children) ? (children as ReactElement<{ id?: string }>) : null;
  const controlId = htmlFor ?? child?.props.id ?? generatedId;
  const control = child && !htmlFor && !child.props.id ? cloneElement(child, { id: controlId }) : children;

  const labelNode = (
    <label htmlFor={controlId} className={labelClassName}>
      {label}
    </label>
  );
  return (
    <>
      {labelAction ? (
        <div className="flex items-center justify-between gap-3">
          {labelNode}
          {labelAction}
        </div>
      ) : (
        labelNode
      )}
      {control}
    </>
  );
}
