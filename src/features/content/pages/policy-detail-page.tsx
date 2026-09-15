import Link from 'next/link';
import { ArrowLeft, CalendarDays } from 'lucide-react';
import { StorefrontLayout } from '@/layouts/storefront-layout';
import { Breadcrumb } from '@/foundation/components/navigation';
import type { PolicyDetailView, PolicySummaryView } from '../model/policy.mapper';

export function PolicyDetailPage({
  policy,
  others,
}: {
  policy: PolicyDetailView;
  others: PolicySummaryView[];
}) {
  return (
    <StorefrontLayout>
      <div className="bg-stone-50/60 pb-20 pt-8">
        <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            className="mb-6"
            items={[
              { label: 'Trang chủ', href: '/' },
              { label: 'Thông tin và chính sách', href: '/chinh-sach' },
              { label: policy.title },
            ]}
          />

          <article className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-sm sm:p-10">
            <h1 className="text-2xl font-black leading-tight text-ink sm:text-3xl">
              {policy.title}
            </h1>
            <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-stone-400">
              <CalendarDays className="size-3.5" /> Cập nhật {policy.updatedLabel}
            </p>

            <div className="mt-8 space-y-4 text-base leading-8 text-stone-700">
              {policy.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-10 border-t border-stone-100 pt-6">
              <Link
                href="/chinh-sach"
                className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-5 py-2.5 text-xs font-bold text-ink transition hover:bg-emerald-50 hover:text-emerald-700"
              >
                <ArrowLeft className="size-4" /> Tất cả chính sách
              </Link>
            </div>
          </article>

          {others.length > 0 && (
            <section className="mt-8">
              <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500">
                Chính sách khác
              </h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {others.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/chinh-sach/${item.slug}`}
                      className="block rounded-xl border border-stone-200/80 bg-white px-4 py-3 text-sm font-semibold text-ink transition hover:border-emerald-300 hover:text-emerald-700"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </main>
      </div>
    </StorefrontLayout>
  );
}
