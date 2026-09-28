'use client';

import { useState } from 'react';
import type { OrderDetailView } from '../model/order.mapper';

/**
 * Sao chép mã đơn, mã vận đơn và địa chỉ nhận hàng. Hai nút chép mã vận đơn (đầu khối tiến trình và
 * trong khối vận chuyển) cố ý dùng chung một cờ `copiedTrackingNo` nên cùng đổi biểu tượng.
 */
export function useOrderCopy({
  view,
  triggerToast,
}: {
  view: OrderDetailView | undefined;
  triggerToast: (msg: string) => void;
}) {
  const [copiedOrderNo, setCopiedOrderNo] = useState(false);
  const [copiedTrackingNo, setCopiedTrackingNo] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const handleCopyOrderNo = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedOrderNo(true);
      triggerToast(`Đã sao chép mã đơn #${code}`);
      setTimeout(() => setCopiedOrderNo(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleCopyTrackingNo = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedTrackingNo(true);
      triggerToast(`Đã sao chép mã vận đơn ${code}`);
      setTimeout(() => setCopiedTrackingNo(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleCopyAddress = async () => {
    if (!view) return;
    try {
      const text = `${view.recipientName} - ${view.recipientPhone}\n${view.recipientAddress}`;
      await navigator.clipboard.writeText(text);
      setCopiedAddress(true);
      triggerToast('Đã sao chép thông tin người nhận và địa chỉ');
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch {
      // fallback
    }
  };

  return {
    copiedOrderNo,
    copiedTrackingNo,
    copiedAddress,
    handleCopyOrderNo,
    handleCopyTrackingNo,
    handleCopyAddress,
  };
}
