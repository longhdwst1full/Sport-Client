import type { Locator } from '@playwright/test';
import { StorefrontPage } from './storefront.page';

/** `/checkout` — một form, hai bước: báo giá rồi xác nhận giữ hàng. */
export class CheckoutPage extends StorefrontPage {
  readonly heading = (): Locator =>
    this.page.getByRole('heading', { name: 'Thanh toán an toàn' });
  readonly receiver = (): Locator => this.page.getByText('Người nhận').locator('input');
  readonly phone = (): Locator => this.page.getByText('Số điện thoại').locator('input');
  readonly email = (): Locator => this.page.getByText('Email', { exact: false }).locator('input[type="email"]').first();
  readonly note = (): Locator => this.page.getByPlaceholder(/Gọi trước khi giao/);
  readonly consultationCheckbox = (): Locator => this.page.getByRole('checkbox').first();
  readonly paymentOption = (label: string): Locator =>
    this.page.getByRole('button', { name: new RegExp(label) });
  /** Nhãn đổi theo bước: "Kiểm tra tồn và tính phí" -> "Xác nhận và giữ hàng 30 phút". */
  readonly submit = (): Locator =>
    this.page.getByRole('button', { name: /Kiểm tra tồn và tính phí|Xác nhận và giữ hàng|Đang xử lý/ });
  readonly quoteSection = (): Locator =>
    this.page.getByRole('heading', { name: 'Kết quả kiểm tra từ hệ thống' });
  readonly errorAlert = (): Locator => this.page.getByRole('alert');

  async open(): Promise<void> {
    await this.goto('/checkout');
  }
}
