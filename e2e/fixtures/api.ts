import type { APIRequestContext } from '@playwright/test';

/**
 * Truy dữ liệu thật từ API để test không viết cứng slug/tên sản phẩm — catalog
 * thay đổi theo môi trường, viết cứng là nguồn gốc của test giòn.
 */
export const API_URL = process.env.E2E_API_URL ?? 'https://sport-api-doc.vercel.app';

/**
 * Backend bật `STOREFRONT_PROXY_ENFORCE` thì gọi thẳng không kèm secret bị 403; test runner đóng vai
 * server storefront nên gửi cùng secret với `next start` (đọc từ env, không ghi vào repo).
 */
const PROXY_HEADERS: Record<string, string> = process.env.STOREFRONT_PROXY_SECRET
  ? { 'x-storefront-proxy-secret': process.env.STOREFRONT_PROXY_SECRET }
  : {};

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
    `${API_URL}/api/v1/catalog/products?page=1&limit=${limit}${inStock}`,
    { headers: PROXY_HEADERS },
  );
  if (!response.ok()) throw new Error(`Catalog API lỗi ${response.status()} — cần API chạy ở ${API_URL}`);
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
  const response = await request.get(`${API_URL}/api/v1/catalog/categories`, { headers: PROXY_HEADERS });
  if (!response.ok()) throw new Error(`Category API lỗi ${response.status()}`);
  const body = (await response.json()) as { items: CatalogCategory[] };
  return body.items ?? [];
}

export async function fetchPosts(request: APIRequestContext): Promise<{ slug: string; title: string }[]> {
  const response = await request.get(`${API_URL}/api/v1/content/posts?page=1&limit=5`, { headers: PROXY_HEADERS });
  if (!response.ok()) return [];
  const body = (await response.json()) as { items?: { slug: string; title: string }[] };
  return body.items ?? [];
}
