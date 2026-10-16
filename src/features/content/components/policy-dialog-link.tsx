'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';
import { preloadOnIdle } from '@/shared/hooks';

// Modal chỉ hiện sau khi bấm link; chunk tải sẵn lúc trình duyệt rảnh nên lần mở đầu vẫn hiện ngay.
const loadPolicyDialog = () => import('./policy-dialog');
const PolicyDialog = dynamic(() => loadPolicyDialog().then((mod) => mod.PolicyDialog), { ssr: false });

/**
 * Link chính sách mở dạng modal để khách đọc ngay tại chỗ (vd. ô đồng ý điều khoản ở checkout) mà không
 * rời trang và mất dữ liệu đã nhập. Bài lấy từ CMS (`getPublishedPost`, bài `POLICY`) chỉ khi mở;
 * lỗi hoặc không phải bài chính sách thì đưa link mở trang đầy đủ.
 *
 * Modal render qua portal: nút này thường nằm trong `<label>` của checkbox, bấm trong modal không được
 * bật/tắt ô đồng ý.
 */
export function PolicyDialogLink({
  slug,
  title,
  children,
  className,
}: {
  slug: string;
  /** Tiêu đề dự phòng khi bài chưa tải xong hoặc tải lỗi. */
  title: string;
  children: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => preloadOnIdle(loadPolicyDialog), []);

  return (
    <>
      <button
        type="button"
        onClick={(event) => {
          // Nằm trong `<label>`: chặn để bấm link không đổi trạng thái checkbox.
          event.preventDefault();
          setOpen(true);
        }}
        className={className}
        aria-haspopup="dialog"
      >
        {children}
      </button>
      {open && createPortal(<PolicyDialog slug={slug} title={title} onClose={() => setOpen(false)} />, document.body)}
    </>
  );
}
