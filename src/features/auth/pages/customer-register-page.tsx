'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import type { RegisterCustomerDto } from '@/generated/api/auth/auth.schemas';
import { useToast } from '@/shared/components/global-toast';
import { RegisterForm } from '../components/register-form';
import { AuthPageShell } from '../components/auth-page-shell';
import { useRegister } from '../hooks/use-register';

const optionalIdentity = () =>
  yup
    .string()
    .trim()
    .transform((value) => value || undefined)
    .optional();

const schema: yup.ObjectSchema<RegisterCustomerDto> = yup
  .object({
    displayName: yup.string().trim().required('Vui lòng nhập họ và tên của bạn').max(255),
    email: optionalIdentity().email('Email không đúng định dạng').max(255),
    phone: optionalIdentity().max(32),
    password: yup.string().required('Vui lòng nhập mật khẩu').min(8, 'Mật khẩu tối thiểu 8 ký tự').max(128),
  })
  .test('identity-required', 'Nhập email hoặc số điện thoại', function requireIdentity(value) {
    return (
      Boolean(value.email || value.phone) ||
      this.createError({ path: 'email', message: 'Vui lòng cung cấp email hoặc số điện thoại' })
    );
  });

export function CustomerRegisterPage() {
  const { toast } = useToast();
  const { register, submitError, setSubmitError } = useRegister();
  const [acceptedTerms, setAcceptedTerms] = useState(true);

  const form = useForm<RegisterCustomerDto>({
    resolver: yupResolver(schema),
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
