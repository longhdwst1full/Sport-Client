import type { ComponentProps, ReactNode } from 'react';
import { ShieldCheck } from 'lucide-react';
import { InlineAlert } from '@/foundation/components/feedback';
import { AuthBrandPanel } from './auth-brand-panel';
import { AuthMobileHeader } from './auth-mobile-header';
import { AuthModeSwitcher } from './auth-mode-switcher';
import { SocialLoginButtons } from './social-login-buttons';

/**
 * Khung chung của trang đăng nhập/đăng ký: panel thương hiệu, thẻ form, switcher, lỗi gửi form,
 * đăng nhập mạng xã hội và dòng cam kết bảo mật. Trang chỉ cấp tiêu đề và form.
 */
export function AuthPageShell({
  variant,
  title,
  subtitle,
  submitError,
  social,
  children,
}: {
  variant: 'login' | 'register';
  title: string;
  subtitle: string;
  submitError?: string;
  social: ComponentProps<typeof SocialLoginButtons>;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white">
      <div className="grid min-h-screen lg:grid-cols-12">
        <AuthBrandPanel variant={variant} />

        <div className="flex flex-col justify-center px-4 py-10 sm:px-8 md:px-12 lg:col-span-6 xl:col-span-5 bg-white lg:bg-slate-50/70">
          <div className="mx-auto w-full max-w-md">
            <AuthMobileHeader />

            <div className="rounded-3xl bg-white sm:border sm:border-slate-200/80 sm:p-8 sm:shadow-xl sm:shadow-slate-200/50">
              <AuthModeSwitcher variant={variant} />

              <div className="mt-6">
                <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">{title}</h1>
                <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">{subtitle}</p>
              </div>

              {submitError && (
                <InlineAlert
                  role="alert"
                  className="mt-5 rounded-2xl border border-rose-200 bg-rose-50/80 p-3.5 text-xs font-semibold text-rose-700 animate-in fade-in"
                >
                  {submitError}
                </InlineAlert>
              )}

              {children}

              <SocialLoginButtons {...social} />

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="size-4 text-success-600" aria-hidden />
                <span>Hệ thống bảo vệ tài khoản và thông tin cá nhân an toàn</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
