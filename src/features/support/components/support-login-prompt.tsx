import Link from 'next/link';

export function SupportLoginPrompt({ title }: { title: string }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <h2 className="text-xl font-black">{title}</h2>
      <p className="mt-2 text-sm text-slate-600">Yêu cầu hỗ trợ gắn với tài khoản để nhân viên phản hồi đúng người.</p>
      <Link href="/login" className="mt-5 inline-flex rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2">Đăng nhập</Link>
    </section>
  );
}
