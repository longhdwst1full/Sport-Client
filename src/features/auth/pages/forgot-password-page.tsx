'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, MailCheck, Send } from 'lucide-react';
import { Spinner } from '@/foundation/components/feedback';
import { useRequestCustomerPasswordReset } from '@/generated/api/auth/auth';
import { Button } from '@/foundation/components/buttons';
import { Field, TextInput } from '@/foundation/components/field-system';
import { AuthRecoveryMain, RECOVERY_LABEL_CLASS } from '../components/auth-field';
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
    <AuthRecoveryMain>
      <Link
        href="/login"
        className="inline-flex min-h-11 items-center gap-1.5 self-start text-xs font-semibold text-stone-600 hover:text-brand-700 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Quay lại đăng nhập
      </Link>

      {submitted ? (
        <div role="status" className="mt-6 rounded-3xl border border-success-200 bg-success-50 p-6 text-center">
          <MailCheck className="mx-auto size-10 text-success-600" aria-hidden />
          <h1 className="mt-3 text-lg font-black text-stone-900">Đã gửi yêu cầu</h1>
          <p className="mt-2 text-xs leading-relaxed text-stone-600">
            Nếu <strong>{email.trim()}</strong> có tài khoản tại {STORE_CONFIG.name}, chúng tôi vừa
            gửi một email kèm đường dẫn đặt lại mật khẩu. Đường dẫn hết hạn sau 30 phút và chỉ dùng
            được một lần.
          </p>
          <p className="mt-2 text-xs text-stone-500">
            Không thấy email? Kiểm tra hộp thư rác trước khi thử lại.
          </p>
          <Button variant="link" onClick={() => setSubmitted(false)} className="mt-5 rounded text-xs font-bold">
            Nhập email khác
          </Button>
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

          <Field label="Email đăng nhập" labelClassName={`mt-5 ${RECOVERY_LABEL_CLASS}`}>
            <TextInput
              required
              type="email"
              autoComplete="email"
              aria-label="Email đăng nhập"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="ban@example.com"
              size="md"
              className="mt-1.5"
            />
          </Field>

          <Button
            type="submit"
            size="md"
            fullWidth
            disabled={request.isPending}
            className="mt-5 font-bold"
          >
            {request.isPending ? (
              <Spinner className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" aria-hidden />
            )}
            Gửi đường dẫn đặt lại
          </Button>
        </form>
      )}
    </AuthRecoveryMain>
  );
}
