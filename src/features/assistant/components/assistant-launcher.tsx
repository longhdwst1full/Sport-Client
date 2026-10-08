'use client';

import { useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { Bot, X } from 'lucide-react';
import { Button } from '@/foundation/components/buttons';
import { Spinner } from '@/foundation/components/feedback';
import { ASSISTANT_DIALOG_ID, ASSISTANT_TITLE } from '../model/assistant.constants';

/**
 * Chỉ nút launcher nằm trong bundle đầu trang. Panel, hook dữ liệu, card sản phẩm... nằm ở chunk riêng
 * và chỉ tải khi khách bấm mở lần đầu (`ssr: false` vì widget đọc localStorage và không cần HTML server).
 */
const AssistantPanelHost = dynamic(() => import('./assistant-panel-host').then((mod) => mod.AssistantPanelHost), {
  ssr: false,
  loading: () => (
    <div role="status" className="fixed bottom-20 right-5 z-[60] grid size-12 place-items-center rounded-2xl bg-white shadow-xl">
      <Spinner className="size-5 animate-spin text-slate-900" />
      <span className="sr-only">Đang mở trợ lý mua sắm</span>
    </div>
  ),
});

/**
 * Trang có thanh hành động dính đáy trên mobile (chi tiết sản phẩm, checkout): nút nổi z-50 đè lên nút
 * mua/đặt hàng nên ẩn dưới `lg` — cùng quy tắc `MOBILE_HIDDEN_ROUTES` của FloatingContactBar.
 */
const MOBILE_HIDDEN_ROUTES: readonly RegExp[] = [/^\/products\/[^/]+\/?$/, /^\/checkout(\/|$)/];

export function AssistantLauncher() {
  const pathname = usePathname();
  const hideOnMobile = MOBILE_HIDDEN_ROUTES.some((pattern) => pattern.test(pathname ?? ''));
  const [open, setOpen] = useState(false);
  // Chỉ tải chunk panel sau lần bấm đầu tiên; sau đó giữ mount để không mất hội thoại khi đóng/mở.
  const [requested, setRequested] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <Button
        onClick={() => {
          setRequested(true);
          setOpen((value) => !value);
        }}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? ASSISTANT_DIALOG_ID : undefined}
        aria-label={open ? 'Đóng trợ lý mua sắm' : 'Mở trợ lý mua sắm'}
        // Nút dưới cùng của cột nút nổi (FloatingContactBar xếp ngay phía trên), có safe-area iOS. Chỉ icon
        // (tên nằm ở aria-label + tooltip) để không thành viên thuốc dài đè lên nội dung bên phải trang.
        title={ASSISTANT_TITLE}
        variant="primary"
        className={`fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-3.5 z-50 size-11 rounded-full p-0 shadow-lg shadow-slate-900/25 sm:bottom-6 sm:right-5 ${hideOnMobile ? 'hidden lg:inline-flex' : ''}`}
      >
        {open ? <X className="size-5" aria-hidden /> : <Bot className="size-5" aria-hidden />}
      </Button>
      {requested && <AssistantPanelHost open={open} onClose={close} />}
    </>
  );
}
