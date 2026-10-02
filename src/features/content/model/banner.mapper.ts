import type { ActiveBannerDto } from '@/generated/api/content/content.schemas';

/** Re-export cho widget (không được import thẳng SDK generated). */
export { BannerPlacement } from '@/generated/api/content/content.schemas';

/** Banner CMS-02 đã chuẩn hoá cho UI; component không đọc trực tiếp `ActiveBannerDto`. */
export interface BannerView {
  id: string;
  title: string | null;
  subtitle: string | null;
  ctaText: string | null;
  /** Đường dẫn nội bộ `/...` hoặc URL `https://` (API đã kiểm, chặn `//` protocol-relative). */
  targetUrl: string | null;
  desktopImageUrl: string;
  /** Null thì dùng ảnh desktop ở mọi kích thước màn hình. */
  mobileImageUrl: string | null;
}

/** Chữ nút mặc định khi banner có đích đến nhưng Admin để trống `ctaText`. */
export const BANNER_DEFAULT_CTA_TEXT = 'Xem chi tiết';

const blankToNull = (value: string | null) => (value && value.trim() ? value : null);

export function toBannerView(dto: ActiveBannerDto): BannerView {
  return {
    id: dto.id,
    title: blankToNull(dto.title),
    subtitle: blankToNull(dto.subtitle),
    ctaText: blankToNull(dto.ctaText),
    targetUrl: blankToNull(dto.targetUrl),
    desktopImageUrl: dto.desktopImageUrl,
    mobileImageUrl: blankToNull(dto.mobileImageUrl),
  };
}
