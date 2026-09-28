'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { ShieldCheck } from 'lucide-react';
import type { LoginDto } from '@/generated/api/auth/auth.schemas';
import { AuthBrandPanel } from '../components/auth-brand-panel';
import { AuthMobileHeader } from '../components/auth-mobile-header';
import { AuthModeSwitcher } from '../components/auth-mode-switcher';
import { LoginForm } from '../components/login-form';
import { SocialLoginButtons } from '../components/social-login-buttons';
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
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
      <div className="grid min-h-screen lg:grid-cols-12">
        {/* Left Side: Athletic Editorial & Brand Showcase (Desktop only) */}
        <AuthBrandPanel variant="login" />

        {/* Right Side: Authentication Form Experience */}
        <div className="flex flex-col justify-center px-4 py-10 sm:px-8 md:px-12 lg:col-span-6 xl:col-span-5 bg-white lg:bg-slate-50/70">
          <div className="mx-auto w-full max-w-md">
            <AuthMobileHeader />

            {/* Form Card Container */}
            <div className="rounded-3xl bg-white sm:border sm:border-slate-200/80 sm:p-8 sm:shadow-xl sm:shadow-slate-200/50">
              {/* Segmented Pill Switcher: Login / Register */}
              <AuthModeSwitcher variant="login" />

              {/* Title & Subtitle */}
              <div className="mt-6">
                <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  Đăng nhập
                </h1>
                <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                  Chào mừng bạn quay lại! Nhập email hoặc số điện thoại để tiếp tục mua sắm và theo dõi đơn hàng.
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
              <LoginForm
                form={form}
                isPending={login.isPending}
                onSubmit={(data) => {
                  setSubmitError('');
                  login.mutate({ data });
                }}
              />

              <SocialLoginButtons
                dividerText="Hoặc tiếp tục với"
                toastTitles={{
                  google: 'Đăng nhập Google',
                  zalo: 'Đăng nhập Zalo',
                  facebook: 'Đăng nhập Facebook',
                }}
                toastMessages={{
                  google: 'Hệ thống đang tích hợp cổng Google One-Tap.',
                  zalo: 'Hệ thống đang mở liên kết xác thực qua Zalo OA.',
                  facebook: 'Cổng đăng nhập qua Facebook đã sẵn sàng kết nối.',
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
