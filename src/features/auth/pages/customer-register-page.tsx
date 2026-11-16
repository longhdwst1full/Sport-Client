'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { RegisterCustomerDto } from '@/generated/api/auth/auth.schemas';
import { useToast } from '@/shared/components/global-toast';
import { RegisterForm } from '../components/register-form';
import { AuthPageShell } from '../components/auth-page-shell';
import { useRegister } from '../hooks/use-register';
import { registerResolver } from '../model/auth-form.validation';

export function CustomerRegisterPage() {
  const { toast } = useToast();
  const { register, submitError, setSubmitError } = useRegister();
  const [acceptedTerms, setAcceptedTerms] = useState(true);

  const form = useForm<RegisterCustomerDto>({
    resolver: registerResolver,
    defaultValues: { displayName: '', email: '', phone: '', password: '' },
  });

  return (
    <AuthPageShell
      variant="register"
      title="Đăng ký tài khoản"
      subtitle="Tạo tài khoản hội viên nhanh chóng trong 10 giây để nhận trọn bộ ưu đãi và quản lý bảo hành."
      submitError={submitError}
      social={{
        dividerText: 'Hoặc đăng ký nhanh với',
        toastTitles: {
          google: 'Đăng ký Google',
          zalo: 'Đăng ký Zalo',
          facebook: 'Đăng ký Facebook',
        },
        toastMessages: {
          google: 'Hệ thống đang tích hợp cổng Google One-Tap.',
          zalo: 'Hệ thống đang mở liên kết xác thực qua Zalo OA.',
          facebook: 'Cổng đăng ký qua Facebook đã sẵn sàng kết nối.',
        },
      }}
    >
      <RegisterForm
        form={form}
        isPending={register.isPending}
        acceptedTerms={acceptedTerms}
        onAcceptedTermsChange={setAcceptedTerms}
        onSubmit={(data) => {
          if (!acceptedTerms) {
            toast({
              type: 'warning',
              title: 'Chưa đồng ý điều khoản',
              message: 'Vui lòng xác nhận đồng ý với Điều khoản dịch vụ và Chính sách của Bảo An Sport.',
            });
            return;
          }
          setSubmitError('');
          register.mutate({ data });
        }}
      />
    </AuthPageShell>
  );
}
