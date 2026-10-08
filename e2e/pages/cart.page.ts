import type { Locator } from '@playwright/test';
import { StorefrontPage } from './storefront.page';

/** `/cart`. */
export class CartPage extends StorefrontPage {
  readonly emptyState = (): Locator => this.page.getByText('Giỏ hàng trống');
  readonly increase = (): Locator => this.page.getByLabel('Tăng số lượng');
  readonly decrease = (): Locator => this.page.getByLabel('Giảm số lượng');
  readonly remove = (): Locator =>
    this.page.locator('[data-testid="remove-cart-item"], button[aria-label*="Xóa"]');
  readonly checkoutLink = (): Locator =>
    this.page.getByRole('link', { name: /Đặt hàng|Tiến hành thanh toán/ });
  readonly summaryTotal = (): Locator => this.page.getByText('Tổng thanh toán');

  async open(): Promise<void> {
    await this.goto('/cart');
  }
}
