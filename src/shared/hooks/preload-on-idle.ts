/**
 * Tải trước một chunk `next/dynamic` khi trình duyệt rảnh (sau hydrate), để thành phần chỉ hiện
 * sau tương tác ra khỏi bundle đầu trang mà lần mở đầu vẫn không phải chờ mạng.
 * Trả về hàm huỷ để dùng thẳng làm cleanup của `useEffect`.
 */
export function preloadOnIdle(load: () => Promise<unknown>, timeout = 3000): () => void {
  const run = () => {
    load().catch(() => undefined);
  };
  if (typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(run, { timeout });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(run, 1500);
  return () => window.clearTimeout(id);
}
