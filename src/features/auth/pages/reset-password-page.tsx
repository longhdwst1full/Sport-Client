'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { AlertTriangle, CheckCircle2, KeyRound, Loader2 } from 'lucide-react';
import { useResetCustomerPassword } from '@/generated/api/auth/auth';
import { ApiError } from '@/lib/api/fetcher';

function messageOf(error: unknown): string {
  if (error instanceof ApiError && error.payload && typeof error.payload === 'object') {
    const message = (error.payload as { message?: unknown }).message;
    if (typeof message === 'string') return message;
  }
  return 'Không đặt lại được mật khẩu. Vui lòng thử lại.';
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
      <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-center">
          <AlertTriangle className="mx-auto size-10 text-amber-600" />
          <h1 className="mt-3 text-lg font-black text-stone-900">Thiếu mã đặt lại</h1>
          <p className="mt-2 text-xs text-stone-600">
            Hãy mở đúng đường dẫn trong email chúng tôi gửi cho bạn.
          </p>
          <Link
            href="/forgot-password"
            className="mt-5 inline-block text-xs font-bold text-emerald-700 hover:underline"
          >
            Gửi lại email đặt lại mật khẩu
          </Link>
        </div>
      </main>
    );
  }

  if (done) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-center">
          <CheckCircle2 className="mx-auto size-10 text-emerald-600" />
          <h1 className="mt-3 text-lg font-black text-stone-900">Đã đặt lại mật khẩu</h1>
          {/* Mọi phiên đều bị thu hồi khi đặt lại mật khẩu; nói rõ để khách không bất ngờ. */}
          <p className="mt-2 text-xs leading-relaxed text-stone-600">
            Mọi thiết bị đang đăng nhập đã bị đăng xuất. Hãy đăng nhập lại bằng mật khẩu mới.
          </p>
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="mt-5 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-500"
          >
            Đăng nhập
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
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

        <label className="mt-5 block text-xs font-bold uppercase tracking-wider text-stone-600">
          Mật khẩu mới
        </label>
        <input
          required
          type="password"
          minLength={8}
          autoComplete="new-password"
          value={password.next}
          onChange={(event) => setPassword((c) => ({ ...c, next: event.target.value }))}
          className="mt-1.5 w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />

        <label className="mt-4 block text-xs font-bold uppercase tracking-wider text-stone-600">
          Nhập lại mật khẩu mới
        </label>
        <input
          required
          type="password"
          minLength={8}
          autoComplete="new-password"
          value={password.confirm}
          onChange={(event) => setPassword((c) => ({ ...c, confirm: event.target.value }))}
          className="mt-1.5 w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />

        {(localError || reset.isError) && (
          <p className="mt-4 rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
            {localError ?? messageOf(reset.error)}
          </p>
        )}

        <button
          type="submit"
          disabled={reset.isPending}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          {reset.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <KeyRound className="size-4" />
          )}
          Đặt lại mật khẩu
        </button>
      </form>
    </main>
  );
}
