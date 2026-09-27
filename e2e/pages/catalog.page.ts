import type { Locator } from '@playwright/test';
import { StorefrontPage } from './storefront.page';

/** `/products`, `/search`, `/category/[slug]` dùng chung lưới sản phẩm. */
export class CatalogPage extends StorefrontPage {
  readonly filterInput = (): Locator =>
    this.page.getByTestId('catalog-search-input').or(this.page.getByPlaceholder(/Tìm theo tên thiết bị/)).filter({ visible: true }).first();
  readonly clearKeyword = (): Locator =>
    this.page.locator('button[aria-label="Xóa từ khóa"]:visible').first();
  readonly sortSelect = (): Locator =>
    this.page.getByTestId('catalog-sort-select').or(this.page.locator('select:visible')).first();
  readonly productLinks = (): Locator => this.page.locator('a[href^="/products/"]:visible');
  readonly emptyState = (): Locator =>
    this.page.getByText('Không tìm thấy sản phẩm phù hợp');

  async openAll(): Promise<void> {
    await this.goto('/products');
  }
}
