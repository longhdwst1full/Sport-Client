import { ApiError } from './fetcher';

/**
 * Tải ảnh thẳng lên nhà cung cấp media (Cloudinary) bằng chữ ký do API cấp. Dùng chung cho ảnh minh
 * chứng thanh toán, ảnh đổi trả và ảnh đánh giá: mỗi feature chỉ tự xin chữ ký qua operation SDK của
 * mình (`requestTicket`) rồi map kết quả; helper không biết endpoint hay DTO nghiệp vụ nào.
 */

/** Định dạng ảnh API chấp nhận cho upload ký sẵn (khớp enum `ImageMimeType` của các contract). */
export const SIGNED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'] as const;
export type SignedImageMimeType = (typeof SIGNED_IMAGE_MIME_TYPES)[number];

export const SIGNED_UPLOAD_MESSAGES = {
  unsupportedType: 'Chỉ hỗ trợ ảnh JPEG, PNG, WebP hoặc AVIF.',
  uploadFailed: 'Cloudinary không nhận được ảnh. Vui lòng thử lại.',
  tooLarge: (maxBytes: number) => `Ảnh vượt quá giới hạn ${Math.floor(maxBytes / 1024 / 1024)} MB.`,
} as const;

/** Thân request xin chữ ký — trùng hình với `CreateImageUploadDto` của từng domain. */
export interface SignedMediaUploadRequest {
  fileName: string;
  contentType: SignedImageMimeType;
  sizeBytes: number;
}

/** Phần của `SignedMediaUploadDto` mà bước upload cần. */
export interface SignedMediaUploadTicket {
  uploadUrl: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
  publicId: string;
  allowedFormats: string[];
  overwrite: boolean;
  uniqueFilename: boolean;
  maxBytes: number;
}

/** Phản hồi của nhà cung cấp, đã đổi sang camelCase. */
export interface SignedMediaUploadResult {
  publicId: string;
  version: number;
  signature: string;
  secureUrl: string;
}

interface ProviderUploadResponse {
  public_id: string;
  version: number;
  signature: string;
  secure_url: string;
}

export function isSignedImageMimeType(value: string): value is SignedImageMimeType {
  return (SIGNED_IMAGE_MIME_TYPES as readonly string[]).includes(value);
}

/** Trả `contentType` đã kiểm tra; định dạng không hỗ trợ thì ném `Error` với thông báo tiếng Việt. */
export function signedImageContentType(file: File): SignedImageMimeType {
  if (!isSignedImageMimeType(file.type)) throw new Error(SIGNED_UPLOAD_MESSAGES.unsupportedType);
  return file.type;
}

/** Đúng 9 trường mà chữ ký của API phủ; thêm/bớt trường làm nhà cung cấp từ chối chữ ký. */
export function buildSignedUploadForm(file: File, ticket: SignedMediaUploadTicket): FormData {
  const form = new FormData();
  form.set('file', file);
  form.set('api_key', ticket.apiKey);
  form.set('timestamp', String(ticket.timestamp));
  form.set('signature', ticket.signature);
  form.set('folder', ticket.folder);
  form.set('public_id', ticket.publicId);
  form.set('allowed_formats', ticket.allowedFormats.join(','));
  form.set('overwrite', String(ticket.overwrite));
  form.set('unique_filename', String(ticket.uniqueFilename));
  return form;
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
}

function isAbort(error: unknown, signal: AbortSignal | undefined): boolean {
  return Boolean(signal?.aborted) || (error instanceof DOMException && error.name === 'AbortError');
}

/**
 * Kiểm định dạng → xin chữ ký → kiểm dung lượng theo `maxBytes` của chữ ký → POST multipart.
 *
 * Lỗi: định dạng/dung lượng ném `Error` (thông báo hiển thị được); lỗi xin chữ ký giữ nguyên lỗi của
 * SDK (`ApiError`); lỗi HTTP/mạng khi upload chuẩn hoá thành `ApiError(status, { message, provider })`
 * (`status = 0` khi mạng lỗi) để `apiErrorMessage` đọc được. Huỷ qua `signal` ném lại lỗi abort gốc.
 * Không tự retry: upload là thao tác tạo tài nguyên.
 */
export async function uploadSignedMedia(
  file: File,
  requestTicket: (request: SignedMediaUploadRequest) => Promise<SignedMediaUploadTicket>,
  signal?: AbortSignal,
): Promise<SignedMediaUploadResult> {
  const contentType = signedImageContentType(file);
  const ticket = await requestTicket({ fileName: file.name, contentType, sizeBytes: file.size });
  if (file.size > ticket.maxBytes) throw new Error(SIGNED_UPLOAD_MESSAGES.tooLarge(ticket.maxBytes));

  let response: Response;
  try {
    response = await fetch(ticket.uploadUrl, { method: 'POST', body: buildSignedUploadForm(file, ticket), signal });
  } catch (error) {
    if (isAbort(error, signal)) throw error;
    throw new ApiError(0, { message: SIGNED_UPLOAD_MESSAGES.uploadFailed });
  }
  const body = await readJson(response);
  if (!response.ok || !body) {
    throw new ApiError(response.status, { message: SIGNED_UPLOAD_MESSAGES.uploadFailed, provider: body });
  }
  const uploaded = body as ProviderUploadResponse;
  return {
    publicId: uploaded.public_id,
    version: uploaded.version,
    signature: uploaded.signature,
    secureUrl: uploaded.secure_url,
  };
}
