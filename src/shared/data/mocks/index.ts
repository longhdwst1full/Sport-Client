/**
 * Dữ liệu demo NON-PRODUCTION.
 *
 * Chỉ còn ba nhóm chưa có backend tương ứng:
 * - `home`: nội dung marketing trang chủ, chưa có module CMS
 * - `notifications`: chưa có model `Notification` trong Prisma
 * - `profile`: bảo hành, chưa có model `Warranty`
 *
 * Không thêm mock mới. Mọi thứ có API đều phải đọc từ `src/generated/api`
 * (`02a-contract-change-workflow.md` RULE-CTR-02).
 */

export * from './profile.mock';
export * from './notifications.mock';
export * from './home.mock';
