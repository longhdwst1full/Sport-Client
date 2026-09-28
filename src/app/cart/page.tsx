import { CartPage } from '@/features/cart';
import { NOINDEX_ROBOTS } from '@/lib/seo/page-metadata';

export const metadata = { title: 'Giỏ hàng', robots: NOINDEX_ROBOTS };
export default function Page() {
  return <CartPage />;
}
