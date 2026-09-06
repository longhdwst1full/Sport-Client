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
  Phone,
  User,
} from 'lucide-react';
import { useRegisterCustomer } from '@/generated/api/auth/auth';
import type { RegisterCustomerDto } from '@/generated/api/auth/models';
import { KineticBallCanvas } from '@/components/3d/kinetic-ball-canvas';
import { getCustomerAuthError } from './auth-error';
import { saveCustomerAuthTokens } from './auth-token.store';

const optionalIdentity = () =>
  yup
    .string()
    .trim()
    .transform((value) => value || undefined)
    .optional();

const schema: yup.ObjectSchema<RegisterCustomerDto> = yup
  .object({
    displayName: yup.string().trim().required('Vui lòng nhập họ và tên').max(255),
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
  const [submitError, setSubmitError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<RegisterCustomerDto>({
    resolver: yupResolver(schema),
    defaultValues: { displayName: '', email: '', phone: '', password: '' },
  });

  const register = useRegisterCustomer({
    mutation: {
      onSuccess: (tokens) => {
        saveCustomerAuthTokens(tokens);
        router.replace('/');
      },
      onError: (error) =>
        setSubmitError(getCustomerAuthError(error, 'Đăng ký tài khoản không thành công.')),
    },
  });

  return (
    <main className="min-h-screen bg-[#0d1410] text-white">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left Side: Sports Club Branding & 3D Interactive Canvas */}
        <div className="relative hidden flex-col justify-between overflow-hidden border-r border-white/10 bg-gradient-to-br from-[#0c130f] via-[#121c16] to-[#0a100d] p-12 lg:flex">
          <div className="pointer-events-none absolute -left-20 -top-20 size-96 rounded-full bg-emerald-500/15 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-20 right-0 size-96 rounded-full bg-emerald-400/10 blur-[120px]" />

          {/* Top Logo */}
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-3 text-xl font-black">
              <span className="grid size-10 place-items-center rounded-xl bg-emerald-400 text-ink shadow-md shadow-emerald-400/30">
                <Dumbbell className="size-5" />
              </span>
              <span>BẢO AN SPORT CLUB</span>
            </Link>
          </div>

          {/* Center 3D Sports Ball Canvas & Headlines */}
          <div className="relative z-10 my-auto py-6">
            <div className="mx-auto max-w-sm">
              <KineticBallCanvas theme="emerald" height="300px" />
            </div>

            <div className="mt-4 text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-950/50 px-3.5 py-1 text-xs font-bold text-emerald-300 backdrop-blur-md">
                <Sparkles className="size-3.5" /> Quà tặng thành viên mới
              </span>
              <h2 className="mt-4 text-3xl font-black text-white">
                Gia nhập cộng đồng người yêu thể thao Việt Nam
              </h2>
              <p className="mt-3 text-sm text-stone-300">
                Nhận ngay voucher chào mừng 200.000đ cho đơn hàng thiết bị đầu tiên và tích lũy điểm hạng thành viên.
              </p>
            </div>
          </div>

          {/* Bottom Perks */}
          <div className="relative z-10 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 text-xs text-stone-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-400" />
              <span>Miễn phí giao lắp đặt toàn quốc</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-400" />
              <span>Bảo hành chính hãng 24 tháng</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-400" />
              <span>1 đổi 1 trong 7 ngày đầu</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-400" />
              <span>Hỗ trợ kỹ thuật 24/7 trọn đời</span>
            </div>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
          <div className="mx-auto w-full max-w-md">
            {/* Mobile Logo Link */}
            <div className="mb-8 lg:hidden">
              <Link href="/" className="inline-flex items-center gap-2.5 text-lg font-black text-white">
                <span className="grid size-9 place-items-center rounded-xl bg-emerald-400 text-ink">
                  <Dumbbell className="size-4.5" />
                </span>
                <span>BẢO AN SPORT</span>
              </Link>
            </div>

            {/* Form Header Tabs */}
            <div>
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="pb-2 text-xl font-black text-stone-500 transition hover:text-stone-300"
                >
                  Đăng nhập
                </Link>
                <span className="pb-2 text-stone-500">·</span>
                <Link
                  href="/register"
                  className="border-b-2 border-emerald-400 pb-2 text-xl font-black text-white"
                >
                  Đăng ký
                </Link>
              </div>
              <p className="mt-3 text-sm text-stone-400">
                Tạo tài khoản hội viên nhanh chóng chỉ với 1 bước đơn giản.
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

            {/* Registration Form */}
            <form
              className="mt-6 space-y-4"
              onSubmit={form.handleSubmit((data) => {
                setSubmitError('');
                register.mutate({ data });
              })}
            >
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300">
                  Họ và tên của bạn
                </label>
                <div className="relative mt-2">
                  <input
                    {...form.register('displayName')}
                    autoComplete="name"
                    className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3.5 pl-11 text-sm text-white placeholder-stone-500 outline-none transition focus:border-emerald-400 focus:bg-white/10 focus:ring-4 focus:ring-emerald-500/20"
                    placeholder="Nguyễn Văn A"
                  />
                  <User className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                </div>
                {form.formState.errors.displayName && (
                  <span className="mt-1.5 block text-xs font-medium text-red-400">
                    {form.formState.errors.displayName.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300">
                  Email
                </label>
                <div className="relative mt-2">
                  <input
                    {...form.register('email')}
                    type="email"
                    autoComplete="email"
                    className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3.5 pl-11 text-sm text-white placeholder-stone-500 outline-none transition focus:border-emerald-400 focus:bg-white/10 focus:ring-4 focus:ring-emerald-500/20"
                    placeholder="email@example.com"
                  />
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                </div>
                {form.formState.errors.email && (
                  <span className="mt-1.5 block text-xs font-medium text-red-400">
                    {form.formState.errors.email.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300">
                  Số điện thoại Việt Nam
                </label>
                <div className="relative mt-2">
                  <input
                    {...form.register('phone')}
                    type="tel"
                    autoComplete="tel"
                    className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3.5 pl-11 text-sm text-white placeholder-stone-500 outline-none transition focus:border-emerald-400 focus:bg-white/10 focus:ring-4 focus:ring-emerald-500/20"
                    placeholder="0912 345 678"
                  />
                  <Phone className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                </div>
                {form.formState.errors.phone && (
                  <span className="mt-1.5 block text-xs font-medium text-red-400">
                    {form.formState.errors.phone.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300">
                  Mật khẩu
                </label>
                <div className="relative mt-2">
                  <input
                    {...form.register('password')}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
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
                disabled={register.isPending}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-emerald-400 px-6 py-4 font-black text-ink shadow-lg shadow-emerald-400/25 transition hover:bg-emerald-300 hover:shadow-emerald-400/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {register.isPending ? (
                  <span>Đang khởi tạo tài khoản…</span>
                ) : (
                  <>
                    <span>Đăng ký & Tham gia ngay</span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>
            </form>

            {/* Social Logins Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Hoặc đăng ký nhanh với</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-bold text-stone-200 transition hover:bg-white/10 hover:border-white/20"
              >
                <span className="font-extrabold text-red-400">G</span> Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-bold text-stone-200 transition hover:bg-white/10 hover:border-white/20"
              >
                <span className="font-extrabold text-blue-400">Z</span> Zalo
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-bold text-stone-200 transition hover:bg-white/10 hover:border-white/20"
              >
                <span className="font-extrabold text-blue-500">f</span> Facebook
              </button>
            </div>

            <p className="mt-6 text-center text-xs text-stone-400">
              Bằng việc đăng ký, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của Bảo An Sport.
            </p>

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
