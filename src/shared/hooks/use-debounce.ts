'use client';

import { useEffect, useState } from 'react';

/**
 * Hoãn giá trị cho tới khi người dùng ngừng gõ.
 *
 * Ô tìm kiếm gọi API theo giá trị này: gõ "máy chạy bộ" mà không hoãn là 11 lượt gọi cho
 * một lần tìm.
 */
export function useDebounce<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
