import { cache } from 'react';
import { getCatalogProduct } from '@/generated/api/catalog/catalog';

/**
 * Một lượt tải sản phẩm theo slug cho mỗi request: layout (kiểm tra tồn tại → 404), `generateMetadata`
 * và page dùng chung, nên chỉ có một lời gọi API.
 */
export const loadCatalogProduct = cache((slug: string) => getCatalogProduct(slug));
