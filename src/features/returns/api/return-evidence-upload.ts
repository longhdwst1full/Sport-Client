import { createAccountReturnEvidenceUpload } from '@/generated/api/returns/returns';
import { uploadSignedMedia } from '@/lib/api/signed-media-upload';
import type { UploadedEvidence } from '../model/return.mapper';

/**
 * Tải ảnh minh chứng thẳng lên Cloudinary bằng chữ ký API cấp cho đúng đơn này. Không có bước
 * finalize: API xác minh ảnh ngay trong lệnh tạo phiếu, nên huỷ form thì ảnh không gắn vào đâu.
 */
export async function uploadReturnEvidence(orderNo: string, file: File, signal?: AbortSignal): Promise<UploadedEvidence> {
  const uploaded = await uploadSignedMedia(
    file,
    (request) => createAccountReturnEvidenceUpload({ orderNo, ...request }, undefined, signal),
    signal,
  );
  return {
    publicId: uploaded.publicId,
    providerVersion: uploaded.version,
    providerSignature: uploaded.signature,
    previewUrl: uploaded.secureUrl,
  };
}
