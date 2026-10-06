'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import type { LoginDto } from '@/generated/api/auth/auth.schemas';
import { LoginForm } from '../components/login-form';
import { AuthPageShell } from '../components/auth-page-shell';
import { useLogin } from '../hooks/use-login';

const schema: yup.ObjectSchema<LoginDto> = yup.object({
  identifier: yup.string().trim().required('Vui lòng nhập email hoặc số điện thoại').max(255),
  password: yup.string().required('Vui lòng nhập mật khẩu').min(8, 'Mật khẩu tối thiểu 8 ký tự').max(128),
  rememberMe: yup.boolean().optional(),
});

export function CustomerLoginPage() {
  const { login, submitError, setSubmitError } = useLogin();

  const form = useForm<LoginDto>({
    resolver: yupResolver(schema),
    defaultValues: { identifier: '', password: '', rememberMe: true },
  });

  return (
    <AuthPageShell
      variant="login"
      title="Đăng nhập"
      subtitle="Chào mừng bạn quay lại! Nhập email hoặc số điện thoại để tiếp tục mua sắm và theo dõi đơn hàng."
      submitError={submitError}
      social={{
        dividerText: 'Hoặc tiếp tục với',
        toastTitles: {
          google: 'Đăng nhập Google',
          zalo: 'Đăng nhập Zalo',
          facebook: 'Đăng nhập Facebook',
        },
        toastMessages: {
          google: 'Hệ thống đang tích hợp cổng Google One-Tap.',
          zalo: 'Hệ thống đang mở liên kết xác thực qua Zalo OA.',
          facebook: 'Cổng đăng nhập qua Facebook đã sẵn sàng kết nối.',
        },
      }}
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
