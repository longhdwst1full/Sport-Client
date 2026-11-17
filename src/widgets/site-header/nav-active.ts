import type { MegaMenuEntry } from '@/features/catalog';

/**
 * Mục điều hướng có ứng với trang đang xem không. "/" chỉ khớp đúng trang chủ; mục khác khớp chính nó
 * và các trang con (`/products` khớp `/products/<slug>`), không khớp tiền tố trùng tên (`/news` ≠ `/newsletter`).
 */
export function isNavHrefActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  const path = href.split(/[?#]/, 1)[0] ?? href;
  if (path === '/') return pathname === '/';
  return pathname === path || pathname.startsWith(`${path}/`);
}

/** Danh mục đang xem: chính danh mục hoặc một danh mục con của nó. */
export function isCategoryActive(pathname: string | null, category: Pick<MegaMenuEntry, 'href' | 'children'>): boolean {
  return (
    isNavHrefActive(pathname, category.href) ||
    (category.children ?? []).some((child) => isNavHrefActive(pathname, child.href))
  );
}
