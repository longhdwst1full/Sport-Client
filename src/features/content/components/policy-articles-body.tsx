'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { SkeletonText } from '@/foundation/components/feedback';
import { useGetPublishedPost } from '@/generated/api/content/content';
import { CACHE_POLICY } from '@/lib/query/query-cache-policy';
import { isPolicyPost, toPolicyDetailView } from '../model/policy.mapper';
import { PolicyBody } from './policy-body';

export interface PolicyArticleRef {
  slug: string;
  /** Tiêu đề dự phòng khi bài chưa tải xong hoặc tải lỗi. */
  title: string;
}

/**
 * Thân các bài chính sách (CMS `getPublishedPost`, bài `POLICY`) nối tiếp nhau, để đọc trong modal.
 * Lúc đang tải, khối mang `aria-busy="true"`: modal đọc-hết-mới-đồng-ý dựa vào đó để không coi khung
 * chờ ngắn là "đã cuộn tới cuối".
 */
export function PolicyArticlesBody({ policies }: { policies: readonly PolicyArticleRef[] }) {
  return (
    <div className="space-y-8">
      {policies.map((policy) => (
        <PolicyArticle key={policy.slug} {...policy} />
      ))}
    </div>
  );
}

function PolicyArticle({ slug, title }: PolicyArticleRef) {
  const query = useGetPublishedPost(slug, { query: { ...CACHE_POLICY.LOOKUP, retry: 1 } });
  const policy = useMemo(
    () => (query.data && isPolicyPost(query.data) ? toPolicyDetailView(query.data) : undefined),
    [query.data],
  );
  const failed = query.isError || (query.isSuccess && !policy);
  const href = `/chinh-sach/${slug}`;

  return (
    <article aria-busy={!policy && !failed ? true : undefined}>
      <h3 className="text-base font-bold text-ink">{policy?.title ?? title}</h3>
      {policy && <p className="mt-0.5 text-xs text-neutral-500">Cập nhật {policy.updatedLabel}</p>}
      <div className="mt-3">
        {policy ? (
          <PolicyBody
            paragraphs={policy.paragraphs}
            className="space-y-3 text-sm leading-7 text-neutral-700"
            headingClassName="pt-2 text-sm font-bold text-ink"
          />
        ) : failed ? (
          <p role="alert" className="text-sm text-neutral-700">
            Chưa tải được nội dung.{' '}
            <Link href={href} target="_blank" rel="noopener" className="text-link inline-flex items-center gap-1 font-semibold">
              Mở trang đầy đủ <ExternalLink className="size-3.5" aria-hidden />
            </Link>
          </p>
        ) : (
          <SkeletonText lines={8} />
        )}
      </div>
    </article>
  );
}
