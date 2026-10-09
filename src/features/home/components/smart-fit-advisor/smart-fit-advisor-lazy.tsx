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
      className="page-section"
      aria-busy="true"
      aria-label="Đang tải trợ lý chọn thiết bị"
    >
      <div
        className={`rounded-2xl bg-neutral-50 ${SMART_FIT_CARD_MIN_HEIGHT}`}
      />
    </section>
  );
}

export function SmartFitAdvisorLazy() {
  return <SmartFitAdvisor />;
}
