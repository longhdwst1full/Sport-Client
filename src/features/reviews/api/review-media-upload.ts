import {
  createAccountReviewMediaUpload,
  finalizeAccountReviewMediaUpload,
} from '@/generated/api/reviews/reviews';
import { uploadSignedMedia } from '@/lib/api/signed-media-upload';

export interface UploadedReviewMedia {
  mediaAssetId: string;
  previewUrl: string;
}

/** Upload trực tiếp tới Cloudinary, sau đó finalize qua API để asset thuộc đúng customer hiện tại. */
export async function uploadReviewMedia(file: File, signal?: AbortSignal): Promise<UploadedReviewMedia> {
  const uploaded = await uploadSignedMedia(
    file,
    (request) => createAccountReviewMediaUpload(request, undefined, signal),
    signal,
  );
  const asset = await finalizeAccountReviewMediaUpload(
    {
      publicId: uploaded.publicId,
      version: uploaded.version,
      signature: uploaded.signature,
    },
    undefined,
    signal,
  );
  return { mediaAssetId: asset.id, previewUrl: uploaded.secureUrl };
}
