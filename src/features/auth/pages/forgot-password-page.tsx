'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Loader2, MailCheck, Send } from 'lucide-react';
import { useRequestCustomerPasswordReset } from '@/generated/api/auth/auth';
import { STORE_CONFIG } from '@/shared/constants';

/**
 * Yêu cầu đặt lại mật khẩu.
 *
 * SECURITY: màn hình này **không nói email có tồn tại hay không**, khớp với API luôn trả 202. Nói
 * "email này chưa đăng ký" là biến trang đăng nhập thành công cụ dò xem ai có tài khoản ở đây.
 */
export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const request = useRequestCustomerPasswordReset({
    mutation: {
      // Lỗi mạng cũng hiện cùng một màn: người dùng không cần biết chi tiết, và biết cũng không
      // làm gì khác được ngoài thử lại.
      onSettled: () => setSubmitted(true),
    },
  });

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-emerald-700"
      >
        <ArrowLeft className="size-4" />
        Quay lại đăng nhập
      </Link>

      {submitted ? (
        <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-center">
          <MailCheck className="mx-auto size-10 text-emerald-600" />
          <h1 className="mt-3 text-lg font-black text-stone-900">Đã gửi yêu cầu</h1>
          <p className="mt-2 text-xs leading-relaxed text-stone-600">
            Nếu <strong>{email.trim()}</strong> có tài khoản tại {STORE_CONFIG.name}, chúng tôi vừa
            gửi một email kèm đường dẫn đặt lại mật khẩu. Đường dẫn hết hạn sau 30 phút và chỉ dùng
            được một lần.
          </p>
          <p className="mt-2 text-xs text-stone-500">
            Không thấy email? Kiểm tra hộp thư rác trước khi thử lại.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-5 text-xs font-bold text-emerald-700 hover:underline"
          >
            Nhập email khác
          </button>
        </div>
      ) : (
        <form
          className="mt-6 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm"
          onSubmit={(event) => {
            event.preventDefault();
            request.mutate({ data: { email: email.trim() } });
          }}
        >
          <h1 className="text-lg font-black text-stone-900">Quên mật khẩu</h1>
          <p className="mt-1 text-xs leading-relaxed text-stone-500">
            Nhập email đăng nhập của bạn. Chúng tôi sẽ gửi đường dẫn để đặt lại mật khẩu.
          </p>

          <label className="mt-5 block text-xs font-bold uppercase tracking-wider text-stone-600">
            Email đăng nhập
          </label>
          <input
            required
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="ban@example.com"
            className="mt-1.5 w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />

          <button
            type="submit"
            disabled={request.isPending}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            {request.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
            Gửi đường dẫn đặt lại
          </button>
        </form>
      )}
    </main>
  );
}
