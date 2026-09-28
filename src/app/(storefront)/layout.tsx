import type { ReactNode } from 'react';
import { StorefrontLayout } from '@/layouts/storefront-layout';

// Route group so every storefront-shell page (header/footer) shares one layout
// instance instead of each page rendering <StorefrontLayout> itself.
export default function StorefrontRouteGroupLayout({ children }: { children: ReactNode }) {
  return <StorefrontLayout>{children}</StorefrontLayout>;
}
