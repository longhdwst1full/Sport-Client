import type { Locator } from '@playwright/test';
import { StorefrontPage } from './storefront.page';

/** `/products/[slug]`. */
export class ProductDetailPage extends StorefrontPage {
  readonly title = (): Locator => this.page.getByRole('heading', { level: 1 });
  readonly increaseQty = (): Locator => this.page.getByLabel('Tăng số lượng');
  readonly decreaseQty = (): Locator => this.page.getByLabel('Giảm số lượng');
  readonly addToCart = (): Locator => this.page.getByRole('button', { name: 'Thêm vào giỏ' }).first();
  readonly buyNow = (): Locator => this.page.getByRole('button', { name: 'Mua ngay' }).first();
  readonly addedNotice = (): Locator =>
    this.page.getByText('Đã thêm sản phẩm vào giỏ hàng thành công!');

  async open(slug: string): Promise<void> {
    await this.goto(`/products/${slug}`);
  }

  async clickAddToCart(): Promise<void> {
    const btn = this.addToCart();
    await btn.scrollIntoViewIfNeeded();
    await btn.click({ force: true });
  }
}
