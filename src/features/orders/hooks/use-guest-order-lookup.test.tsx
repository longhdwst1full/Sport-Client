// @vitest-environment jsdom
import * as React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

(globalThis as unknown as { React: typeof React }).React = React;

const push = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push, replace: vi.fn() }) }));

const createGuestOrderLookupChallenge = vi.fn();
const verifyGuestOrderLookup = vi.fn();
vi.mock('@/generated/api/orders/orders', () => ({
  createGuestOrderLookupChallenge: (...args: unknown[]) => createGuestOrderLookupChallenge(...args),
  verifyGuestOrderLookup: (...args: unknown[]) => verifyGuestOrderLookup(...args),
}));

import { ApiError } from '@/lib/api/fetcher';
import { GUEST_LOOKUP_INVALID_MESSAGE, GuestLookupErrorCode } from '../model/guest-order-lookup.constants';
import { readGuestOrderLookupGrant } from '../model/guest-order-lookup.store';
import { useGuestOrderLookup } from './use-guest-order-lookup';

function setup(initialOrderNo = 'DH260929000123') {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false }, queries: { retry: false } } });
  return renderHook(() => useGuestOrderLookup(initialOrderNo), {
    wrapper: ({ children }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>,
  });
}

/** Đưa hook tới bước nhập mã: điền email rồi gửi yêu cầu mã. */
async function reachVerifyStep(result: { current: ReturnType<typeof useGuestOrderLookup> }) {
  act(() => result.current.setEmail('khach@example.com'));
  act(() => result.current.requestCode());
  await waitFor(() => expect(result.current.step).toBe('verify'));
}

const grant = { orderNo: 'DH260929000123', lookupToken: 'tok-1', expiresAt: new Date(Date.now() + 1_800_000).toISOString() };

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  createGuestOrderLookupChallenge.mockResolvedValue(undefined);
  verifyGuestOrderLookup.mockResolvedValue(grant);
});

afterEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
  window.sessionStorage.clear();
  cleanup();
});

describe('useGuestOrderLookup — bước gửi mã', () => {
  it('202 chuyển sang bước nhập mã và bật cooldown 60s', async () => {
    const { result } = setup();
    await reachVerifyStep(result);

    expect(createGuestOrderLookupChallenge).toHaveBeenCalledWith({
      orderNo: 'DH260929000123',
      email: 'khach@example.com',
    });
    expect(result.current.secondsLeft).toBe(60);
    expect(result.current.canRequest).toBe(false);
  });

  it('hết 60s mới cho gửi lại mã', async () => {
    const { result } = setup();
    await reachVerifyStep(result);

    await act(async () => {
      vi.advanceTimersByTime(59_000);
    });
    expect(result.current.secondsLeft).toBeGreaterThan(0);
    expect(result.current.canRequest).toBe(false);

    await act(async () => {
      vi.advanceTimersByTime(2_000);
    });
    await waitFor(() => expect(result.current.secondsLeft).toBe(0));
    expect(result.current.canRequest).toBe(true);

    act(() => result.current.requestCode());
    await waitFor(() => expect(createGuestOrderLookupChallenge).toHaveBeenCalledTimes(2));
  });

  /**
   * SECURITY: đơn không tồn tại vẫn phải đi đúng con đường của đơn có thật — cùng 202, cùng bước kế tiếp,
   * cùng câu thông báo. Bất kỳ khác biệt nào ở đây đều là kênh dò đơn.
   */
  it('đơn không tồn tại đi đúng luồng như đơn có thật', async () => {
    const { result } = setup('KHONG-CO-DON');
    await reachVerifyStep(result);

    expect(result.current.step).toBe('verify');
    expect(result.current.requestErrorMessage).toBeNull();
  });
});

describe('useGuestOrderLookup — bước xác thực', () => {
  it('chỉ nhận 6 chữ số, bỏ ký tự khác', async () => {
    const { result } = setup();
    await reachVerifyStep(result);

    act(() => result.current.setCode('12a34-567890'));
    expect(result.current.code).toBe('123456');
    expect(result.current.canVerify).toBe(true);
  });

  it('xác thực đúng: lưu grant vào sessionStorage rồi mở trang đơn', async () => {
    const { result } = setup();
    await reachVerifyStep(result);
    act(() => result.current.setCode('123456'));
    act(() => result.current.verifyCode());

    await waitFor(() => expect(push).toHaveBeenCalledWith('/orders/DH260929000123'));
    expect(readGuestOrderLookupGrant('DH260929000123')).toMatchObject({ lookupToken: 'tok-1' });
    // Token tra cứu là quyền xem đơn: không bao giờ được rơi sang localStorage (sống qua cả phiên).
    expect(window.localStorage.length).toBe(0);
  });

  /**
   * SECURITY: API đã gộp mọi lý do thất bại vào một mã. Hook phải hiển thị đúng câu chung đó và vẫn cho
   * khách nhập lại — không suy ra "hết lượt" để tự khoá giao diện.
   */
  it('GUEST_LOOKUP_INVALID: câu chung, vẫn cho nhập lại', async () => {
    verifyGuestOrderLookup.mockRejectedValue(
      new ApiError(400, { code: GuestLookupErrorCode.INVALID, message: 'wrong code' }),
    );
    const { result } = setup();
    await reachVerifyStep(result);
    act(() => result.current.setCode('000000'));
    act(() => result.current.verifyCode());

    await waitFor(() => expect(result.current.verifyErrorMessage).toBe(GUEST_LOOKUP_INVALID_MESSAGE));
    expect(result.current.isLocked).toBe(false);
    expect(result.current.code).toBe('000000');
    expect(push).not.toHaveBeenCalled();
  });

  it('backend cũ trả LOCKED: cùng câu chung, xoá mã và buộc gửi mã mới', async () => {
    verifyGuestOrderLookup.mockRejectedValue(
      new ApiError(429, { code: GuestLookupErrorCode.LOCKED_LEGACY, message: 'too many attempts' }),
    );
    const { result } = setup();
    await reachVerifyStep(result);
    act(() => result.current.setCode('000000'));
    act(() => result.current.verifyCode());

    await waitFor(() => expect(result.current.isLocked).toBe(true));
    expect(result.current.verifyErrorMessage).toBe(GUEST_LOOKUP_INVALID_MESSAGE);
    expect(result.current.code).toBe('');
  });

  it('"Sửa thông tin" quay lại bước 1 và xoá lỗi cũ', async () => {
    verifyGuestOrderLookup.mockRejectedValue(new ApiError(400, { code: GuestLookupErrorCode.INVALID }));
    const { result } = setup();
    await reachVerifyStep(result);
    act(() => result.current.setCode('000000'));
    act(() => result.current.verifyCode());
    await waitFor(() => expect(result.current.verifyErrorMessage).not.toBeNull());

    act(() => result.current.editDetails());
    expect(result.current.step).toBe('request');
    expect(result.current.verifyErrorMessage).toBeNull();
  });
});
