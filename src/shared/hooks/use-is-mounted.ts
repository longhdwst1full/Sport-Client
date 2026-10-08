import { useSyncExternalStore } from 'react';

const subscribe = () => () => undefined;

/**
 * `false` khi render trên server và lượt hydrate đầu, `true` sau khi đã gắn vào trình duyệt. Thay cho mẫu
 * `useState(false)` + `useEffect(() => setMounted(true))` lặp ở nhiều hook (một lượt render thừa, vi phạm
 * RULE-HOOK-01); `useSyncExternalStore` cho cùng kết quả mà không cần setState trong effect.
 */
export function useIsMounted(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
