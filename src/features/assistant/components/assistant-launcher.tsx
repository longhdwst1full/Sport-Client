'use client';

import { useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import { Bot, X } from 'lucide-react';
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
      <Spinner className="size-5 animate-spin text-brand-600" />
      <span className="sr-only">Đang mở trợ lý mua sắm</span>
    </div>
  ),
});

export function AssistantLauncher() {
  const [open, setOpen] = useState(false);
  // Chỉ tải chunk panel sau lần bấm đầu tiên; sau đó giữ mount để không mất hội thoại khi đóng/mở.
  const [requested, setRequested] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setRequested(true);
          setOpen((value) => !value);
        }}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? ASSISTANT_DIALOG_ID : undefined}
        aria-label={open ? 'Đóng trợ lý mua sắm' : 'Mở trợ lý mua sắm'}
        // Mobile: nút dưới cùng của cột nút nổi (FloatingContactBar xếp ngay phía trên), có safe-area iOS.
        // Từ `sm`: nằm bên trái cột nút liên hệ (right-20) như cũ để không che nhau.
        className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-3.5 z-50 flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full bg-brand-600 p-2.5 text-white shadow-xl shadow-brand-700/30 transition hover:scale-105 hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 active:scale-95 sm:bottom-6 sm:right-20 sm:px-4 sm:py-3"
      >
        {open ? <X className="size-[18px] sm:size-5" aria-hidden /> : <Bot className="size-[18px] sm:size-5" aria-hidden />}
        <span className="hidden text-xs font-black sm:inline">{ASSISTANT_TITLE}</span>
      </button>
      {requested && <AssistantPanelHost open={open} onClose={close} />}
    </>
  );
}
