import type { TokenPairDto } from '@/generated/api/auth/models';
import { AuthService } from '@/core/storage';

const cookieTransport = process.env.NEXT_PUBLIC_AUTH_TOKEN_TRANSPORT === 'COOKIE';

/**
 * Dấu hiệu "đang có phiên", KHÔNG phải thông tin xác thực.
 *
 * Với transport COOKIE, token nằm trong cookie HttpOnly nên JavaScript không đọc được — đó là
 * điểm mạnh của nó, không phải lỗi. Nhưng giao diện vẫn phải trả lời được câu "khách đã đăng nhập
 * chưa" để quyết định hiện hồ sơ hay hiện nút đăng nhập. Cờ này giữ đúng câu trả lời đó và không
 * giữ gì thêm: đọc được nó cũng không mạo danh được ai.
 *
 * Cờ có thể lệch thật (cookie hết hạn phía server mà cờ còn) — khi đó lời gọi hồ sơ trả 401 và
 * `clearCustomerAuthTokens` dọn cờ, giao diện tự trở về trạng thái chưa đăng nhập.
 */
const SESSION_HINT_KEY = 'dctd.customer-session';

function notifyAuthChange(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('dctd:auth-change'));
  }
}

function writeSessionHint(active: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    if (active) window.localStorage.setItem(SESSION_HINT_KEY, '1');
    else window.localStorage.removeItem(SESSION_HINT_KEY);
  } catch {
    // Cửa sổ ẩn danh hoặc bị chặn lưu trữ: mất cờ chỉ làm khách phải đăng nhập lại,
    // không được để nó ném lỗi và chặn cả luồng đăng nhập.
  }
}

function hasSessionHint(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(SESSION_HINT_KEY) === '1';
  } catch {
    return false;
  }
}

export function saveCustomerAuthTokens(tokens: TokenPairDto): void {
  // COOKIE transport: server đã set HttpOnly cookie, client không được giữ bản sao.
  if (!cookieTransport) AuthService.save(tokens);
  // Cờ phiên đặt ở CẢ HAI transport: đây là thứ duy nhất giao diện đọc được ở chế độ COOKIE.
  writeSessionHint(true);
  notifyAuthChange();
}

export function readCustomerAuthTokens(): TokenPairDto | undefined {
  if (cookieTransport) return undefined;
  return AuthService.read();
}

export function usesCustomerAuthCookieTransport(): boolean {
  return cookieTransport;
}

export function clearCustomerAuthTokens(): void {
  AuthService.clear();
  writeSessionHint(false);
  notifyAuthChange();
}

/**
 * Khách có đang đăng nhập hay không.
 *
 * Hồi quy: bản trước trả thẳng `Boolean(readCustomerAuthTokens())`, mà hàm đó luôn trả `undefined`
 * ở transport COOKIE. `.env.local` và `.env.production` đều đặt COOKIE, nên **mọi khách đăng nhập
 * xong vẫn bị coi là chưa đăng nhập**: header hiện nút đăng nhập, trang hồ sơ đá ngược về `/login`,
 * và lời gọi lấy hồ sơ không bao giờ chạy vì nó bị chặn bởi chính cờ này.
 */
export function isCustomerAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  if (cookieTransport) return hasSessionHint();
  // Xét theo việc CÒN token hay không, không xét riêng access token: access hết hạn
  // trước refresh là đúng luồng, và fetcher tự xoay lại. Bám vào accessToken sẽ làm
  // khách trông như đã đăng xuất dù phiên vẫn cứu được.
  return Boolean(readCustomerAuthTokens());
}

/** Còn refresh token nghĩa là phiên vẫn cứu được, kể cả khi access token đã hết hạn. */
export function hasCustomerRefreshCredential(): boolean {
  if (typeof window === 'undefined') return false;
  // Ở chế độ COOKIE chỉ xoay token khi tin là đang có phiên. Trả `true` vô điều kiện sẽ khiến mọi
  // khách vãng lai gặp 401 ở trang công khai cũng kéo theo một lời gọi `/auth/refresh` vô nghĩa.
  if (cookieTransport) return hasSessionHint();
  return Boolean(readCustomerAuthTokens()?.refreshToken);
}
