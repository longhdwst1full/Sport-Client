import Link from 'next/link';

export function SupportLoginPrompt({ title }: { title: string }) {
  return (
    <section className="surface-card p-10 text-center shadow-sm">
      <h2 className="text-xl font-black">{title}</h2>
      <p className="mt-2 text-sm text-neutral-600">Yêu cầu hỗ trợ gắn với tài khoản để nhân viên phản hồi đúng người.</p>
      <Link href="/login" className="mt-5 inline-flex rounded-xl bg-neutral-900 px-5 py-3 text-sm font-bold text-white focus-ring">Đăng nhập</Link>
    </section>
  );
}
