'use client';

import dynamic from 'next/dynamic';
import { SMART_FIT_CARD_MIN_HEIGHT } from './smart-fit-advisor.layout';

/**
 * SmartFitAdvisor là wizard client nặng nằm dưới màn hình đầu: tách chunk (`ssr: false`) để không
 * tính vào First Load JS của `/`. Server chỉ render khung placeholder cùng `min-height` với thẻ thật
 * (`SMART_FIT_CARD_MIN_HEIGHT`) nên khi chunk tải xong không đẩy các section phía dưới (CLS).
 * `next/dynamic` với `ssr: false` không dùng được trong server component, vì vậy cần wrapper client này.
 */
const SmartFitAdvisor = dynamic(
  () => import('./smart-fit-advisor').then((module) => module.SmartFitAdvisor),
  { ssr: false, loading: SmartFitAdvisorPlaceholder },
);

function SmartFitAdvisorPlaceholder() {
  return (
    <section
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20"
      aria-busy="true"
      aria-label="Đang tải trợ lý chọn thiết bị"
    >
      <div
        className={`rounded-[32px] border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 shadow-2xl ${SMART_FIT_CARD_MIN_HEIGHT}`}
      />
    </section>
  );
}

export function SmartFitAdvisorLazy() {
  return <SmartFitAdvisor />;
}
