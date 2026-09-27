import { CartPage } from '@/features/cart';
import { NOINDEX_ROBOTS } from '@/shared/seo/page-metadata';

export const metadata = { title: 'Giỏ hàng', robots: NOINDEX_ROBOTS };
export default function Page() {
  return <CartPage />;
}
