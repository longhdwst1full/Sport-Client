'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { PasswordInput } from '@/foundation/components/field-system';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Lock,
  Mail,
  Truck,
  RotateCcw,
  Star,
  Award,
  PhoneCall,
} from 'lucide-react';
import { useLoginCustomer } from '@/generated/api/auth/auth';
import type { LoginDto } from '@/generated/api/auth/auth.schemas';
import { useToast } from '@/shared/components/global-toast';
import { syncCartAfterAuth } from '@/features/cart';
import { hydrateCart } from '@/features/cart';
import { storefrontStore } from '@/app/store/store';
import { getCustomerAuthError } from '../model/auth-error';
import { saveCustomerAuthTokens } from '@/core/auth/customer-auth-token.store';

const schema: yup.ObjectSchema<LoginDto> = yup.object({
  identifier: yup.string().trim().required('Vui lòng nhập email hoặc số điện thoại').max(255),
  password: yup.string().required('Vui lòng nhập mật khẩu').min(8, 'Mật khẩu tối thiểu 8 ký tự').max(128),
  rememberMe: yup.boolean().optional(),
});

export function CustomerLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [submitError, setSubmitError] = useState('');

  const form = useForm<LoginDto>({
    resolver: yupResolver(schema),
    defaultValues: { identifier: '', password: '', rememberMe: true },
  });

  const login = useLoginCustomer({
    mutation: {
      onSuccess: async (tokens) => {
        saveCustomerAuthTokens(tokens);
        toast({
          type: 'success',
          title: 'Đăng nhập thành công',
          message: 'Chào mừng bạn quay trở lại với Bảo An Sport!',
        });
        const accountItems = await syncCartAfterAuth(storefrontStore.getState().cart.items);
        if (accountItems) storefrontStore.dispatch(hydrateCart(accountItems));
        router.replace('/');
      },
      onError: (error) => {
        const msg = getCustomerAuthError(error, 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.');
        setSubmitError(msg);
        toast({
          type: 'error',
          title: 'Đăng nhập thất bại',
          message: msg,
        });
      },
    },
  });



  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
      <div className="grid min-h-screen lg:grid-cols-12">
        {/* Left Side: Athletic Editorial & Brand Showcase (Desktop only) */}
        <div className="relative hidden lg:col-span-6 xl:col-span-7 lg:flex flex-col justify-between overflow-hidden bg-slate-950 p-10 xl:p-14 text-white">
          {/* Background Photography with Depth Overlays */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/banners/slide-may-chay-bo.jpg"
              alt="Bảo An Sport Athlete Training"
              fill
              priority
              className="object-cover object-center brightness-[0.4] contrast-125 saturate-75 transition-transform duration-1000 scale-105"
            />
            {/* Rich gradient layers */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-900/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-transparent to-transparent" />
            <div className="pointer-events-none absolute -left-20 -top-20 size-96 rounded-full bg-emerald-500/20 blur-[130px]" />
            <div className="pointer-events-none absolute -bottom-20 right-10 size-96 rounded-full bg-teal-500/15 blur-[140px]" />
          </div>

          {/* Top Bar: Brand Logo & Return Link */}
          <div className="relative z-10 flex items-center justify-between">
            <Link href="/" className="group inline-flex items-center gap-3">
              <div className="relative h-11 w-48 transition-transform group-hover:scale-105">
                <Image
                  src="/images/logo.png"
                  alt="Bảo An Sport — Dụng Cụ Thể Thao Chính Hãng"
                  fill
                  priority
                  className="object-contain object-left"
                />
              </div>
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 backdrop-blur-md transition hover:bg-white/15 hover:text-white"
            >
              <ArrowLeft className="size-3.5" />
              <span>Trang chủ</span>
            </Link>
          </div>

          {/* Center: Editorial Athletic Showcase */}
          <div className="relative z-10 my-auto py-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-950/60 px-4 py-1.5 text-xs font-extrabold text-emerald-300 backdrop-blur-md">
              <Sparkles className="size-4 text-emerald-400" />
              <span>Đặc Quyền Hội Viên Thể Thao Bảo An</span>
            </div>

            <h2 className="mt-5 text-3xl font-black leading-tight text-white xl:text-4xl">
              Nâng tầm thể lực cùng trang bị <br className="hidden xl:inline" />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
                chuẩn thi đấu chuyên nghiệp
              </span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300">
              Đăng nhập để theo dõi lộ trình đơn hàng, kích hoạt bảo hành điện tử chính hãng 24 tháng và tận hưởng dịch vụ giao lắp chuyên nghiệp từ Bảo An Sport.
            </p>

            {/* Quick Metrics Bento Grid */}
            <div className="mt-8 grid grid-cols-3 gap-3.5">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md transition hover:bg-white/10">
                <div className="text-2xl font-black text-emerald-400 xl:text-3xl">50K+</div>
                <div className="mt-1 text-xs font-bold text-slate-300">Hội viên tin chọn</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md transition hover:bg-white/10">
                <div className="text-2xl font-black text-emerald-400 xl:text-3xl">100%</div>
                <div className="mt-1 text-xs font-bold text-slate-300">Chính hãng Bảo An</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md transition hover:bg-white/10">
                <div className="text-2xl font-black text-emerald-400 xl:text-3xl">24/7</div>
                <div className="mt-1 text-xs font-bold text-slate-300">Tư vấn kỹ thuật</div>
              </div>
            </div>

            {/* Social Proof Quote */}
            <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-slate-900/60 p-4 backdrop-blur-md">
              <div className="flex items-center gap-1 text-amber-400 text-xs font-bold mb-1.5">
                <Star className="size-3.5 fill-amber-400" />
                <Star className="size-3.5 fill-amber-400" />
                <Star className="size-3.5 fill-amber-400" />
                <Star className="size-3.5 fill-amber-400" />
                <Star className="size-3.5 fill-amber-400" />
                <span className="ml-1 text-slate-300 text-[11px]">4.9/5 (12.800+ đánh giá xác thực)</span>
              </div>
              <p className="text-xs italic text-slate-300 leading-relaxed">
                &ldquo;Trang bị tập luyện của Bảo An Sport chắc chắn, khung thép dày, máy chạy rất đầm và êm. Dịch vụ bảo hành tận nơi cực kỳ an tâm.&rdquo;
              </p>
              <div className="mt-2 text-[11px] font-bold text-emerald-300">
                — HLV. Tuấn Anh (HLV Thể Hình & Marathoner)
              </div>
            </div>
          </div>

          {/* Bottom Trust Commitments */}
          <div className="relative z-10 grid grid-cols-2 gap-3.5 border-t border-white/10 pt-6 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
              <span>Miễn phí lắp đặt tại nhà</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 shrink-0 text-emerald-400" />
              <span>Bảo hành chính hãng 24 tháng</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="size-4 shrink-0 text-emerald-400" />
              <span>1 đổi 1 trong 7 ngày nếu có lỗi</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="size-4 shrink-0 text-emerald-400" />
              <span>Tích điểm thưởng 5% trọn đời</span>
            </div>
          </div>
        </div>

        {/* Right Side: Authentication Form Experience */}
        <div className="flex flex-col justify-center px-4 py-10 sm:px-8 md:px-12 lg:col-span-6 xl:col-span-5 bg-white lg:bg-slate-50/70">
          <div className="mx-auto w-full max-w-md">
            {/* Mobile Header Brand & Back */}
            <div className="mb-6 flex items-center justify-between lg:hidden">
              <Link href="/" className="inline-flex items-center">
                <div className="relative h-9 w-40">
                  <Image
                    src="/images/logo.png"
                    alt="Bảo An Sport"
                    fill
                    priority
                    className="object-contain object-left"
                  />
                </div>
              </Link>

              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 shadow-sm transition hover:bg-slate-50"
              >
                <ArrowLeft className="size-3.5" />
                <span>Trang chủ</span>
              </Link>
            </div>

            {/* Desktop Back Link */}
            <div className="hidden lg:block mb-5">
              <Link
                href="/"
                className="group inline-flex items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-emerald-600"
              >
                <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
                <span>Quay lại trang chủ mua sắm</span>
              </Link>
            </div>

            {/* Form Card Container */}
            <div className="rounded-3xl bg-white sm:border sm:border-slate-200/80 sm:p-8 sm:shadow-xl sm:shadow-slate-200/50">
              {/* Segmented Pill Switcher: Login / Register */}
              <div className="flex rounded-2xl bg-slate-100 p-1.5">
                <Link
                  href="/login"
                  className="flex-1 rounded-xl bg-white py-2.5 text-center text-xs font-black text-slate-900 shadow-sm transition"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="flex-1 rounded-xl py-2.5 text-center text-xs font-bold text-slate-500 transition hover:text-slate-900"
                >
                  Đăng ký tài khoản
                </Link>
              </div>

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
              <form
                className="mt-6 space-y-4"
                onSubmit={form.handleSubmit((data) => {
                  setSubmitError('');
                  login.mutate({ data });
                })}
              >
                {/* Identifier Input */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Email hoặc Số điện thoại
                  </label>
                  <div className="relative mt-2">
                    <input
                      {...form.register('identifier')}
                      autoComplete="username"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3.5 pl-11 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/15"
                      placeholder="email@example.com hoặc 0912 345 678"
                    />
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  </div>
                  {form.formState.errors.identifier && (
                    <span className="mt-1.5 block text-xs font-medium text-rose-600">
                      {form.formState.errors.identifier.message}
                    </span>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Mật khẩu
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
                    >
                      Quên mật khẩu?
                    </Link>
                  </div>
                  <PasswordInput
                    {...form.register('password')}
                    autoComplete="current-password"
                    wrapperClassName="relative mt-2"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3.5 pl-11 pr-11 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/15"
                    placeholder="Nhập tối thiểu 8 ký tự"
                    leadingIcon={<Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />}
                    toggleClassName="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  />
                  {form.formState.errors.password && (
                    <span className="mt-1.5 block text-xs font-medium text-rose-600">
                      {form.formState.errors.password.message}
                    </span>
                  )}
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex cursor-pointer items-center gap-2.5 text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      {...form.register('rememberMe')}
                      className="size-4 rounded-md border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Ghi nhớ đăng nhập trên thiết bị này</span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={login.isPending}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 font-black text-white shadow-lg shadow-emerald-600/25 transition hover:from-emerald-500 hover:to-teal-500 hover:shadow-emerald-600/40 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {login.isPending ? (
                    <span>Đang xác thực thông tin…</span>
                  ) : (
                    <>
                      <span>Đăng nhập ngay</span>
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Social Logins Divider */}
              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Hoặc tiếp tục với
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              {/* Social Buttons */}
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() =>
                    toast({
                      title: 'Đăng nhập Google',
                      message: 'Hệ thống đang tích hợp cổng Google One-Tap.',
                    })
                  }
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <svg className="size-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.13z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.93 6.72-4.93z"
                    />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    toast({
                      title: 'Đăng nhập Zalo',
                      message: 'Hệ thống đang mở liên kết xác thực qua Zalo OA.',
                    })
                  }
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <span className="grid size-4 place-items-center rounded-full bg-[#0068FF] text-[10px] font-black text-white">
                    Z
                  </span>
                  <span>Zalo</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    toast({
                      title: 'Đăng nhập Facebook',
                      message: 'Cổng đăng nhập qua Facebook đã sẵn sàng kết nối.',
                    })
                  }
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <span className="grid size-4 place-items-center rounded-full bg-[#1877F2] text-[10px] font-black text-white">
                    f
                  </span>
                  <span>Facebook</span>
                </button>
              </div>

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
