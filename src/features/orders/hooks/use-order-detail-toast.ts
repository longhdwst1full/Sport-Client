'use client';

import { useState } from 'react';

/** Thông báo ngắn 3 giây ở góc màn chi tiết đơn (sao chép, mua lại, hủy đơn, gửi đánh giá). */
export function useOrderDetailToast() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return { toastMessage, triggerToast };
}
