import type { Locator } from '@playwright/test';
import { StorefrontPage } from './storefront.page';

/** `/products`, `/search`, `/category/[slug]` dùng chung lưới sản phẩm. */
export class CatalogPage extends StorefrontPage {
  /** `/products` không còn ô tìm kiếm riêng: từ khoá đi qua `?q=` và bỏ bằng chip bộ lọc. */
  readonly clearKeyword = (): Locator =>
    this.page.getByRole('button', { name: 'Bỏ từ khóa tìm kiếm' }).filter({ visible: true }).first();
  readonly sortSelect = (): Locator =>
    this.page.getByTestId('catalog-sort-select').or(this.page.locator('select:visible')).first();
  readonly productLinks = (): Locator => this.page.locator('a[href^="/products/"]:visible');
  readonly emptyState = (): Locator =>
    this.page.getByText('Không tìm thấy sản phẩm phù hợp');

  async openAll(): Promise<void> {
    await this.goto('/products');
  }

  async openWithKeyword(keyword: string): Promise<void> {
    await this.goto(`/products?q=${encodeURIComponent(keyword)}`);
  }
}
