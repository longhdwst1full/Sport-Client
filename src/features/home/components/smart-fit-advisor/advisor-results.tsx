import Link from 'next/link';
import { ArrowRight, Send, Sparkles } from 'lucide-react';
import { buttonVariants } from '@/foundation/components/buttons';
import { STORE_CONTACT } from '@/shared/constants';

interface Recommendation {
  title: string;
  items: string[];
  catalogHref: string;
}

interface AdvisorResultsProps {
  recommendation: Recommendation;
  goalLabel: string;
  spaceLabel: string;
  budgetLabel: string;
}

export function AdvisorResults({ recommendation, goalLabel, spaceLabel, budgetLabel }: AdvisorResultsProps) {
  const zaloMessage = encodeURIComponent(
    `Xin chào Bảo An Sport! Tôi cần tư vấn cấu hình thiết bị: Mục tiêu [${goalLabel}], Không gian [${spaceLabel}], Ngân sách [${budgetLabel}]. Nhờ shop gửi báo giá chi tiết!`
  );

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6 sm:p-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 border-b border-neutral-200 pb-6">
        <div>
          <div className="eyebrow mb-2 inline-flex items-center gap-1.5 text-neutral-500">
            <Sparkles className="size-3.5" aria-hidden="true" />
            <span>Cấu hình gợi ý</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-neutral-950">
            {recommendation.title}
          </h3>
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-neutral-600">
            {[
              `Mục tiêu: ${goalLabel}`,
              `Không gian: ${spaceLabel}`,
              `Ngân sách: ${budgetLabel}`,
            ].map((summary) => (
              <span key={summary} className="rounded-md bg-neutral-100 px-2 py-0.5">
                {summary}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href={`https://zalo.me/${STORE_CONTACT.primaryHotlineRaw}?text=${zaloMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({
              variant: 'cta',
              className: 'px-5',
            })}
          >
            <Send className="size-3.5" aria-hidden="true" />
            <span>Nhận báo giá Zalo</span>
            <span className="sr-only"> (mở tab mới)</span>
          </a>
          <Link
            href={recommendation.catalogHref}
            className={buttonVariants({ variant: 'secondary', className: 'px-5' })}
          >
            <span>Xem sản phẩm</span>
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="mt-6">
        <span className="eyebrow mb-3 block text-neutral-500">
          Thiết bị nên có trong combo này:
        </span>
        <div className="grid gap-3 sm:grid-cols-3">
          {recommendation.items.map((item, idx) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-lg bg-neutral-50 p-4"
            >
              <div className="grid size-7 shrink-0 place-items-center rounded-md bg-neutral-950 text-xs font-semibold text-white">
                {idx + 1}
              </div>
              <span className="text-sm font-medium text-neutral-800">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
