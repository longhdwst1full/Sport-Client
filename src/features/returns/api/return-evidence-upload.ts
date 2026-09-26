import axios from 'axios';
import { createAccountReturnEvidenceUpload } from '@/generated/api/returns/returns';
import type { ImageMimeType } from '@/generated/api/returns/returns.schemas';
import type { UploadedEvidence } from '../model/return.mapper';

const allowedTypes = new Set<string>(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);

interface CloudinaryUploadResponse {
  public_id: string;
  version: number;
  signature: string;
  secure_url: string;
}

/**
 * Tải ảnh minh chứng thẳng lên Cloudinary bằng chữ ký API cấp cho đúng đơn này. Không có bước
 * finalize: API xác minh ảnh ngay trong lệnh tạo phiếu, nên huỷ form thì ảnh không gắn vào đâu.
 */
export async function uploadReturnEvidence(orderNo: string, file: File, signal?: AbortSignal): Promise<UploadedEvidence> {
  if (!allowedTypes.has(file.type)) throw new Error('Chỉ hỗ trợ ảnh JPEG, PNG, WebP hoặc AVIF.');
  const signed = await createAccountReturnEvidenceUpload(
    {
      orderNo,
      fileName: file.name,
      contentType: file.type as ImageMimeType,
      sizeBytes: file.size,
    },
    undefined,
    signal,
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
  const uploaded = await axios.post<CloudinaryUploadResponse>(signed.uploadUrl, form, { signal });
  return {
    publicId: uploaded.data.public_id,
    providerVersion: uploaded.data.version,
    providerSignature: uploaded.data.signature,
    previewUrl: uploaded.data.secure_url,
  };
}
