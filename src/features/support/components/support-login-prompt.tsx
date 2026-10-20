import Link from 'next/link';
import { buttonVariants } from '@/foundation/components/buttons';

export function SupportLoginPrompt({ title }: { title: string }) {
  return (
    <section className="surface-card p-10 text-center shadow-sm">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-2 text-sm text-neutral-600">Yêu cầu hỗ trợ gắn với tài khoản để nhân viên phản hồi đúng người.</p>
      <Link href="/login" className={buttonVariants({ className: 'mt-5 px-5' })}>Đăng nhập</Link>
    </section>
  );
}
