'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { ShieldCheck } from 'lucide-react';
import type { RegisterCustomerDto } from '@/generated/api/auth/auth.schemas';
import { useToast } from '@/shared/components/global-toast';
import { AuthBrandPanel } from '../components/auth-brand-panel';
import { AuthMobileHeader } from '../components/auth-mobile-header';
import { AuthModeSwitcher } from '../components/auth-mode-switcher';
import { RegisterForm } from '../components/register-form';
import { SocialLoginButtons } from '../components/social-login-buttons';
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
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(true);

  const form = useForm<RegisterCustomerDto>({
    resolver: yupResolver(schema),
    defaultValues: { displayName: '', email: '', phone: '', password: '' },
  });

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
      <div className="grid min-h-screen lg:grid-cols-12">
        {/* Left Side: Athletic Editorial & Welcome Package (Desktop only) */}
        <AuthBrandPanel variant="register" />

        {/* Right Side: Registration Form Experience */}
        <div className="flex flex-col justify-center px-4 py-10 sm:px-8 md:px-12 lg:col-span-6 xl:col-span-5 bg-white lg:bg-slate-50/70">
          <div className="mx-auto w-full max-w-md">
            <AuthMobileHeader />

            {/* Form Card Container */}
            <div className="rounded-3xl bg-white sm:border sm:border-slate-200/80 sm:p-8 sm:shadow-xl sm:shadow-slate-200/50">
              {/* Segmented Pill Switcher: Login / Register */}
              <AuthModeSwitcher variant="register" />

              {/* Title & Subtitle */}
              <div className="mt-6">
                <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  Đăng ký tài khoản
                </h1>
                <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                  Tạo tài khoản hội viên nhanh chóng trong 10 giây để nhận trọn bộ ưu đãi và quản lý bảo hành.
                </p>
              </div>

              {/* Error Alert */}
              {submitError && (
                <div
                  role="alert"
                  className="mt-5 rounded-2xl border border-rose-200 bg-rose-50/80 p-3.5 text-xs font-semibold text-rose-700 animate-in fade-in"
                >
                  {submitError}
                </div>
              )}

              {/* Form Fields */}
              <RegisterForm
                form={form}
                isPending={register.isPending}
                showPassword={showPassword}
                onToggleShowPassword={() => setShowPassword(!showPassword)}
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

              <SocialLoginButtons
                dividerText="Hoặc đăng ký nhanh với"
                toastTitles={{
                  google: 'Đăng ký Google',
                  zalo: 'Đăng ký Zalo',
                  facebook: 'Đăng ký Facebook',
                }}
                toastMessages={{
                  google: 'Hệ thống đang tích hợp cổng Google One-Tap.',
                  zalo: 'Hệ thống đang mở liên kết xác thực qua Zalo OA.',
                  facebook: 'Cổng đăng ký qua Facebook đã sẵn sàng kết nối.',
                }}
              />

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="size-4 text-emerald-600" />
                <span>Hệ thống bảo vệ tài khoản và thông tin cá nhân an toàn</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
