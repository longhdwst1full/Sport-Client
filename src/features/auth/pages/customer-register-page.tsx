'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import {
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Lock,
  Mail,
  Phone,
  User,
  Award,
  Check,
} from 'lucide-react';
import { useRegisterCustomer } from '@/generated/api/auth/auth';
import type { RegisterCustomerDto } from '@/generated/api/auth/auth.schemas';
import { useToast } from '@/shared/components/global-toast';
import { getCustomerAuthError } from '../model/auth-error';
import { saveCustomerAuthTokens } from '../model/auth-token.store';
import { syncCartAfterAuth } from '@/features/cart';
import { hydrateCart } from '@/app/store/cart.slice';
import { storefrontStore } from '@/app/store/store';

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
  const router = useRouter();
  const { toast } = useToast();
  const [submitError, setSubmitError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(true);

  const form = useForm<RegisterCustomerDto>({
    resolver: yupResolver(schema),
    defaultValues: { displayName: '', email: '', phone: '', password: '' },
  });

  const passwordValue = form.watch('password') || '';
  const hasMinLen = passwordValue.length >= 8;
  const hasNumberOrSpecial = /[\d!@#$%^&*(),.?":{}|<>]/.test(passwordValue);

  const register = useRegisterCustomer({
    mutation: {
      onSuccess: async (tokens) => {
        saveCustomerAuthTokens(tokens);
        toast({
          type: 'success',
          title: 'Đăng ký thành công',
          message: 'Chào mừng bạn gia nhập cộng đồng Bảo An Sport!',
        });
        const accountItems = await syncCartAfterAuth(storefrontStore.getState().cart.items);
        if (accountItems) storefrontStore.dispatch(hydrateCart(accountItems));
        router.replace('/');
      },
      onError: (error) => {
        const msg = getCustomerAuthError(error, 'Đăng ký tài khoản không thành công. Vui lòng thử lại.');
        setSubmitError(msg);
        toast({
          type: 'error',
          title: 'Đăng ký thất bại',
          message: msg,
        });
      },
    },
  });

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
      <div className="grid min-h-screen lg:grid-cols-12">
        {/* Left Side: Athletic Editorial & Welcome Package (Desktop only) */}
        <div className="relative hidden lg:col-span-6 xl:col-span-7 lg:flex flex-col justify-between overflow-hidden bg-slate-950 p-10 xl:p-14 text-white">
          {/* Background Photography with Gym / Bike Atmosphere */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/banners/slide-xe-dap-tap.jpg"
              alt="Bảo An Sport Member Experience"
              fill
              priority
              className="object-cover object-center brightness-[0.38] contrast-125 saturate-75 transition-transform duration-1000 scale-105"
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

          {/* Center: Editorial Welcome Perks Showcase */}
          <div className="relative z-10 my-auto py-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-950/60 px-4 py-1.5 text-xs font-extrabold text-emerald-300 backdrop-blur-md">
              <Sparkles className="size-4 text-emerald-400" />
              <span>Đặc Quyền Thành Viên Mới 2026</span>
            </div>

            <h2 className="mt-5 text-3xl font-black leading-tight text-white xl:text-4xl">
              Gia nhập Bảo An Sport, <br className="hidden xl:inline" />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
                đồng hành cùng thể lực đỉnh cao
              </span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300">
              Khởi động hành trình rèn luyện thể chất với trang thiết bị chuẩn thi đấu. Nhận ngay đặc quyền giao lắp tận nơi và chế độ bảo hành chính hãng toàn diện.
            </p>

            {/* Welcome Perks Cards Grid */}
            <div className="mt-8 grid grid-cols-3 gap-3.5">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md transition hover:bg-white/10">
                <div className="text-2xl font-black text-emerald-400 xl:text-3xl">100%</div>
                <div className="mt-1 text-xs font-bold text-slate-300">Chính hãng phân phối</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md transition hover:bg-white/10">
                <div className="text-2xl font-black text-emerald-400 xl:text-3xl">0đ</div>
                <div className="mt-1 text-xs font-bold text-slate-300">Tư vấn lộ trình 1:1</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md transition hover:bg-white/10">
                <div className="text-2xl font-black text-emerald-400 xl:text-3xl">24T</div>
                <div className="mt-1 text-xs font-bold text-slate-300">Bảo hành điện tử</div>
              </div>
            </div>

            {/* Service Commitment Box */}
            <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-slate-900/60 p-4 backdrop-blur-md">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1.5">
                <ShieldCheck className="size-4" />
                <span>Cam kết chất lượng dịch vụ</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Trang bị thể thao chuẩn thi đấu, hỗ trợ giao lắp tận nơi và bảo dưỡng định kỳ trọn đời cho mọi hội viên Bảo An Sport.
              </p>
            </div>
          </div>

          {/* Bottom Trust Commitments */}
          <div className="relative z-10 grid grid-cols-2 gap-3.5 border-t border-white/10 pt-6 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
              <span>Giao lắp hỏa tốc toàn quốc</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 shrink-0 text-emerald-400" />
              <span>Cam kết 100% chính hãng</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
              <span>Đổi mới trong 7 ngày nếu lỗi</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="size-4 shrink-0 text-emerald-400" />
              <span>Hỗ trợ kỹ thuật 24/7 trọn đời</span>
            </div>
          </div>
        </div>

        {/* Right Side: Registration Form Experience */}
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
                  className="flex-1 rounded-xl py-2.5 text-center text-xs font-bold text-slate-500 transition hover:text-slate-900"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="flex-1 rounded-xl bg-white py-2.5 text-center text-xs font-black text-slate-900 shadow-sm transition"
                >
                  Đăng ký tài khoản
                </Link>
              </div>

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
              <form
                className="mt-6 space-y-4"
                onSubmit={form.handleSubmit((data) => {
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
                })}
              >
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Họ và tên của bạn <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative mt-2">
                    <input
                      {...form.register('displayName')}
                      autoComplete="name"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3.5 pl-11 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/15"
                      placeholder="Nguyễn Văn A"
                    />
                    <User className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  </div>
                  {form.formState.errors.displayName && (
                    <span className="mt-1.5 block text-xs font-medium text-rose-600">
                      {form.formState.errors.displayName.message}
                    </span>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Địa chỉ Email
                  </label>
                  <div className="relative mt-2">
                    <input
                      {...form.register('email')}
                      type="email"
                      autoComplete="email"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3.5 pl-11 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/15"
                      placeholder="email@example.com"
                    />
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  </div>
                  {form.formState.errors.email && (
                    <span className="mt-1.5 block text-xs font-medium text-rose-600">
                      {form.formState.errors.email.message}
                    </span>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Số điện thoại
                  </label>
                  <div className="relative mt-2">
                    <input
                      {...form.register('phone')}
                      type="tel"
                      autoComplete="tel"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3.5 pl-11 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/15"
                      placeholder="0912 345 678"
                    />
                    <Phone className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  </div>
                  {form.formState.errors.phone && (
                    <span className="mt-1.5 block text-xs font-medium text-rose-600">
                      {form.formState.errors.phone.message}
                    </span>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Mật khẩu <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative mt-2">
                    <input
                      {...form.register('password')}
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3.5 pl-11 pr-11 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/15"
                      placeholder="Tối thiểu 8 ký tự"
                    />
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  {form.formState.errors.password && (
                    <span className="mt-1.5 block text-xs font-medium text-rose-600">
                      {form.formState.errors.password.message}
                    </span>
                  )}

                  {/* Password helper hints */}
                  <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-500">
                    <span className={`inline-flex items-center gap-1 ${hasMinLen ? 'text-emerald-600 font-bold' : ''}`}>
                      <Check className={`size-3 ${hasMinLen ? 'text-emerald-600' : 'text-slate-300'}`} />
                      8+ ký tự
                    </span>
                    <span className={`inline-flex items-center gap-1 ${hasNumberOrSpecial ? 'text-emerald-600 font-bold' : ''}`}>
                      <Check className={`size-3 ${hasNumberOrSpecial ? 'text-emerald-600' : 'text-slate-300'}`} />
                      Số hoặc ký tự đặc biệt
                    </span>
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="pt-2">
                  <label className="flex cursor-pointer items-start gap-2.5 text-xs font-medium text-slate-600">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="mt-0.5 size-4 rounded-md border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>
                      Tôi đồng ý với{' '}
                      <Link href="/terms" className="font-bold text-emerald-700 hover:underline">
                        Điều khoản dịch vụ
                      </Link>{' '}
                      và{' '}
                      <Link href="/privacy" className="font-bold text-emerald-700 hover:underline">
                        Chính sách bảo mật
                      </Link>{' '}
                      của Bảo An Sport.
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={register.isPending}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 font-black text-white shadow-lg shadow-emerald-600/25 transition hover:from-emerald-500 hover:to-teal-500 hover:shadow-emerald-600/40 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {register.isPending ? (
                    <span>Đang khởi tạo tài khoản…</span>
                  ) : (
                    <>
                      <span>Đăng ký & Nhận voucher 200.000đ</span>
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Social Logins Divider */}
              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Hoặc đăng ký nhanh với
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              {/* Social Buttons */}
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() =>
                    toast({
                      title: 'Đăng ký Google',
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
                      title: 'Đăng ký Zalo',
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
                      title: 'Đăng ký Facebook',
                      message: 'Cổng đăng ký qua Facebook đã sẵn sàng kết nối.',
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
