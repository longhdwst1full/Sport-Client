'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import {
  Dumbbell,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
} from 'lucide-react';
import { useLoginCustomer } from '@/generated/api/auth/auth';
import type { LoginDto } from '@/generated/api/auth/models';
import { KineticBallCanvas } from '@/components/3d/kinetic-ball-canvas';
import { getCustomerAuthError } from './auth-error';
import { saveCustomerAuthTokens } from './auth-token.store';

const schema: yup.ObjectSchema<LoginDto> = yup.object({
  identifier: yup.string().trim().required('Nhập email hoặc số điện thoại').max(255),
  password: yup.string().required('Nhập mật khẩu').min(8, 'Mật khẩu tối thiểu 8 ký tự').max(128),
});

export function CustomerLoginPage() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginDto>({
    resolver: yupResolver(schema),
    defaultValues: { identifier: '', password: '' },
  });

  const login = useLoginCustomer({
    mutation: {
      onSuccess: (tokens) => {
        saveCustomerAuthTokens(tokens);
        router.replace('/');
      },
      onError: (error) =>
        setSubmitError(getCustomerAuthError(error, 'Đăng nhập không thành công.')),
    },
  });

  return (
    <main className="min-h-screen bg-[#0d1410] text-white">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left Side: Sports Club Branding & 3D Interactive Canvas */}
        <div className="relative hidden flex-col justify-between overflow-hidden border-r border-white/10 bg-gradient-to-br from-[#0c130f] via-[#121c16] to-[#0a100d] p-12 lg:flex">
          {/* Ambient light glow */}
          <div className="pointer-events-none absolute -left-20 -top-20 size-96 rounded-full bg-emerald-500/15 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-20 right-0 size-96 rounded-full bg-emerald-400/10 blur-[120px]" />

          {/* Top Logo */}
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-3 text-xl font-black">
              <span className="grid size-10 place-items-center rounded-xl bg-emerald-400 text-ink shadow-md shadow-emerald-400/30">
                <Dumbbell className="size-5" />
              </span>
              <span>DCTD SPORT CLUB</span>
            </Link>
          </div>

          {/* Center 3D Sports Ball Canvas & Headlines */}
          <div className="relative z-10 my-auto py-8">
            <div className="mx-auto max-w-sm">
              <KineticBallCanvas theme="emerald" height="320px" />
            </div>

            <div className="mt-4 text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-950/50 px-3.5 py-1 text-xs font-bold text-emerald-300 backdrop-blur-md">
                <Sparkles className="size-3.5" /> Đặc quyền hội viên DCTD
              </span>
              <h2 className="mt-4 text-3xl font-black text-white">
                Bứt phá giới hạn thể lực cùng trang bị chuyên nghiệp
              </h2>
              <p className="mt-3 text-sm text-stone-300">
                Đăng nhập để theo dõi trạng thái đơn hàng, kích hoạt bảo hành điện tử và nhận ưu đãi riêng theo môn tập.
              </p>
            </div>
          </div>

          {/* Bottom Perks Checklist */}
          <div className="relative z-10 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 text-xs text-stone-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-400" />
              <span>Tích điểm 5% mọi đơn hàng</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-400" />
              <span>Bảo hành chính hãng tại nhà</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-400" />
              <span>Tư vấn bài tập từ HLV miễn phí</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-400" />
              <span>Đổi mới hỏa tốc trong 7 ngày</span>
            </div>
          </div>
        </div>

        {/* Right Side: Authentication Form */}
        <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
          <div className="mx-auto w-full max-w-md">
            {/* Mobile Logo Link */}
            <div className="mb-8 lg:hidden">
              <Link href="/" className="inline-flex items-center gap-2.5 text-lg font-black text-white">
                <span className="grid size-9 place-items-center rounded-xl bg-emerald-400 text-ink">
                  <Dumbbell className="size-4.5" />
                </span>
                <span>DCTD SPORT</span>
              </Link>
            </div>

            {/* Form Header */}
            <div>
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="border-b-2 border-emerald-400 pb-2 text-xl font-black text-white"
                >
                  Đăng nhập
                </Link>
                <span className="pb-2 text-stone-500">·</span>
                <Link
                  href="/register"
                  className="pb-2 text-xl font-black text-stone-500 transition hover:text-stone-300"
                >
                  Đăng ký
                </Link>
              </div>
              <p className="mt-3 text-sm text-stone-400">
                Chào mừng bạn trở lại! Vui lòng nhập email hoặc số điện thoại.
              </p>
            </div>

            {/* Error Message */}
            {submitError && (
              <div
                role="alert"
                className="mt-6 rounded-2xl border border-red-500/30 bg-red-950/40 p-4 text-xs font-semibold text-red-300"
              >
                {submitError}
              </div>
            )}

            {/* Form */}
            <form
              className="mt-6 space-y-4"
              onSubmit={form.handleSubmit((data) => {
                setSubmitError('');
                login.mutate({ data });
              })}
            >
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300">
                  Email hoặc Số điện thoại
                </label>
                <div className="relative mt-2">
                  <input
                    {...form.register('identifier')}
                    autoComplete="username"
                    className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3.5 pl-11 text-sm text-white placeholder-stone-500 outline-none transition focus:border-emerald-400 focus:bg-white/10 focus:ring-4 focus:ring-emerald-500/20"
                    placeholder="email@example.com hoặc 0912 345 678"
                  />
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                </div>
                {form.formState.errors.identifier && (
                  <span className="mt-1.5 block text-xs font-medium text-red-400">
                    {form.formState.errors.identifier.message}
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-300">
                    Mật khẩu
                  </label>
                  <a href="#" className="text-xs font-medium text-emerald-400 hover:underline">
                    Quên mật khẩu?
                  </a>
                </div>
                <div className="relative mt-2">
                  <input
                    {...form.register('password')}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3.5 pl-11 pr-11 text-sm text-white placeholder-stone-500 outline-none transition focus:border-emerald-400 focus:bg-white/10 focus:ring-4 focus:ring-emerald-500/20"
                    placeholder="Tối thiểu 8 ký tự"
                  />
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 transition hover:text-white"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <span className="mt-1.5 block text-xs font-medium text-red-400">
                    {form.formState.errors.password.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={login.isPending}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-emerald-400 px-6 py-4 font-black text-ink shadow-lg shadow-emerald-400/25 transition hover:bg-emerald-300 hover:shadow-emerald-400/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {login.isPending ? (
                  <span>Đang xác thực tài khoản…</span>
                ) : (
                  <>
                    <span>Đăng nhập ngay</span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Credentials Info Note */}
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-stone-400">
              <div className="flex items-center gap-2 font-bold text-stone-300">
                <ShieldCheck className="size-4 text-emerald-400" />
                <span>Mẹo kiểm thử nhanh:</span>
              </div>
              <p className="mt-1 leading-relaxed">
                Bạn có thể đăng nhập bằng tài khoản mẫu hoặc bấm{' '}
                <Link href="/register" className="font-bold text-emerald-400 underline">
                  Đăng ký tài khoản mới
                </Link>{' '}
                chỉ mất 10 giây (không cần OTP ở V1).
              </p>
            </div>

            {/* Back to Storefront Link */}
            <div className="mt-8 text-center">
              <Link href="/" className="text-xs font-bold text-stone-400 transition hover:text-white">
                ← Quay lại trang chủ mua sắm
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
