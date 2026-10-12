'use client';

import { useId, useMemo, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { ExternalLink, X } from 'lucide-react';
import { Button } from '@/foundation/components/buttons';
import { SkeletonText } from '@/foundation/components/feedback';
import { Modal } from '@/foundation/components/overlay';
import { useGetPublishedPost } from '@/generated/api/content/content';
import { CACHE_POLICY } from '@/lib/query/query-cache-policy';
import { isPolicyPost, toPolicyDetailView } from '../model/policy.mapper';
import { PolicyBody } from './policy-body';

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

function PolicyDialog({ slug, title, onClose }: { slug: string; title: string; onClose: () => void }) {
  const titleId = useId();
  const query = useGetPublishedPost(slug, { query: { ...CACHE_POLICY.LOOKUP, retry: 1 } });
  const policy = useMemo(
    () => (query.data && isPolicyPost(query.data) ? toPolicyDetailView(query.data) : undefined),
    [query.data],
  );
  const href = `/chinh-sach/${slug}`;
  const failed = query.isError || (query.isSuccess && !policy);

  return (
    <Modal
      onClose={onClose}
      labelledBy={titleId}
      backdropClassName="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4"
      className="flex max-h-[85dvh] w-full max-w-2xl flex-col rounded-t-2xl bg-white shadow-2xl outline-none sm:rounded-2xl"
    >
      <header className="flex items-start justify-between gap-3 border-b border-neutral-100 px-5 py-4 sm:px-6">
        <div className="min-w-0">
          <h2 id={titleId} className="text-base font-bold leading-snug text-ink sm:text-lg">
            {policy?.title ?? title}
          </h2>
          {policy && <p className="mt-0.5 text-xs text-neutral-500">Cập nhật {policy.updatedLabel}</p>}
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Đóng" className="-mr-2 shrink-0 text-neutral-500">
          <X className="size-5" aria-hidden />
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 sm:px-6">
        {policy ? (
          <PolicyBody
            paragraphs={policy.paragraphs}
            className="space-y-3 text-sm leading-7 text-neutral-700"
            headingClassName="pt-2 text-sm font-bold text-ink"
          />
        ) : failed ? (
          <p role="alert" className="text-sm text-neutral-700">
            Chưa tải được nội dung. Bạn có thể mở trang chính sách đầy đủ ở tab mới.
          </p>
        ) : (
          <div aria-busy="true" aria-label="Đang tải nội dung">
            <SkeletonText lines={8} />
          </div>
        )}
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 px-5 py-3 sm:px-6">
        <Link href={href} target="_blank" rel="noopener" className="text-link inline-flex items-center gap-1 text-xs font-semibold">
          Mở trang đầy đủ <ExternalLink className="size-3.5" aria-hidden />
        </Link>
        <Button variant="primary" size="md" onClick={onClose} className="px-6">
          Đã hiểu
        </Button>
      </footer>
    </Modal>
  );
}

