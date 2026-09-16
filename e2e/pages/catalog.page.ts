import type { Locator } from '@playwright/test';
import { StorefrontPage } from './storefront.page';

/** `/products`, `/search`, `/category/[slug]` dùng chung lưới sản phẩm. */
export class CatalogPage extends StorefrontPage {
  readonly filterInput = (): Locator =>
    this.page.getByPlaceholder(/Tìm theo tên thiết bị/);
  readonly clearKeyword = (): Locator => this.page.getByLabel('Xóa từ khóa');
  readonly sortSelect = (): Locator => this.page.locator('select').first();
  readonly productLinks = (): Locator => this.page.locator('a[href^="/products/"]');
  readonly emptyState = (): Locator =>
    this.page.getByText('Không tìm thấy sản phẩm phù hợp');

  async openAll(): Promise<void> {
    await this.goto('/products');
  }
}
