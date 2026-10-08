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
    <main className="min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden bg-slate-50 text-slate-900 selection:bg-slate-900 selection:text-white">
      <div className="grid min-h-screen lg:h-full lg:max-h-screen lg:grid-cols-12">
        <AuthBrandPanel variant={variant} />

        <div className="flex flex-col justify-center px-4 py-6 sm:px-6 md:px-10 lg:col-span-6 xl:col-span-5 bg-white lg:bg-slate-50/70 lg:h-full lg:overflow-y-auto">
          <div className="mx-auto w-full max-w-md my-auto">
            <AuthMobileHeader />

            <div className="rounded-2xl sm:rounded-3xl bg-white sm:border sm:border-slate-200/80 p-5 sm:p-6 lg:p-6.5 sm:shadow-xl sm:shadow-slate-200/50">
              <AuthModeSwitcher variant={variant} />

              <div className="mt-4 sm:mt-5">
                <h1 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">{title}</h1>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed line-clamp-2">{subtitle}</p>
              </div>

              {submitError && (
                <InlineAlert
                  role="alert"
                  className="mt-3.5 rounded-xl border border-rose-200 bg-rose-50/80 p-3 text-xs font-semibold text-rose-700 animate-in fade-in"
                >
                  {submitError}
                </InlineAlert>
              )}

              {children}

              <SocialLoginButtons {...social} />

              <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="size-3.5 text-success-600" aria-hidden />
                <span>Bảo mật thông tin tài khoản đạt chuẩn SSL 256-bit</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
