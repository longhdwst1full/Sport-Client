import type { ReactNode } from 'react';
import { STORE_POLICY_PAGES } from '@/shared/constants';

/** Dùng chung cho link mặc định và link modal do route truyền vào, để hai cách trông giống hệt nhau. */
export const POLICY_LINK_CLASS = 'font-bold text-neutral-900 underline underline-offset-2 hover:decoration-2 focus-ring-tight rounded';

export const CHECKOUT_POLICY_LABEL = {
  TERMS: STORE_POLICY_PAGES.TERMS.title.toLowerCase(),
  RETURNS: 'chính sách đổi trả & bảo hành',
} as const;

/** Link điều khoản/đổi trả của ô đồng ý, do route ghép vào (`checkout` không import `content`). */
export interface CheckoutPolicyLinks {
  terms: ReactNode;
  returns: ReactNode;
}
