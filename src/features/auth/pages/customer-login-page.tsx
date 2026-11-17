'use client';

import { useForm } from 'react-hook-form';
import type { LoginDto } from '@/generated/api/auth/auth.schemas';
import { LoginForm } from '../components/login-form';
import { AuthPageShell } from '../components/auth-page-shell';
import { useLogin } from '../hooks/use-login';
import { loginResolver } from '../model/auth-form.validation';

export function CustomerLoginPage() {
  const { login, submitError, setSubmitError } = useLogin();

  const form = useForm<LoginDto>({
    resolver: loginResolver,
    defaultValues: { identifier: '', password: '', rememberMe: true },
  });

  return (
    <AuthPageShell
      variant="login"
      title="Đăng nhập"
      subtitle="Chào mừng bạn quay lại! Nhập email hoặc số điện thoại để tiếp tục mua sắm và theo dõi đơn hàng."
      submitError={submitError}
    >
      <LoginForm
        form={form}
        isPending={login.isPending}
        onSubmit={(data) => {
          setSubmitError('');
          login.mutate({ data });
        }}
      />
    </AuthPageShell>
  );
}
