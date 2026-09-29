'use client';

import { useAssistantChat } from '../hooks/use-assistant-chat';
import { AssistantDialog } from './assistant-dialog';

/**
 * Tải lười ở lần mở đầu tiên rồi giữ mount: state gửi tin/hội thoại của khách đăng nhập sống qua các lần
 * đóng/mở panel, còn dialog mount lại mỗi lần mở để `Modal` đưa focus vào và trả focus về launcher.
 */
export function AssistantPanelHost({ open, onClose }: { open: boolean; onClose: () => void }) {
  const chat = useAssistantChat({ enabled: open });
  return open ? <AssistantDialog chat={chat} onClose={onClose} /> : null;
}
