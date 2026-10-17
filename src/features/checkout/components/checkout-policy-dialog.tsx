'use client';

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ArrowDown, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/foundation/components/buttons';
import { Modal } from '@/foundation/components/overlay';

/** Sai số (px) khi so "đã cuộn tới cuối": zoom/scroll lẻ pixel không bao giờ chạm đúng 0. */
const BOTTOM_TOLERANCE_PX = 8;

/**
 * Modal đọc điều khoản dịch vụ + chính sách đổi trả ở checkout. Phải cuộn tới cuối (hoặc bấm "Cuộn
 * xuống cuối") mới đóng được và mới bấm "Đồng ý"; "Đồng ý" = tích ô đồng ý (và tiếp tục đặt hàng khi
 * modal mở từ nút đặt hàng — `agreeLabel`).
 *
 * Nội dung là slot do route truyền vào (`PolicyArticles` của `content`). Khối đang tải đánh dấu
 * `aria-busy="true"`: lúc đó khung chờ ngắn không được tính là đã đọc hết.
 *
 * Render qua portal: link mở modal nằm trong `<label>` của checkbox, bấm trong modal không được bật/tắt ô.
 */
export function CheckoutPolicyDialog({
  content,
  agreeLabel,
  alreadyAccepted,
  onAgree,
  onClose,
}: {
  content: ReactNode;
  agreeLabel: string;
  /** Đã tích đồng ý từ trước: chỉ đọc lại, không bắt cuộn hết mới đóng. */
  alreadyAccepted: boolean;
  onAgree: () => void;
  onClose: () => void;
}) {
  const titleId = useId();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [reachedEnd, setReachedEnd] = useState(alreadyAccepted);
  const canClose = reachedEnd;

  const checkEnd = useCallback(() => {
    const el = scrollRef.current;
    if (!el || el.querySelector('[aria-busy="true"]')) return;
    if (el.scrollHeight - el.scrollTop - el.clientHeight <= BOTTOM_TOLERANCE_PX) setReachedEnd(true);
  }, []);

  // Nội dung tải xong đổi chiều cao (hoặc ngắn hơn khung: không có gì để cuộn) → kiểm tra lại.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || reachedEnd) return;
    checkEnd();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(checkEnd);
    observer.observe(el);
    if (el.firstElementChild) observer.observe(el.firstElementChild);
    const mutations = new MutationObserver(checkEnd);
    mutations.observe(el, { subtree: true, attributes: true, attributeFilter: ['aria-busy'], childList: true });
    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, [checkEnd, reachedEnd]);

  const scrollToEnd = () => {
    const el = scrollRef.current;
    el?.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  };

  return createPortal(
    <Modal
      onClose={onClose}
      disableClose={!canClose}
      labelledBy={titleId}
      backdropClassName="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4"
      className="flex max-h-[88dvh] w-full max-w-2xl flex-col rounded-t-2xl bg-white shadow-2xl outline-none sm:rounded-2xl"
    >
      <header className="flex items-start justify-between gap-3 border-b border-neutral-100 px-5 py-4 sm:px-6">
        <div className="min-w-0">
          <h2 id={titleId} className="text-base font-bold leading-snug text-ink sm:text-lg">
            Điều khoản dịch vụ & chính sách
          </h2>
          <p className="mt-0.5 text-xs text-neutral-500">
            {reachedEnd ? 'Bạn đã đọc hết nội dung.' : 'Vui lòng đọc hết nội dung (cuộn tới cuối) để tiếp tục.'}
          </p>
        </div>
        {canClose && (
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Đóng" className="-mr-2 shrink-0 text-neutral-500">
            <X className="size-5" aria-hidden />
          </Button>
        )}
      </header>

      <div className="relative min-h-0 flex-1">
        <div ref={scrollRef} onScroll={checkEnd} className="h-full max-h-[60dvh] overflow-y-auto overscroll-contain px-5 py-4 sm:px-6">
          {content}
        </div>
        {/* Gợi ý còn nội dung phía dưới. */}
        {!reachedEnd && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent"
          />
        )}
      </div>

      <footer className="flex flex-wrap items-center justify-end gap-2 border-t border-neutral-100 px-5 py-3 sm:px-6">
        {reachedEnd ? (
          <>
            <Button variant="ghost" size="md" onClick={onClose} className="px-4">
              Đóng
            </Button>
            <Button variant="cta" size="md" onClick={onAgree} className="flex-1 px-6 font-bold sm:flex-none">
              <CheckCircle2 className="size-4" aria-hidden />
              {agreeLabel}
            </Button>
          </>
        ) : (
          <Button variant="primary" size="md" onClick={scrollToEnd} className="flex-1 px-6 sm:flex-none">
            <ArrowDown className="size-4 animate-bounce" aria-hidden />
            Cuộn xuống cuối để đồng ý
          </Button>
        )}
      </footer>
    </Modal>,
    document.body,
  );
}
