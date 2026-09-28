import Link from 'next/link';
import type { UseFormReturn } from 'react-hook-form';
import { ArrowRight, Check, Eye, EyeOff, Lock, Mail, Phone, User } from 'lucide-react';
import type { RegisterCustomerDto } from '@/generated/api/auth/auth.schemas';

interface RegisterFormProps {
  form: UseFormReturn<RegisterCustomerDto>;
  isPending: boolean;
  showPassword: boolean;
  onToggleShowPassword: () => void;
  acceptedTerms: boolean;
  onAcceptedTermsChange: (checked: boolean) => void;
  onSubmit: (data: RegisterCustomerDto) => void;
}

export function RegisterForm({
  form,
  isPending,
  showPassword,
  onToggleShowPassword,
  acceptedTerms,
  onAcceptedTermsChange,
  onSubmit,
}: RegisterFormProps) {
  const passwordValue = form.watch('password') || '';
  const hasMinLen = passwordValue.length >= 8;
  const hasNumberOrSpecial = /[\d!@#$%^&*(),.?":{}|<>]/.test(passwordValue);

  return (
    <form className="mt-6 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
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
            onClick={onToggleShowPassword}
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
            onChange={(e) => onAcceptedTermsChange(e.target.checked)}
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
        disabled={isPending}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 font-black text-white shadow-lg shadow-emerald-600/25 transition hover:from-emerald-500 hover:to-teal-500 hover:shadow-emerald-600/40 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? (
          <span>Đang khởi tạo tài khoản…</span>
        ) : (
          <>
            <span>Đăng ký & Nhận voucher 200.000đ</span>
            <ArrowRight className="size-4" />
          </>
        )}
      </button>
    </form>
  );
}
