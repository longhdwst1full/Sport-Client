import {
  createAccountReviewMediaUpload,
  finalizeAccountReviewMediaUpload,
} from '@/generated/api/reviews/reviews';
import type { ImageMimeType } from '@/generated/api/reviews/reviews.schemas';

const allowedTypes = new Set<string>(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);

interface CloudinaryUploadResponse {
  public_id: string;
  version: number;
  signature: string;
  secure_url: string;
}

export interface UploadedReviewMedia {
  mediaAssetId: string;
  previewUrl: string;
}

/** Upload trực tiếp tới Cloudinary, sau đó finalize qua API để asset thuộc đúng customer hiện tại. */
export async function uploadReviewMedia(file: File, signal?: AbortSignal): Promise<UploadedReviewMedia> {
  if (!allowedTypes.has(file.type)) throw new Error('Chỉ hỗ trợ ảnh JPEG, PNG, WebP hoặc AVIF.');
  const signed = await createAccountReviewMediaUpload(
    {
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

  const response = await fetch(signed.uploadUrl, { method: 'POST', body: form, signal });
  if (!response.ok) throw new Error('Cloudinary không nhận được ảnh. Vui lòng thử lại.');
  const uploaded = (await response.json()) as CloudinaryUploadResponse;
  const asset = await finalizeAccountReviewMediaUpload(
    {
      publicId: uploaded.public_id,
      version: uploaded.version,
      signature: uploaded.signature,
    },
    undefined,
    signal,
  );
  return { mediaAssetId: asset.id, previewUrl: uploaded.secure_url };
}
