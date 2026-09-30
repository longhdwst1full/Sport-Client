'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { createGuestOrderLookupChallenge, verifyGuestOrderLookup } from '@/generated/api/orders/orders';
import {
  GUEST_LOOKUP_CODE_LENGTH,
  GUEST_LOOKUP_RESEND_COOLDOWN_SECONDS,
} from '../model/guest-order-lookup.constants';
import { normalizeLookupCode, resendSecondsLeft } from '../model/guest-order-lookup';
import { guestLookupErrorMessage, isGuestLookupLocked } from '../model/guest-order-lookup-error';
import { saveGuestOrderLookupGrant } from '../model/guest-order-lookup.store';

export type GuestOrderLookupStep = 'request' | 'verify';

/**
 * Tra cứu đơn khách vãng lai bằng OTP email (V1.1): (1) gửi mã theo `orderNo + email`, (2) nhập mã 6 số → nhận grant,
 * lưu sessionStorage rồi mở `/orders/[orderNo]` (trang chi tiết đọc grant và gọi `getGuestOrderByLookup`).
 */
export function useGuestOrderLookup(initialOrderNo = '') {
  const router = useRouter();
  const [step, setStep] = useState<GuestOrderLookupStep>('request');
  const [orderNo, setOrderNo] = useState(initialOrderNo);
  const [email, setEmail] = useState('');
  const [code, setCodeRaw] = useState('');
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const secondsLeft = resendSecondsLeft(cooldownUntil, now);
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [secondsLeft]);

  const trimmedOrderNo = orderNo.trim().toUpperCase();
  const trimmedEmail = email.trim();

  const challenge = useMutation({
    retry: false,
    mutationFn: () => createGuestOrderLookupChallenge({ orderNo: trimmedOrderNo, email: trimmedEmail }),
    onSuccess: () => {
      // SECURITY: 202 luôn cùng nội dung dù đơn có tồn tại hay không; UI chuyển bước như nhau để không lộ thông tin.
      setStep('verify');
      setCodeRaw('');
      const startedAt = Date.now();
      setNow(startedAt);
      setCooldownUntil(startedAt + GUEST_LOOKUP_RESEND_COOLDOWN_SECONDS * 1000);
      verify.reset();
    },
  });

  const verify = useMutation({
    retry: false,
    mutationFn: () => verifyGuestOrderLookup({ orderNo: trimmedOrderNo, email: trimmedEmail, code }),
    onSuccess: (grant) => {
      saveGuestOrderLookupGrant(grant);
      router.push(`/orders/${encodeURIComponent(grant.orderNo)}`);
    },
    onError: (error) => {
      // Mã bị khoá sau quá số lần thử: xoá mã đang nhập, khách phải gửi mã mới.
      if (isGuestLookupLocked(error)) setCodeRaw('');
    },
  });

  const canRequest = Boolean(trimmedOrderNo && trimmedEmail) && !challenge.isPending && secondsLeft === 0;
  const canVerify = code.length === GUEST_LOOKUP_CODE_LENGTH && !verify.isPending;

  return {
    step,
    orderNo,
    setOrderNo,
    email,
    setEmail,
    code,
    setCode: (value: string) => setCodeRaw(normalizeLookupCode(value)),
    requestCode: () => {
      if (canRequest) challenge.mutate();
    },
    verifyCode: () => {
      if (canVerify) verify.mutate();
    },
    editDetails: () => {
      setStep('request');
      verify.reset();
    },
    canRequest,
    canVerify,
    secondsLeft,
    isRequesting: challenge.isPending,
    isVerifying: verify.isPending,
    requestErrorMessage: challenge.isError
      ? guestLookupErrorMessage(challenge.error, 'Không gửi được mã xác thực. Vui lòng thử lại.')
      : null,
    verifyErrorMessage: verify.isError
      ? guestLookupErrorMessage(verify.error, 'Không xác thực được mã. Vui lòng thử lại.')
      : null,
    isLocked: verify.isError && isGuestLookupLocked(verify.error),
  };
}
