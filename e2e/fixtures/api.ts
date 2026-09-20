import type { APIRequestContext } from '@playwright/test';

/**
 * Truy dữ liệu thật từ API để test không viết cứng slug/tên sản phẩm — catalog
 * thay đổi theo môi trường, viết cứng là nguồn gốc của test giòn.
 */
export const API_URL = process.env.E2E_API_URL ?? 'https://sport-api-doc.vercel.app';

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
): Promise<CatalogProduct[]> {
  const response = await request.get(
    `${API_URL}/api/v1/catalog/products?page=1&limit=${limit}`,
  );
  if (!response.ok()) throw new Error(`Catalog API lỗi ${response.status()} — cần API chạy ở ${API_URL}`);
  const body = (await response.json()) as { items: CatalogProduct[] };
  if (!body.items?.length) throw new Error('Catalog rỗng: môi trường chưa có dữ liệu để chạy E2E.');
  return body.items;
}

export async function firstProduct(request: APIRequestContext): Promise<CatalogProduct> {
  return (await fetchProducts(request, 1))[0];
}

/** Storefront chỉ trả danh mục đang bán, không có trường `status` như Admin. */
export interface CatalogCategory {
  code: string;
  name: string;
  slug: string;
}

export async function fetchCategories(request: APIRequestContext): Promise<CatalogCategory[]> {
  const response = await request.get(`${API_URL}/api/v1/catalog/categories`);
  if (!response.ok()) throw new Error(`Category API lỗi ${response.status()}`);
  const body = (await response.json()) as { items: CatalogCategory[] };
  return body.items ?? [];
}

export async function fetchPosts(request: APIRequestContext): Promise<{ slug: string; title: string }[]> {
  const response = await request.get(`${API_URL}/api/v1/content/posts?page=1&limit=5`);
  if (!response.ok()) return [];
  const body = (await response.json()) as { items?: { slug: string; title: string }[] };
  return body.items ?? [];
}
