import Link from 'next/link';
import { ArrowLeft, CalendarDays } from 'lucide-react';
import { Breadcrumb } from '@/foundation/components/navigation';
import type { PolicyDetailView, PolicySummaryView } from '../model/policy.mapper';
import { buildArticleJsonLd, buildBreadcrumbListJsonLd, serializeJsonLd } from '@/lib/seo/json-ld';

export function PolicyDetailPage({
  policy,
  others,
}: {
  policy: PolicyDetailView;
  others: PolicySummaryView[];
}) {
  const path = `/chinh-sach/${policy.slug}`;
  const articleJsonLd = buildArticleJsonLd({
    headline: policy.title,
    path,
    description: policy.excerpt,
    datePublished: policy.publishedAtIso,
  });
  const breadcrumbJsonLd = buildBreadcrumbListJsonLd([
    { name: 'Trang chủ', path: '/' },
    { name: 'Thông tin và chính sách', path: '/chinh-sach' },
    { name: policy.title, path },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }} />
      <div className="bg-slate-50/60 pb-20 pt-8">
        <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            className="mb-6"
            items={[
              { label: 'Trang chủ', href: '/' },
              { label: 'Thông tin và chính sách', href: '/chinh-sach' },
              { label: policy.title },
            ]}
          />

          <article className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-10">
            <h1 className="text-2xl font-black leading-tight text-ink sm:text-3xl">
              {policy.title}
            </h1>
            <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <CalendarDays className="size-3.5" aria-hidden="true" /> Cập nhật {policy.updatedLabel}
            </p>

            <div className="mt-8 space-y-4 text-base leading-8 text-slate-700">
              {policy.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-10 border-t border-slate-100 pt-6">
              <Link
                href="/chinh-sach"
                className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-5 py-2.5 text-xs font-bold text-ink transition hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
              >
                <ArrowLeft className="size-4" aria-hidden="true" /> Tất cả chính sách
              </Link>
            </div>
          </article>

          {others.length > 0 && (
            <section className="mt-8">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Chính sách khác
              </h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {others.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/chinh-sach/${item.slug}`}
                      className="block rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-sm font-semibold text-ink transition hover:border-brand-300 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
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
    </>
  );
}
