import { paymentRequest } from './payment-request';
import {
  createAccountPaymentEvidenceUpload,
  createGuestPaymentEvidenceUpload,
} from '@/generated/api/payments/payments';
import { uploadSignedMedia } from '@/lib/api/signed-media-upload';

export interface VerifiedPaymentEvidenceUpload {
  publicId: string;
  providerVersion: number;
  providerSignature: string;
}

/** Ảnh minh chứng chuyển khoản: xin chữ ký theo phiên (tài khoản hoặc `x-cart-token` của khách) rồi tải lên. */
export async function uploadPaymentEvidence(
  orderNo: string,
  file: File,
  authenticated: boolean,
  guestToken: string | null,
): Promise<VerifiedPaymentEvidenceUpload> {
  const uploaded = await uploadSignedMedia(file, (request) =>
    authenticated
      ? createAccountPaymentEvidenceUpload(orderNo, request, paymentRequest())
      : createGuestPaymentEvidenceUpload(
          orderNo,
          request,
          paymentRequest({ headers: { 'x-cart-token': guestToken } }),
        ),
  );
  return {
    publicId: uploaded.publicId,
    providerVersion: uploaded.version,
    providerSignature: uploaded.signature,
  };
}
