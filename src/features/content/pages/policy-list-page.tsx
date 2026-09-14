import Link from 'next/link';
import { FileText, ChevronRight } from 'lucide-react';
import { StorefrontLayout } from '@/layouts/storefront-layout';
import type { PolicySummaryView } from '../model/policy.mapper';

export function PolicyListPage({ policies }: { policies: PolicySummaryView[] }) {
  return (
    <StorefrontLayout>
      <div className="bg-stone-50/60 pb-20 pt-8">
        <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 text-xs font-semibold text-stone-500">
            <Link href="/" className="hover:text-emerald-700">
              Trang chủ
            </Link>
            <span className="mx-2">/</span>
            <span className="font-bold text-ink">Thông tin và chính sách</span>
          </nav>

          <header className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-sm sm:p-10">
            <h1 className="text-3xl font-black leading-tight text-ink sm:text-4xl">
              Thông tin và chính sách
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-600 sm:text-base">
              Các quy định về bảo hành, đổi trả, vận chuyển, thanh toán và bảo mật thông tin khi mua
              hàng tại Bảo An Sport.
            </p>
          </header>

          {policies.length === 0 ? (
            <p className="mt-8 rounded-3xl border border-stone-200/80 bg-white p-8 text-center text-sm text-stone-500">
              Chưa có trang chính sách nào được đăng.
            </p>
          ) : (
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {policies.map((policy) => (
                <li key={policy.slug}>
                  <Link
                    href={`/chinh-sach/${policy.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
                  >
                    <span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                      <FileText className="size-5" />
                    </span>
                    <h2 className="mt-4 text-base font-bold text-ink group-hover:text-emerald-700">
                      {policy.title}
                    </h2>
                    <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-stone-600">
                      {policy.excerpt}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                      Xem chi tiết <ChevronRight className="size-3.5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
    </StorefrontLayout>
  );
}
