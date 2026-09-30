'use client';

import Link from 'next/link';
import { MailCheck, SearchCheck } from 'lucide-react';
import { Button } from '@/foundation/components/buttons';
import { Spinner } from '@/foundation/components/feedback';
import { GUEST_LOOKUP_CODE_LENGTH, GUEST_LOOKUP_COPY } from '../model/guest-order-lookup.constants';
import { useGuestOrderLookup } from '../hooks/use-guest-order-lookup';

const inputClass =
  'mt-1.5 w-full rounded-2xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 disabled:bg-slate-50';

/** `/orders/lookup`: khách vãng lai xem đơn bằng mã đơn + email + OTP, không cần trình duyệt đã đặt hàng. */
export function GuestOrderLookupPage({ initialOrderNo = '' }: { initialOrderNo?: string }) {
  const lookup = useGuestOrderLookup(initialOrderNo);

  return (
    <main className="mx-auto min-h-[60vh] max-w-xl px-4 py-10 sm:px-6">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">Khách vãng lai</p>
      <h1 className="mt-2 text-3xl font-black text-slate-950">{GUEST_LOOKUP_COPY.title}</h1>
      <p className="mt-2 text-sm text-slate-600">{GUEST_LOOKUP_COPY.intro}</p>

      {lookup.step === 'request' ? (
        <form
          className="mt-7 space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          onSubmit={(event) => {
            event.preventDefault();
            lookup.requestCode();
          }}
        >
          <div>
            <label htmlFor="lookup-order-no" className="block text-xs font-bold text-slate-800">Mã đơn hàng</label>
            <input
              id="lookup-order-no"
              value={lookup.orderNo}
              onChange={(event) => lookup.setOrderNo(event.target.value)}
              maxLength={32}
              required
              autoComplete="off"
              placeholder="VD: DH260929000123"
              disabled={lookup.isRequesting}
              className={`${inputClass} font-mono uppercase`}
            />
          </div>
          <div>
            <label htmlFor="lookup-email" className="block text-xs font-bold text-slate-800">Email người nhận</label>
            <input
              id="lookup-email"
              type="email"
              value={lookup.email}
              onChange={(event) => lookup.setEmail(event.target.value)}
              maxLength={255}
              required
              autoComplete="email"
              disabled={lookup.isRequesting}
              className={inputClass}
            />
          </div>
          {lookup.requestErrorMessage && (
            <p role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-800">{lookup.requestErrorMessage}</p>
          )}
          <Button
            type="submit"
            disabled={!lookup.canRequest}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
          >
            {lookup.isRequesting ? <Spinner className="size-4 animate-spin" /> : <MailCheck className="size-4" aria-hidden />}
            {lookup.secondsLeft > 0 ? `Gửi lại sau ${lookup.secondsLeft}s` : 'Gửi mã xác thực'}
          </Button>
        </form>
      ) : (
        <form
          className="mt-7 space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          onSubmit={(event) => {
            event.preventDefault();
            lookup.verifyCode();
          }}
        >
          <p role="status" className="rounded-2xl bg-emerald-50 p-3 text-sm text-emerald-900">{GUEST_LOOKUP_COPY.sent}</p>
          <p className="text-xs text-slate-500">
            Đơn <span className="font-mono font-bold text-slate-800">{lookup.orderNo.trim().toUpperCase()}</span> ·{' '}
            <button type="button" onClick={lookup.editDetails} className="font-bold text-emerald-700 underline">Sửa thông tin</button>
          </p>
          <div>
            <label htmlFor="lookup-code" className="block text-xs font-bold text-slate-800">{GUEST_LOOKUP_COPY.codeLabel}</label>
            <input
              id="lookup-code"
              value={lookup.code}
              onChange={(event) => lookup.setCode(event.target.value)}
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]*"
              maxLength={GUEST_LOOKUP_CODE_LENGTH}
              required
              disabled={lookup.isVerifying || lookup.isLocked}
              className={`${inputClass} text-center font-mono text-2xl tracking-[0.5em]`}
            />
          </div>
          {lookup.verifyErrorMessage && (
            <p role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-800">{lookup.verifyErrorMessage}</p>
          )}
          <Button
            type="submit"
            disabled={!lookup.canVerify || lookup.isLocked}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
          >
            {lookup.isVerifying ? <Spinner className="size-4 animate-spin" /> : <SearchCheck className="size-4" aria-hidden />}
            Xem đơn hàng
          </Button>
          <div className="text-center text-xs text-slate-500">
            {lookup.secondsLeft > 0 ? (
              <span aria-live="polite">Gửi lại mã sau {lookup.secondsLeft} giây</span>
            ) : (
              <button type="button" onClick={lookup.requestCode} disabled={!lookup.canRequest} className="font-bold text-emerald-700 underline disabled:opacity-50">
                {lookup.isRequesting ? 'Đang gửi...' : 'Gửi lại mã'}
              </button>
            )}
          </div>
          {lookup.requestErrorMessage && (
            <p role="alert" className="text-center text-xs font-semibold text-rose-700">{lookup.requestErrorMessage}</p>
          )}
        </form>
      )}

      <p className="mt-6 text-center text-xs text-slate-500">
        Có tài khoản? <Link href="/login" className="font-bold text-emerald-700">Đăng nhập</Link> để xem toàn bộ đơn hàng.
      </p>
    </main>
  );
}
