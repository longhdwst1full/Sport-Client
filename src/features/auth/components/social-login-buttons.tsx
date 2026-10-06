import type { ReactNode } from 'react';
import { useToast } from '@/shared/components/global-toast';

type SocialProvider = 'google' | 'zalo' | 'facebook';

interface SocialLoginButtonsProps {
  dividerText: string;
  toastTitles: Record<SocialProvider, string>;
  toastMessages: Record<SocialProvider, string>;
}

/** Nút nhà cung cấp mang màu thương hiệu riêng nên không dùng `Button` variant. */
const SOCIAL_PROVIDERS: { key: SocialProvider; label: string; icon: ReactNode }[] = [
  {
    key: 'google',
    label: 'Google',
    icon: (
      <svg className="size-4" viewBox="0 0 24 24" aria-hidden>
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
    ),
  },
  {
    key: 'zalo',
    label: 'Zalo',
    icon: <span className="grid size-4 place-items-center rounded-full bg-[#0068FF] text-[10px] font-black text-white">Z</span>,
  },
  {
    key: 'facebook',
    label: 'Facebook',
    icon: <span className="grid size-4 place-items-center rounded-full bg-[#1877F2] text-[10px] font-black text-white">f</span>,
  },
];

/** Google/Zalo/Facebook button row with a divider whose copy differs between login and register. */
export function SocialLoginButtons({ dividerText, toastTitles, toastMessages }: SocialLoginButtonsProps) {
  const { toast } = useToast();

  return (
    <>
      {/* Social Logins Divider */}
      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{dividerText}</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      {/* Social Buttons */}
      <div className="grid grid-cols-3 gap-2.5">
        {SOCIAL_PROVIDERS.map(({ key, label, icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => toast({ title: toastTitles[key], message: toastMessages[key] })}
            className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            {icon}
            <span>{label}</span>
          </button>
        ))}
      </div>
    </>
  );
}
