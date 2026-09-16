import type { Locator } from '@playwright/test';
import { StorefrontPage } from './storefront.page';

/** `/login` và `/register`. */
export class AuthPage extends StorefrontPage {
  readonly loginIdentifier = (): Locator =>
    this.page.getByPlaceholder('email@example.com hoặc 0912 345 678');
  readonly password = (): Locator => this.page.getByPlaceholder('Tối thiểu 8 ký tự');
  readonly loginSubmit = (): Locator => this.page.getByRole('button', { name: /Đăng nhập ngay|Đang xác thực/ });

  readonly fullName = (): Locator => this.page.getByPlaceholder('Nguyễn Văn A');
  readonly registerEmail = (): Locator => this.page.getByPlaceholder('email@example.com');
  readonly registerPhone = (): Locator => this.page.getByPlaceholder('0912 345 678');
  readonly registerSubmit = (): Locator =>
    this.page.getByRole('button', { name: /Đăng ký & Tham gia ngay|Đang khởi tạo/ });

  async openLogin(): Promise<void> {
    await this.goto('/login');
  }

  async openRegister(): Promise<void> {
    await this.goto('/register');
  }
}
