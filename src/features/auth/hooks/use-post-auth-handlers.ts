'use client';

import { useRouter } from 'next/navigation';
import { syncCartAfterAuth, hydrateCart } from '@/features/cart';
import { storefrontStore } from '@/app/store/store';
import { saveCustomerAuthTokens } from '@/core/auth/customer-auth-token.store';
import { useToast } from '@/shared/components/global-toast';
import { apiErrorMessage } from '@/lib/api/error-message';

type CustomerAuthTokens = Parameters<typeof saveCustomerAuthTokens>[0];

type ToastCopy = { title: string; message: string };

/**
 * Side effects dùng chung cho đăng nhập và đăng ký. Thứ tự quan trọng: lưu token trước khi gọi gộp
 * giỏ để request mang phiên mới, chuyển trang sau cùng để khách chỉ rời đi khi giỏ đã ổn định.
 */
export function usePostAuthHandlers({
  success,
  failureTitle,
  failureFallback,
  setSubmitError,
}: {
  success: ToastCopy;
  failureTitle: string;
  failureFallback: string;
  setSubmitError: (message: string) => void;
}) {
  const router = useRouter();
  const { toast } = useToast();

  return {
    onSuccess: async (tokens: CustomerAuthTokens) => {
      saveCustomerAuthTokens(tokens);
      toast({ type: 'success', ...success });
      const accountItems = await syncCartAfterAuth(storefrontStore.getState().cart.items);
      if (accountItems) {
        storefrontStore.dispatch(hydrateCart(accountItems));
      } else {
        // Gộp giỏ lỗi: giỏ trên máy được giữ nguyên, lần mở app sau sẽ gộp lại. Không chặn đăng nhập.
        toast({
          type: 'warning',
          title: 'Chưa đồng bộ được giỏ hàng',
          message: 'Giỏ hàng trên máy vẫn được giữ và sẽ được đồng bộ lại vào tài khoản sau.',
        });
      }
      router.replace('/');
    },
    onError: (error: unknown) => {
      const message = apiErrorMessage(error, failureFallback, { preferDetails: true });
      setSubmitError(message);
      toast({ type: 'error', title: failureTitle, message });
    },
  };
}
