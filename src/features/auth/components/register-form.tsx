import { useId, type ComponentType, type HTMLInputTypeAttribute, type SVGProps } from 'react';
import Link from 'next/link';
import type { UseFormReturn } from 'react-hook-form';
import { ArrowRight, Check, Lock, Mail, Phone, User } from 'lucide-react';
import { Button } from '@/foundation/components/buttons';
import { Checkbox, PasswordInput, TextInput } from '@/foundation/components/field-system';
import type { RegisterCustomerDto } from '@/generated/api/auth/auth.schemas';
import { AUTH_INPUT_CLASS, AUTH_LEADING_ICON_CLASS, AUTH_SUBMIT_CLASS, AuthField } from './auth-field';

interface RegisterFormProps {
  form: UseFormReturn<RegisterCustomerDto>;
  isPending: boolean;
  acceptedTerms: boolean;
  onAcceptedTermsChange: (checked: boolean) => void;
  onSubmit: (data: RegisterCustomerDto) => void;
}

type TextFieldName = Exclude<keyof RegisterCustomerDto, 'password'>;

const TEXT_FIELDS: {
  name: TextFieldName;
  label: string;
  required?: boolean;
  type?: HTMLInputTypeAttribute;
  autoComplete: string;
  placeholder: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}[] = [
  { name: 'displayName', label: 'Họ và tên của bạn', required: true, autoComplete: 'name', placeholder: 'Nguyễn Văn A', icon: User },
  { name: 'email', label: 'Địa chỉ Email', type: 'email', autoComplete: 'email', placeholder: 'email@example.com', icon: Mail },
  { name: 'phone', label: 'Số điện thoại', type: 'tel', autoComplete: 'tel', placeholder: '0912 345 678', icon: Phone },
];

const RequiredMark = () => <span className="text-red-500">*</span>;

const TERMS_LINK_CLASS =
  'font-bold text-neutral-900 hover:underline rounded focus-ring-tight';

function PasswordHint({ met, label }: { met: boolean; label: string }) {
  return (
    <span className={`inline-flex items-center gap-1 ${met ? 'text-success-700 font-bold' : ''}`}>
      <Check className={`size-3 ${met ? 'text-success-600' : 'text-neutral-300'}`} />
      {label}
    </span>
  );
}

export function RegisterForm({ form, isPending, acceptedTerms, onAcceptedTermsChange, onSubmit }: RegisterFormProps) {
  const fieldId = useId();
  const { errors } = form.formState;
  const passwordValue = form.watch('password') || '';
  const hasMinLen = passwordValue.length >= 8;
  const hasNumberOrSpecial = /[\d!@#$%^&*(),.?":{}|<>]/.test(passwordValue);
  const passwordId = `${fieldId}-password`;

  return (
    <form className="mt-3.5 space-y-2.5 sm:space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
      {TEXT_FIELDS.map(({ name, label, required, type, autoComplete, placeholder, icon: Icon }) => {
        const id = `${fieldId}-${name}`;
        return (
          <AuthField
            key={name}
            id={id}
            label={
              required ? (
                <>
                  {label} <RequiredMark />
                </>
              ) : (
                label
              )
            }
            error={errors[name]?.message}
          >
            <div className="relative mt-1">
              <TextInput
                {...form.register(name)}
                id={id}
                size="lg"
                invalid={Boolean(errors[name])}
                type={type}
                autoComplete={autoComplete}
                className={AUTH_INPUT_CLASS}
                placeholder={placeholder}
              />
              <Icon className={AUTH_LEADING_ICON_CLASS} />
            </div>
          </AuthField>
        );
      })}

      <AuthField
        id={passwordId}
        label={
          <>
            Mật khẩu <RequiredMark />
          </>
        }
        error={errors.password?.message}
        hint={
          <div className="mt-1 flex items-center gap-3 text-2xs text-neutral-500">
            <PasswordHint met={hasMinLen} label="8+ ký tự" />
            <PasswordHint met={hasNumberOrSpecial} label="Số hoặc ký tự đặc biệt" />
          </div>
        }
      >
        <PasswordInput
          {...form.register('password')}
          id={passwordId}
          size="lg"
          invalid={Boolean(errors.password)}
          autoComplete="new-password"
          wrapperClassName="mt-1"
          className={AUTH_INPUT_CLASS}
          placeholder="Tối thiểu 8 ký tự"
          leadingIcon={<Lock className={AUTH_LEADING_ICON_CLASS} />}
        />
      </AuthField>

      <div className="pt-0.5">
        <Checkbox
          checked={acceptedTerms}
          onChange={(e) => onAcceptedTermsChange(e.target.checked)}
          wrapperClassName="gap-2.5 py-0"
          label={
          <span className="text-xs font-medium text-neutral-600">
            Tôi đồng ý với{' '}
            <Link href="/terms" className={TERMS_LINK_CLASS}>
              Điều khoản dịch vụ
            </Link>{' '}
            và{' '}
            <Link href="/privacy" className={TERMS_LINK_CLASS}>
              Chính sách bảo mật
            </Link>{' '}
            của Bảo An Sport.
          </span>
          }
        />
      </div>

      <Button type="submit" size="lg" fullWidth disabled={isPending} className={AUTH_SUBMIT_CLASS}>
        {isPending ? (
          <span>Đang khởi tạo tài khoản…</span>
        ) : (
          <>
            <span>Tạo tài khoản</span>
            <ArrowRight className="size-4" aria-hidden />
          </>
        )}
      </Button>
    </form>
  );
}
