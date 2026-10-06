import Link from 'next/link';
import { ArrowRight, Send, Sparkles } from 'lucide-react';
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
    <div className="rounded-2xl border border-slate-700 bg-slate-900/90 p-6 sm:p-8 backdrop-blur-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-brand-400 mb-2">
            <Sparkles className="size-3.5" aria-hidden="true" />
            <span>CẤU HÌNH ĐƯỢC CHUYÊN GIA BẢO AN SPORT TỐI ƯU</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            {recommendation.title}
          </h3>
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-400">
            <span className="rounded-md bg-slate-800 px-2 py-0.5">Mục tiêu: {goalLabel}</span>
            <span className="rounded-md bg-slate-800 px-2 py-0.5">Không gian: {spaceLabel}</span>
            <span className="rounded-md bg-slate-800 px-2 py-0.5">Ngân sách: {budgetLabel}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href={`https://zalo.me/${STORE_CONTACT.primaryHotlineRaw}?text=${zaloMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white hover:bg-brand-700 transition shadow-lg shadow-brand-600/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            <Send className="size-3.5" aria-hidden="true" />
            <span>Nhận báo giá Zalo</span>
            <span className="sr-only"> (mở tab mới)</span>
          </a>
          <Link
            href={recommendation.catalogHref}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            <span>Xem sản phẩm</span>
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="mt-6">
        <span className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
          Thiết bị nên có trong combo này:
        </span>
        <div className="grid gap-3 sm:grid-cols-3">
          {recommendation.items.map((item, idx) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4"
            >
              <div className="grid size-7 shrink-0 place-items-center rounded-lg bg-brand-500/20 text-xs font-black text-brand-400">
                {idx + 1}
              </div>
              <span className="text-xs font-bold text-slate-200">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
