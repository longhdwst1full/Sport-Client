// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SessionStorageKey } from '@/core/storage';
import {
  clearGuestOrderLookupGrant,
  readGuestOrderLookupGrant,
  readLatestGuestOrderLookupGrant,
  saveGuestOrderLookupGrant,
} from './guest-order-lookup.store';

const inMinutes = (minutes: number) => new Date(Date.now() + minutes * 60_000).toISOString();

describe('guest order lookup grant store', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    window.localStorage.clear();
    clearGuestOrderLookupGrant('DH1');
    clearGuestOrderLookupGrant('DH2');
  });
  afterEach(() => vi.restoreAllMocks());

  it('lưu ở sessionStorage (không bao giờ localStorage) và chuẩn hoá orderNo', () => {
    expect(saveGuestOrderLookupGrant({ orderNo: ' dh1 ', lookupToken: 'tok', expiresAt: inMinutes(30) })).toBe(true);
    expect(readGuestOrderLookupGrant('DH1')).toMatchObject({ orderNo: 'DH1', lookupToken: 'tok' });
    expect(window.sessionStorage.getItem(SessionStorageKey.GUEST_ORDER_LOOKUP)).toContain('tok');
    expect(JSON.stringify({ ...window.localStorage })).not.toContain('tok');
  });

  it('grant hết hạn bị bỏ khi đọc', () => {
    window.sessionStorage.setItem(
      SessionStorageKey.GUEST_ORDER_LOOKUP,
      JSON.stringify({ DH1: { lookupToken: 'old', expiresAt: inMinutes(-1) } }),
    );
    expect(readGuestOrderLookupGrant('DH1')).toBeNull();
  });

  it('bản ghi hỏng bị bỏ qua', () => {
    window.sessionStorage.setItem(SessionStorageKey.GUEST_ORDER_LOOKUP, '{not json');
    expect(readGuestOrderLookupGrant('DH1')).toBeNull();
    window.sessionStorage.setItem(SessionStorageKey.GUEST_ORDER_LOOKUP, JSON.stringify({ DH1: { lookupToken: 5 } }));
    expect(readGuestOrderLookupGrant('DH1')).toBeNull();
  });

  it('readLatest trả grant còn hạn lâu nhất; clear xoá đúng đơn', () => {
    saveGuestOrderLookupGrant({ orderNo: 'DH1', lookupToken: 'a', expiresAt: inMinutes(10) });
    saveGuestOrderLookupGrant({ orderNo: 'DH2', lookupToken: 'b', expiresAt: inMinutes(25) });
    expect(readLatestGuestOrderLookupGrant()?.orderNo).toBe('DH2');
    clearGuestOrderLookupGrant('DH2');
    expect(readLatestGuestOrderLookupGrant()?.orderNo).toBe('DH1');
    clearGuestOrderLookupGrant('DH1');
    expect(readLatestGuestOrderLookupGrant()).toBeNull();
  });

  it('sessionStorage bị chặn: vẫn giữ grant trong bộ nhớ cho lần điều hướng hiện tại', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    expect(saveGuestOrderLookupGrant({ orderNo: 'DH1', lookupToken: 'mem', expiresAt: inMinutes(30) })).toBe(false);
    expect(readGuestOrderLookupGrant('DH1')?.lookupToken).toBe('mem');
  });
});
