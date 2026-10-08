import Link from 'next/link';

type AuthMode = 'login' | 'register';

interface AuthModeSwitcherProps {
  variant: AuthMode;
}

const MODES: { mode: AuthMode; href: string; label: string }[] = [
  { mode: 'login', href: '/login', label: 'Đăng nhập' },
  { mode: 'register', href: '/register', label: 'Đăng ký tài khoản' },
];

const TAB_BASE =
  'flex min-h-9 sm:min-h-10 flex-1 items-center justify-center rounded-xl py-2 text-center text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900';
const TAB_ACTIVE = `${TAB_BASE} bg-white font-black text-slate-900 shadow-sm`;
const TAB_IDLE = `${TAB_BASE} font-bold text-slate-500 hover:text-slate-900`;

/** Segmented pill Login/Register switcher; highlights the active side. */
export function AuthModeSwitcher({ variant }: AuthModeSwitcherProps) {
  return (
    <div className="flex rounded-xl bg-slate-100 p-1">
      {MODES.map(({ mode, href, label }) => (
        <Link
          key={mode}
          href={href}
          aria-current={variant === mode ? 'page' : undefined}
          className={variant === mode ? TAB_ACTIVE : TAB_IDLE}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
