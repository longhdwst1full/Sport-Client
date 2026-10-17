import { STORE_POLICY_PAGES } from '@/shared/constants';

/** Dùng chung cho link mặc định (tab mới) và nút mở modal, để hai cách trông giống hệt nhau. */
export const POLICY_LINK_CLASS = 'font-bold text-neutral-900 underline underline-offset-2 hover:decoration-2 focus-ring-tight rounded';

export const CHECKOUT_POLICY_LABEL = {
  TERMS: STORE_POLICY_PAGES.TERMS.title.toLowerCase(),
  RETURNS: 'chính sách đổi trả & bảo hành',
} as const;
