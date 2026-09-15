import axios from 'axios';
import { paymentRequest } from './payment-request';
import {
  createAccountPaymentEvidenceUpload,
  createGuestPaymentEvidenceUpload,
} from '@/generated/api/payments/payments';
import type { CreateMediaUploadDtoContentType } from '@/generated/api/payments/models';

const allowedTypes = new Set<CreateMediaUploadDtoContentType>([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
]);

export interface VerifiedPaymentEvidenceUpload {
  publicId: string;
  providerVersion: number;
  providerSignature: string;
}

interface CloudinaryUploadResponse {
  public_id: string;
  version: number;
  signature: string;
}

function isAllowedContentType(value: string): value is CreateMediaUploadDtoContentType {
  return allowedTypes.has(value as CreateMediaUploadDtoContentType);
}

export async function uploadPaymentEvidence(
  orderNo: string,
  file: File,
  authenticated: boolean,
  guestToken: string | null,
): Promise<VerifiedPaymentEvidenceUpload> {
  if (!isAllowedContentType(file.type)) {
    throw new Error('Chỉ hỗ trợ ảnh JPEG, PNG, WebP hoặc AVIF.');
  }
  const request = { fileName: file.name, contentType: file.type, sizeBytes: file.size };
  const signed = authenticated
    ? await createAccountPaymentEvidenceUpload(orderNo, request, paymentRequest())
    : await createGuestPaymentEvidenceUpload(
        orderNo,
        request,
        paymentRequest({ headers: { 'x-cart-token': guestToken } }),
      );
  if (file.size > signed.maxBytes) {
    throw new Error(`Ảnh vượt quá giới hạn ${Math.floor(signed.maxBytes / 1024 / 1024)} MB.`);
  }

  const form = new FormData();
  form.set('file', file);
  form.set('api_key', signed.apiKey);
  form.set('timestamp', String(signed.timestamp));
  form.set('signature', signed.signature);
  form.set('folder', signed.folder);
  form.set('public_id', signed.publicId);
  form.set('allowed_formats', signed.allowedFormats.join(','));
  form.set('overwrite', String(signed.overwrite));
  form.set('unique_filename', String(signed.uniqueFilename));

  const uploaded = await axios.post<CloudinaryUploadResponse>(signed.uploadUrl, form);
  return {
    publicId: uploaded.data.public_id,
    providerVersion: uploaded.data.version,
    providerSignature: uploaded.data.signature,
  };
}

