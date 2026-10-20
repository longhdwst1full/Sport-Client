import type { APIRequestContext } from '@playwright/test';

/**
 * Truy dữ liệu thật để test không viết cứng slug/tên sản phẩm — catalog thay đổi theo môi trường,
 * viết cứng là nguồn gốc của test giòn.
 *
 * Gọi qua proxy `/api/v1/*` của chính storefront đang test (đường dẫn tương đối, theo `baseURL` của
 * Playwright), giống trình duyệt thật: proxy server-side tự gắn `STOREFRONT_PROXY_SECRET`, test runner
 * không giữ secret. Server local chạy với backend bật `STOREFRONT_PROXY_ENFORCE` vẫn cần secret trong env
 * của chính server đó (SSR cũng đi qua nó); `E2E_BASE_URL` trỏ site đã deploy thì không cần gì thêm.
 */
const API_PREFIX = '/api/v1';

export interface CatalogProduct {
  id: string;
  name: string;
  slug: string;
  minPrice?: string | null;
  primaryCategory?: string;
  defaultVariantId?: string | null;
}

export async function fetchProducts(
  request: APIRequestContext,
  limit = 5,
  options: { inStock?: boolean } = {},
): Promise<CatalogProduct[]> {
  const inStock = options.inStock ? '&inStock=true' : '';
  const response = await request.get(
    `${API_PREFIX}/catalog/products?page=1&limit=${limit}${inStock}`,
  );
  if (!response.ok()) throw new Error(`Catalog API lỗi ${response.status()} — kiểm tra proxy ${API_PREFIX} của storefront và backend phía sau`);
  const body = (await response.json()) as { items: CatalogProduct[] };
  if (!body.items?.length) throw new Error('Catalog rỗng: môi trường chưa có dữ liệu để chạy E2E.');
  return body.items;
}

/** Sản phẩm còn hàng: dữ liệu thật có thể có sản phẩm hết hàng đứng đầu, nút "Thêm vào giỏ" khi đó bị khoá. */
export async function firstProduct(request: APIRequestContext): Promise<CatalogProduct> {
  return (await fetchProducts(request, 1, { inStock: true }))[0];
}

/** Storefront chỉ trả danh mục đang bán, không có trường `status` như Admin. */
export interface CatalogCategory {
  code: string;
  name: string;
  slug: string;
}

export async function fetchCategories(request: APIRequestContext): Promise<CatalogCategory[]> {
  const response = await request.get(`${API_PREFIX}/catalog/categories`);
  if (!response.ok()) throw new Error(`Category API lỗi ${response.status()}`);
  const body = (await response.json()) as { items: CatalogCategory[] };
  return body.items ?? [];
}

export async function fetchPosts(request: APIRequestContext): Promise<{ slug: string; title: string }[]> {
  const response = await request.get(`${API_PREFIX}/content/posts?page=1&limit=5`);
  if (!response.ok()) return [];
  const body = (await response.json()) as { items?: { slug: string; title: string }[] };
  return body.items ?? [];
}
