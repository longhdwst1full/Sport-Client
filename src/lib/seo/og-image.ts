/**
 * Ảnh chia sẻ mạng xã hội (og:image). Ảnh gốc trong thư viện có thể là WebP/AVIF tới 10 MB — nhiều crawler
 * (Facebook, Zalo) không nhận hoặc cắt sai. Với URL Cloudinary chèn transformation JPEG 1200×630 (tỉ lệ khuyến
 * nghị của og:image); URL khác giữ nguyên vì không biến đổi được.
 *
 * Cùng quy ước phân tích URL với `api/src/integrations/object-storage/cloudinary-url.ts`.
 */
const CLOUDINARY_IMAGE_UPLOAD = /^(https:\/\/res\.cloudinary\.com\/[^/?#]+\/image\/upload\/)([^?#]*)(.*)$/;
const TRANSFORMATION_COMPONENT = /^[a-z]{1,3}_[^,/]+$/;

export const OG_IMAGE_TRANSFORMATION = 'f_jpg,w_1200,h_630,c_fill';

function isTransformationSegment(segment: string): boolean {
  return segment.length > 0 && segment.split(',').every((component) => TRANSFORMATION_COMPONENT.test(component));
}

/** Thêm transformation vào cuối chuỗi transformation sẵn có (áp sau cùng); URL không phải Cloudinary trả nguyên. */
export function withCloudinaryTransformation(url: string, transformation: string): string {
  const match = CLOUDINARY_IMAGE_UPLOAD.exec(url.trim());
  if (!match) return url;
  const segments = match[2].split('/');
  let index = 0;
  while (index < segments.length - 1 && isTransformationSegment(segments[index])) index += 1;
  if (!segments.slice(index).join('/')) return url;
  segments.splice(index, 0, transformation);
  return `${match[1]}${segments.join('/')}${match[3]}`;
}

export function toOgImageUrl(url: string): string {
  return withCloudinaryTransformation(url, OG_IMAGE_TRANSFORMATION);
}
