import { X } from 'lucide-react';
import { useRef, type ComponentType, type ReactNode, type SVGProps } from 'react';
import { Button } from '@/foundation/components/buttons';
import { useDialogA11y } from '@/foundation/components/overlay/use-dialog-a11y';

/**
 * Khung hộp thoại của trang chi tiết đơn (hủy đơn, hỗ trợ): nền mờ, bẫy focus, header icon + tiêu đề +
 * nút đóng. `closeDisabled` khoá cả Escape lẫn nút X (vd. khi lệnh hủy đang chạy).
 */
export function OrderDialogShell({
  titleId,
  title,
  subtitle,
  icon: Icon,
  iconClassName,
  className,
  onClose,
  closeDisabled = false,
  children,
}: {
  titleId: string;
  title: ReactNode;
  subtitle: ReactNode;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  /** Màu ô icon, vd. `bg-rose-100 text-rose-600`. */
  iconClassName: string;
  /** Độ rộng tối đa của hộp, vd. `max-w-lg`. */
  className: string;
  onClose: () => void;
  closeDisabled?: boolean;
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  useDialogA11y(dialogRef, { onClose, disableClose: closeDisabled, trapFocus: true });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`relative w-full rounded-3xl border border-slate-100 bg-white p-6 sm:p-7 shadow-2xl animate-fade-in-up outline-none ${className}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`grid size-11 place-items-center rounded-2xl ${iconClassName}`}>
              <Icon aria-hidden className="size-5.5" />
            </div>
            <div>
              <h2 id={titleId} className="text-base font-black text-slate-900">{title}</h2>
              <p className="text-xs text-slate-500">{subtitle}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={closeDisabled}
            aria-label="Đóng"
            className="-m-1.5 text-slate-400 hover:text-slate-700"
          >
            <X aria-hidden className="size-5" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
