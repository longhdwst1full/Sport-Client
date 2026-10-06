import { LoaderCircle } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

/**
 * Icon xoay "đang tải" dùng chung. Tự gắn `animate-spin` (caller cũ vẫn truyền `animate-spin`, twMerge gộp
 * nên không trùng) và mặc định `aria-hidden`: trạng thái đọc cho trình đọc màn hình do nơi gọi đặt bằng
 * `role="status"`/`aria-busy`/chữ đi kèm, không phải icon.
 */
export function Spinner({ className, 'aria-hidden': ariaHidden = true }: { className?: string; 'aria-hidden'?: boolean }) {
  return <LoaderCircle aria-hidden={ariaHidden} className={twMerge('animate-spin', className)} />;
}
