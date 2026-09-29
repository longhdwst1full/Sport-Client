export type AssistantIdempotencyEntry = { signature: string; key: string };

/**
 * IDEMPOTENCY: cùng hội thoại + cùng nội dung dùng lại khoá cũ (retry sau timeout); khác chữ ký thì sinh khoá mới.
 * Hàm thuần — nơi gọi tự giữ entry và xoá sau khi thành công / khi server yêu cầu đổi khoá.
 */
export function resolveIdempotencyEntry(
  current: AssistantIdempotencyEntry | undefined,
  conversationId: string,
  content: string,
  generateKey: () => string,
): AssistantIdempotencyEntry {
  const signature = `${conversationId}:${content}`;
  return current?.signature === signature ? current : { signature, key: generateKey() };
}
