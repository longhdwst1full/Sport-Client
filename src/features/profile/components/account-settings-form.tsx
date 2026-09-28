import type { CustomerProfileDto } from '@/generated/api/customer/customer.schemas';
import { ProfileInfoForm } from './profile-info-form';
import { ChangePasswordForm } from './change-password-form';

/**
 * Cài đặt tài khoản: sửa hồ sơ và đổi mật khẩu.
 *
 * Hai việc tách thành hai form riêng vì chúng có hai kết cục khác nhau — sửa hồ sơ trả về hồ sơ
 * mới, còn đổi mật khẩu **đăng xuất mọi thiết bị khác**. Gộp vào một nút Lưu thì người dùng không
 * biết mình vừa gây ra cái nào.
 */
export function AccountSettingsForm({ profile }: { profile: CustomerProfileDto }) {
  return (
    <div className="mt-6 max-w-lg space-y-6">
      <ProfileInfoForm profile={profile} />
      <ChangePasswordForm />
    </div>
  );
}
