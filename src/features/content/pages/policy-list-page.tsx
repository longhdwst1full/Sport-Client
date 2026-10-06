import Link from 'next/link';
import { FileText, ChevronRight } from 'lucide-react';
import { Breadcrumb } from '@/foundation/components/navigation';
import type { PolicySummaryView } from '../model/policy.mapper';

const STATUS_NOTE = 'mt-8 rounded-3xl border border-slate-200/80 bg-white p-8 text-center text-sm';

export function PolicyListPage({
  policies,
  loadFailed = false,
}: {
  policies: PolicySummaryView[];
  /** API lỗi (chỉ xảy ra lúc build): báo lỗi, không giả làm "chưa có chính sách". */
  loadFailed?: boolean;
}) {
  return (
      <div className="bg-slate-50/60 pb-20 pt-8">
        <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            className="mb-6"
            items={[
              { label: 'Trang chủ', href: '/' },
              { label: 'Thông tin và chính sách' },
            ]}
          />

          <header className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-10">
            <h1 className="text-3xl font-black leading-tight text-ink sm:text-4xl">
              Thông tin và chính sách
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Các quy định về bảo hành, đổi trả, vận chuyển, thanh toán và bảo mật thông tin khi mua
              hàng tại Bảo An Sport.
            </p>
          </header>

          {loadFailed ? (
            <p role="alert" className={`${STATUS_NOTE} text-slate-600`}>
              Không tải được danh sách chính sách. Vui lòng tải lại trang sau ít phút.
            </p>
          ) : policies.length === 0 ? (
            <p className={`${STATUS_NOTE} text-slate-500`}>
              Chưa có trang chính sách nào được đăng.
            </p>
          ) : (
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {policies.map((policy) => (
                <li key={policy.slug}>
                  <Link
                    href={`/chinh-sach/${policy.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-brand-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
                  >
                    <span className="grid size-10 place-items-center rounded-xl bg-brand-50 text-brand-700">
                      <FileText className="size-5" aria-hidden="true" />
                    </span>
                    <h2 className="mt-4 text-base font-bold text-ink group-hover:text-brand-700">
                      {policy.title}
                    </h2>
                    <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
                      {policy.excerpt}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-brand-700">
                      Xem chi tiết <ChevronRight className="size-3.5" aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
  );
}
