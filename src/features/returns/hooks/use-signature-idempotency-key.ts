import { useMemo, useRef } from 'react';

/**
 * Khoá idempotency gắn với "chữ ký" request: bấm lại / thử lại cùng nội dung thì dùng lại key cũ để API
 * trả đúng kết quả lần trước; đổi nội dung sinh key mới. `reset()` sau khi thành công hoặc huỷ thao tác.
 */
export function useSignatureIdempotencyKey() {
  const current = useRef<{ signature: string; key: string } | undefined>(undefined);
  return useMemo(
    () => ({
      keyFor(signature: string): string {
        if (current.current?.signature !== signature) {
          current.current = { signature, key: crypto.randomUUID() };
        }
        return current.current.key;
      },
      reset() {
        current.current = undefined;
      },
    }),
    [],
  );
}
