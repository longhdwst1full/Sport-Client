import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCustomerAuth } from '@/features/auth';
import {
  createAccountReturn,
  getGetAccountReturnEligibilityQueryKey,
  getListAccountReturnsQueryKey,
  useGetAccountReturnEligibility,
} from '@/generated/api/returns/returns';
import type { ReturnDetailDto } from '@/generated/api/returns/returns.schemas';
import {
  estimateSelection,
  toCreateReturnPayload,
  type CreateReturnFormState,
  type UploadedEvidence,
} from '../model/return.mapper';

/**
 * Form + eligibility query + mutation tạo yêu cầu trả hàng. Luật (hạn trả, số lượng, combo,
 * danh mục) lấy từ API eligibility; form chỉ giới hạn theo đó và API vẫn kiểm lại khi gửi.
 */
export function useCreateReturn(orderNo: string) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoaded } = useCustomerAuth();
  const [form, setForm] = useState<CreateReturnFormState>({ reasonCode: '', description: '', quantities: {} });
  const [images, setImages] = useState<UploadedEvidence[]>([]);
  const [uploading, setUploading] = useState(false);
  const idempotencyRef = useRef<{ signature: string; key: string } | undefined>(undefined);
  const eligibility = useGetAccountReturnEligibility(orderNo, { query: { enabled: isLoaded && isAuthenticated, retry: false } });
  const data = eligibility.data;
  const lines = data?.items ?? [];
  const estimate = estimateSelection(lines, form.quantities);
  const selectedCount = lines.filter((line) => (form.quantities[line.orderItemId] ?? 0) > 0 && line.returnableQuantity > 0).length;

  const submit = useMutation<ReturnDetailDto>({
    retry: false,
    mutationFn: () => {
      const payload = toCreateReturnPayload(orderNo, lines, form, images);
      // Bấm lại (hoặc thử lại sau lỗi mạng) cùng nội dung thì giữ key để API trả đúng phiếu cũ.
      const signature = JSON.stringify(payload);
      if (idempotencyRef.current?.signature !== signature) {
        idempotencyRef.current = { signature, key: crypto.randomUUID() };
      }
      return createAccountReturn(payload, { headers: { 'idempotency-key': idempotencyRef.current.key } });
    },
    onSuccess: async (created) => {
      idempotencyRef.current = undefined;
      // CACHE: phiếu mới đổi danh sách phiếu và điều kiện trả của chính đơn này.
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: getListAccountReturnsQueryKey() }),
        queryClient.invalidateQueries({ queryKey: getGetAccountReturnEligibilityQueryKey(orderNo) }),
      ]);
      router.push(`/returns/${encodeURIComponent(created.returnNo)}`);
    },
  });

  const setQuantity = (orderItemId: string, quantity: number) =>
    setForm((current) => ({ ...current, quantities: { ...current.quantities, [orderItemId]: quantity } }));

  const canSubmit = Boolean(form.reasonCode) && selectedCount > 0 && !uploading && !submit.isPending;

  return {
    isAuthenticated,
    isLoaded,
    eligibility,
    data,
    lines,
    estimate,
    form,
    setForm,
    setQuantity,
    images,
    setImages,
    uploading,
    setUploading,
    submit,
    canSubmit,
  };
}
