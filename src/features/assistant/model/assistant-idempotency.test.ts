import { describe, expect, it } from 'vitest';
import { resolveIdempotencyEntry } from './assistant-idempotency';

function keys() {
  let n = 0;
  return () => `key-${++n}`;
}

describe('resolveIdempotencyEntry', () => {
  it('sinh khoá mới khi chưa có entry', () => {
    expect(resolveIdempotencyEntry(undefined, '1', 'xin chào', keys())).toEqual({ signature: '1:xin chào', key: 'key-1' });
  });

  it('retry cùng conversationId + nội dung dùng lại khoá cũ và không sinh khoá mới', () => {
    const gen = keys();
    const first = resolveIdempotencyEntry(undefined, '1', 'giá vợt?', gen);
    const retry = resolveIdempotencyEntry(first, '1', 'giá vợt?', gen);
    expect(retry.key).toBe(first.key);
    expect(gen()).toBe('key-2');
  });

  it('nội dung mới sinh khoá mới', () => {
    const gen = keys();
    const first = resolveIdempotencyEntry(undefined, '1', 'a', gen);
    expect(resolveIdempotencyEntry(first, '1', 'b', gen).key).not.toBe(first.key);
  });

  it('hội thoại khác với cùng nội dung sinh khoá mới', () => {
    const gen = keys();
    const first = resolveIdempotencyEntry(undefined, '1', 'a', gen);
    expect(resolveIdempotencyEntry(first, '2', 'a', gen).key).not.toBe(first.key);
  });

  it('sau khi nơi gọi xoá entry (thành công / turn-in-progress) cùng nội dung nhận khoá mới', () => {
    const gen = keys();
    const first = resolveIdempotencyEntry(undefined, '1', 'a', gen);
    expect(resolveIdempotencyEntry(undefined, '1', 'a', gen).key).not.toBe(first.key);
  });
});
