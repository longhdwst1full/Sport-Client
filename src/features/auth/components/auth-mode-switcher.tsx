import Link from 'next/link';

interface AuthModeSwitcherProps {
  variant: 'login' | 'register';
}

/** Segmented pill Login/Register switcher; highlights the active side. */
export function AuthModeSwitcher({ variant }: AuthModeSwitcherProps) {
  return (
    <div className="flex rounded-2xl bg-slate-100 p-1.5">
      <Link
        href="/login"
        className={
          variant === 'login'
            ? 'flex-1 rounded-xl bg-white py-2.5 text-center text-xs font-black text-slate-900 shadow-sm transition'
            : 'flex-1 rounded-xl py-2.5 text-center text-xs font-bold text-slate-500 transition hover:text-slate-900'
        }
      >
        Đăng nhập
      </Link>
      <Link
        href="/register"
        className={
          variant === 'register'
            ? 'flex-1 rounded-xl bg-white py-2.5 text-center text-xs font-black text-slate-900 shadow-sm transition'
            : 'flex-1 rounded-xl py-2.5 text-center text-xs font-bold text-slate-500 transition hover:text-slate-900'
        }
      >
        Đăng ký tài khoản
      </Link>
    </div>
  );
}
