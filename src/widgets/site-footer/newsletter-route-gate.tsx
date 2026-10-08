'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

/** Luồng thanh toán: bỏ banner marketing/nhận tin để khách không bị phân tâm; footer pháp lý vẫn giữ. */
const NEWSLETTER_HIDDEN_ROUTES: readonly RegExp[] = [/^\/checkout(\/|$)/];

/**
 * `FooterNewsletterBanner` là server component async nên không đọc được pathname; layout bọc nó bằng
 * gate client này (children vẫn render ở server, gate chỉ quyết định có hiện hay không).
 */
export function NewsletterRouteGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (NEWSLETTER_HIDDEN_ROUTES.some((pattern) => pattern.test(pathname ?? ''))) return null;
  return children;
}
