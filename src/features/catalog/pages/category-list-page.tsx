import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { StorefrontLayout } from '@/layouts/storefront-layout';
import { Breadcrumb } from '@/foundation/components/navigation';
import { listCatalogCategories } from '@/generated/api/catalog/catalog';
import type { CatalogCategoryDto } from '@/generated/api/catalog/catalog.schemas';
import { CategoryGrid } from '../components/category-grid';
import { toCategoryCardView } from '../model/category.mapper';

async function loadCategories(): Promise<CatalogCategoryDto[]> {
  try {
    const response = await listCatalogCategories();
    return response.items;
  } catch {
    // CONTRACT: danh mục là nội dung public. API lỗi thì trang vẫn render được
    // với empty state, không đổ lỗi 500 cho người dùng và không bịa dữ liệu.
    return [];
  }
}

export async function CategoryListPage() {
  const categories = await loadCategories();
  const items = categories.map(toCategoryCardView);

  return (
    <StorefrontLayout>
      <div className="bg-stone-50/60 pb-20 pt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            className="mb-6"
            items={[{ label: 'Trang chủ', href: '/' }, { label: 'Danh mục thể thao' }]}
          />

          <div className="max-w-2xl">
            <span className="rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-extrabold uppercase tracking-widest text-emerald-800">
              Phân loại chuyên sâu
            </span>
            <h1 className="mt-3 text-3xl font-black text-ink sm:text-5xl">
              Danh mục thể thao &amp; Thiết bị chuyên nghiệp
            </h1>
            <p className="mt-3 text-base text-stone-600 sm:text-lg">
              Lựa chọn đúng môn tập bạn theo đuổi để xem các thiết bị, phụ kiện và combo được tuyển chọn kỹ lưỡng.
            </p>
          </div>

          <div className="mt-12">
            {items.length > 0 ? (
              <CategoryGrid items={items} />
            ) : (
              <div className="rounded-[32px] border border-dashed border-stone-300 bg-white p-12 text-center">
                <h2 className="text-lg font-black text-ink">Chưa có danh mục nào để hiển thị</h2>
                <p className="mt-2 text-sm text-stone-500">
                  Danh mục đang được cập nhật. Bạn có thể xem toàn bộ sản phẩm trong lúc chờ.
                </p>
                <Link
                  href="/products"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
                >
                  Xem tất cả sản phẩm
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}
