import type { ProductDetailDto, ProductMediaDto } from '@/generated/api/catalog/catalog.schemas';
import { ProductMediaStatus } from '@/generated/api/catalog/catalog.schemas';

/** Media ACTIVE có URL, ảnh chính lên đầu rồi theo `sortOrder`. Trả mảng mới, không đổi đầu vào. */
export function activeSortedMedia(media: ProductDetailDto['media'] | null | undefined): ProductMediaDto[] {
  return (media ?? [])
    .filter((item) => item.status === ProductMediaStatus.ACTIVE && item.secureUrl)
    .sort((left, right) =>
      left.isPrimary === right.isPrimary ? left.sortOrder - right.sortOrder : left.isPrimary ? -1 : 1,
    );
}
