import type { Locator, Page } from '@playwright/test';

/** Khung chung: header, tìm kiếm, giỏ hàng, overlay khuyến mãi. */
export class StorefrontPage {
  constructor(protected readonly page: Page) {}

  readonly mainNav = (): Locator => this.page.getByRole('navigation').first();
  readonly breadcrumb = (): Locator => this.page.getByRole('navigation', { name: 'Breadcrumb' });
  readonly searchBox = (): Locator => this.page.getByLabel('Tìm kiếm sản phẩm').first();
  readonly cartLink = (): Locator => this.page.locator('a[href="/cart"]').first();
  readonly addToCartCards = (): Locator =>
    this.page.getByRole('button', { name: /Thêm .* vào giỏ|Mua ngay/i });

  async goto(path: string): Promise<void> {
    await this.page.goto(path);
    await this.dismissOverlay();
  }

  /** Trang chủ có hộp thoại khuyến mãi che nội dung; đóng trước khi thao tác. */
  async dismissOverlay(): Promise<void> {
    const dialog = this.page.getByRole('dialog');
    if (await dialog.isVisible().catch(() => false)) {
      await this.page.getByLabel('Đóng thông báo').click().catch(() => undefined);
      await dialog.waitFor({ state: 'hidden', timeout: 5_000 }).catch(() => undefined);
    }
  }
}
