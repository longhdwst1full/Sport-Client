'use client';

import Link from 'next/link';
import { MailCheck, SearchCheck } from 'lucide-react';
import { Button } from '@/foundation/components/buttons';
import { InlineAlert } from '@/foundation/components/feedback';
import { Field, TextInput } from '@/foundation/components/field-system';
import { GUEST_LOOKUP_CODE_LENGTH, GUEST_LOOKUP_COPY } from '../model/guest-order-lookup.constants';
import { useGuestOrderLookup } from '../hooks/use-guest-order-lookup';

const LABEL_CLASS = 'block text-xs font-bold text-slate-800';
const ERROR_ALERT_CLASS = 'rounded-2xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-800';

/** `/orders/lookup`: khách vãng lai xem đơn bằng mã đơn + email + OTP, không cần trình duyệt đã đặt hàng. */
export function GuestOrderLookupPage({ initialOrderNo = '' }: { initialOrderNo?: string }) {
  const lookup = useGuestOrderLookup(initialOrderNo);

  return (
    <main className="mx-auto min-h-[60vh] max-w-xl px-4 py-10 sm:px-6">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-brand-700">Khách vãng lai</p>
      <h1 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">{GUEST_LOOKUP_COPY.title}</h1>
      <p className="mt-2 text-sm text-slate-600">{GUEST_LOOKUP_COPY.intro}</p>

      {lookup.step === 'request' ? (
        <form
          className="mt-7 space-y-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
          onSubmit={(event) => {
            event.preventDefault();
            lookup.requestCode();
          }}
        >
          <div>
            <Field label="Mã đơn hàng" labelClassName={LABEL_CLASS}>
            <TextInput
              id="lookup-order-no"
              size="md"
              value={lookup.orderNo}
              onChange={(event) => lookup.setOrderNo(event.target.value)}
              maxLength={32}
              required
              autoComplete="off"
              placeholder="VD: DH260929000123"
              disabled={lookup.isRequesting}
              className="mt-1.5 font-mono uppercase"
            />
            </Field>
          </div>
          <div>
            <Field label="Email người nhận" labelClassName={LABEL_CLASS}>
            <TextInput
              id="lookup-email"
              size="md"
              type="email"
              value={lookup.email}
              onChange={(event) => lookup.setEmail(event.target.value)}
              maxLength={255}
              required
              autoComplete="email"
              disabled={lookup.isRequesting}
              className="mt-1.5"
            />
            </Field>
          </div>
          {lookup.requestErrorMessage && (
            <InlineAlert as="p" role="alert" className={ERROR_ALERT_CLASS}>{lookup.requestErrorMessage}</InlineAlert>
          )}
          <Button
            type="submit"
            disabled={!lookup.canRequest}
            variant="primary"
            size="lg"
            fullWidth
            loading={lookup.isRequesting}
            className="text-sm shadow-sm"
          >
            {!lookup.isRequesting && <MailCheck className="size-4" aria-hidden />}
            {lookup.secondsLeft > 0 ? `Gửi lại sau ${lookup.secondsLeft}s` : 'Gửi mã xác thực'}
          </Button>
        </form>
      ) : (
        <form
          className="mt-7 space-y-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
          onSubmit={(event) => {
            event.preventDefault();
            lookup.verifyCode();
          }}
        >
          <InlineAlert as="p" role="status" className="rounded-2xl border border-success-200 bg-success-50 p-3 text-sm text-success-900">{GUEST_LOOKUP_COPY.sent}</InlineAlert>
          <p className="text-xs text-slate-500">
            Đơn <span className="font-mono font-bold text-slate-800">{lookup.orderNo.trim().toUpperCase()}</span> ·{' '}
            <Button variant="link" onClick={lookup.editDetails} className="min-h-11 font-bold underline">Sửa thông tin</Button>
          </p>
          <div>
            <Field label={GUEST_LOOKUP_COPY.codeLabel} labelClassName={LABEL_CLASS}>
            <TextInput
              id="lookup-code"
              size="md"
              value={lookup.code}
              onChange={(event) => lookup.setCode(event.target.value)}
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]*"
              maxLength={GUEST_LOOKUP_CODE_LENGTH}
              required
              disabled={lookup.isVerifying || lookup.isLocked}
              className="mt-1.5 text-center font-mono text-2xl tracking-[0.5em] sm:text-2xl"
            />
            </Field>
          </div>
          {lookup.verifyErrorMessage && (
            <InlineAlert as="p" role="alert" className={ERROR_ALERT_CLASS}>{lookup.verifyErrorMessage}</InlineAlert>
          )}
          <Button
            type="submit"
            disabled={!lookup.canVerify || lookup.isLocked}
            variant="primary"
            size="lg"
            fullWidth
            loading={lookup.isVerifying}
            className="text-sm shadow-sm"
          >
            {!lookup.isVerifying && <SearchCheck className="size-4" aria-hidden />}
            Xem đơn hàng
          </Button>
          <div className="text-center text-xs text-slate-500">
            {lookup.secondsLeft > 0 ? (
              <span aria-live="polite">Gửi lại mã sau {lookup.secondsLeft} giây</span>
            ) : (
              <Button variant="link" onClick={lookup.requestCode} disabled={!lookup.canRequest} className="min-h-11 font-bold underline">
                {lookup.isRequesting ? 'Đang gửi...' : 'Gửi lại mã'}
              </Button>
            )}
          </div>
          {lookup.requestErrorMessage && (
            <InlineAlert as="p" role="alert" className="text-center text-xs font-semibold text-rose-700">{lookup.requestErrorMessage}</InlineAlert>
          )}
        </form>
      )}

      <p className="mt-6 text-center text-xs text-slate-500">
        Có tài khoản? <Link href="/login" className="font-bold text-brand-700">Đăng nhập</Link> để xem toàn bộ đơn hàng.
      </p>
    </main>
  );
}
