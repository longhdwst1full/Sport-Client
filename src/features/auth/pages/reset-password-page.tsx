'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { AlertTriangle, CheckCircle2, KeyRound } from 'lucide-react';
import { useResetCustomerPassword } from '@/generated/api/auth/auth';
import { apiErrorMessage } from '@/lib/api/error-message';
import { InlineAlert, Spinner } from '@/foundation/components/feedback';
import { Button } from '@/foundation/components/buttons';
import { Field, TextInput } from '@/foundation/components/field-system';
import { AuthRecoveryMain, RECOVERY_LABEL_CLASS } from '../components/auth-field';

function messageOf(error: unknown): string {
  return apiErrorMessage(error, 'Không đặt lại được mật khẩu. Vui lòng thử lại.');
}

/**
 * Đặt lại mật khẩu bằng token trong email.
 *
 * Token đọc từ query string — đó là đường duy nhất nó tới được trình duyệt. Không lưu nó vào
 * localStorage hay state toàn cục: token dùng một lần, giữ lại chỉ tạo thêm chỗ để nó rò ra.
 */
export function ResetPasswordPage() {
  const router = useRouter();
  const token = useSearchParams().get('token') ?? '';
  const [password, setPassword] = useState({ next: '', confirm: '' });
  const [localError, setLocalError] = useState<string>();
  const [done, setDone] = useState(false);

  const reset = useResetCustomerPassword({
    mutation: {
      onSuccess: () => setDone(true),
      onError: () => setLocalError(undefined),
    },
  });

  if (!token) {
    return (
      <AuthRecoveryMain>
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-center">
          <AlertTriangle className="mx-auto size-10 text-amber-600" aria-hidden />
          <h1 className="mt-3 text-lg font-black text-stone-900">Thiếu mã đặt lại</h1>
          <p className="mt-2 text-xs text-stone-600">
            Hãy mở đúng đường dẫn trong email chúng tôi gửi cho bạn.
          </p>
          <Link
            href="/forgot-password"
            className="mt-5 inline-block rounded text-xs font-bold text-slate-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
          >
            Gửi lại email đặt lại mật khẩu
          </Link>
        </div>
      </AuthRecoveryMain>
    );
  }

  if (done) {
    return (
      <AuthRecoveryMain>
        <div role="status" className="rounded-3xl border border-success-200 bg-success-50 p-6 text-center">
          <CheckCircle2 className="mx-auto size-10 text-success-600" aria-hidden />
          <h1 className="mt-3 text-lg font-black text-stone-900">Đã đặt lại mật khẩu</h1>
          {/* Mọi phiên đều bị thu hồi khi đặt lại mật khẩu; nói rõ để khách không bất ngờ. */}
          <p className="mt-2 text-xs leading-relaxed text-stone-600">
            Mọi thiết bị đang đăng nhập đã bị đăng xuất. Hãy đăng nhập lại bằng mật khẩu mới.
          </p>
          <Button size="md" onClick={() => router.push('/login')} className="mt-5 px-5 text-xs font-bold">
            Đăng nhập
          </Button>
        </div>
      </AuthRecoveryMain>
    );
  }

  return (
    <AuthRecoveryMain>
      <form
        className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm"
        onSubmit={(event) => {
          event.preventDefault();
          if (password.next !== password.confirm) {
            setLocalError('Hai ô mật khẩu không khớp nhau.');
            return;
          }
          setLocalError(undefined);
          reset.mutate({ data: { token, newPassword: password.next } });
        }}
      >
        <h1 className="text-lg font-black text-stone-900">Đặt mật khẩu mới</h1>
        <p className="mt-1 text-xs text-stone-500">Tối thiểu 8 ký tự.</p>

        <Field label="Mật khẩu mới" labelClassName={`mt-5 ${RECOVERY_LABEL_CLASS}`}>
          <TextInput
            required
            type="password"
            minLength={8}
            autoComplete="new-password"
            value={password.next}
            aria-label="Mật khẩu mới"
            onChange={(event) => setPassword((c) => ({ ...c, next: event.target.value }))}
            size="md"
            className="mt-1.5"
          />
        </Field>

        <Field label="Nhập lại mật khẩu mới" labelClassName={`mt-4 ${RECOVERY_LABEL_CLASS}`}>
          <TextInput
            required
            type="password"
            minLength={8}
            autoComplete="new-password"
            value={password.confirm}
            aria-label="Nhập lại mật khẩu mới"
            onChange={(event) => setPassword((c) => ({ ...c, confirm: event.target.value }))}
            size="md"
            className="mt-1.5"
          />
        </Field>

        {(localError || reset.isError) && (
          <InlineAlert as="p" role="alert" className="mt-4 rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
            {localError ?? messageOf(reset.error)}
          </InlineAlert>
        )}

        <Button
          type="submit"
          size="md"
          fullWidth
          disabled={reset.isPending}
          className="mt-5 font-bold"
        >
          {reset.isPending ? (
            <Spinner className="size-4 animate-spin" />
          ) : (
            <KeyRound className="size-4" aria-hidden />
          )}
          Đặt lại mật khẩu
        </Button>
      </form>
    </AuthRecoveryMain>
  );
}
