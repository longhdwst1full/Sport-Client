import type { ReactNode } from 'react';
import { Button } from '@/foundation/components/buttons';

/** Nhãn ô nhập dùng chung cho các form trong trang tài khoản. */
export const PROFILE_LABEL_CLASS = 'block text-xs font-bold uppercase tracking-wider text-neutral-600';

/** Phần riêng của nút lưu form tài khoản, đè lên `Button size="md"`. */
export const PROFILE_SUBMIT_CLASS = 'h-auto px-5 py-2.5 text-xs font-bold shadow-md shadow-neutral-900/20';

/** Nút lưu: `loading` của Button cho Spinner thay icon, nhãn giữ nguyên. */
export function ProfileSubmitButton({ pending, icon, children }: { pending: boolean; icon: ReactNode; children: ReactNode }) {
  return (
    <Button type="submit" size="md" loading={pending} leftIcon={icon} className={PROFILE_SUBMIT_CLASS}>
      {children}
    </Button>
  );
}
