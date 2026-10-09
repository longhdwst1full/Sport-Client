import { describe, expect, it } from 'vitest';
import type { CatalogCategoryDto } from '@/generated/api/catalog/catalog.schemas';
import { toCategoryTreeCardViews } from './category.mapper';

const cat = (slug: string, productCount: number, parentSlug: string | null = null) =>
  ({ slug, name: slug.toUpperCase(), code: slug, productCount, parentSlug, description: null, imageUrl: null }) as unknown as CatalogCategoryDto;

describe('toCategoryTreeCardViews', () => {
  it('chỉ trả danh mục gốc, danh mục con có sản phẩm thành chip', () => {
    const views = toCategoryTreeCardViews([
      cat('gym', 12),
      cat('ghe-tap', 3, 'gym'),
      cat('ta-tay', 0, 'gym'),
      cat('yoga', 2),
      cat('trong', 0),
    ]);
    expect(views.map((view) => view.slug)).toEqual(['gym', 'yoga']);
    expect(views[0].subcategories).toEqual([{ slug: 'ghe-tap', title: 'GHE-TAP' }]);
  });

  it('giữ danh mục gốc 0 sản phẩm nếu con có sản phẩm', () => {
    const views = toCategoryTreeCardViews([cat('bong', 0), cat('bong-ro', 1, 'bong')]);
    expect(views.map((view) => view.slug)).toEqual(['bong']);
  });
});
