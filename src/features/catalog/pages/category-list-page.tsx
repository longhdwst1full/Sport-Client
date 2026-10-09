import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Breadcrumb } from '@/foundation/components/navigation';
import type { CatalogCategoryDto } from '@/generated/api/catalog/catalog.schemas';
import { CategoryGrid } from '../components/category-grid';
import { toCategoryCardView } from '../model/category.mapper';

/**
 * Cây danh mục do route truyền vào (cache dùng chung). CONTRACT: API lỗi thì route truyền mảng rỗng,
 * trang render empty state thay vì lỗi 500 và không bịa dữ liệu.
 */
export function CategoryListPage({ categories }: { categories: CatalogCategoryDto[] }) {
  const items = categories.map(toCategoryCardView);

  return (
      <main className="page-shell">
        <div className="page-container">
          <Breadcrumb
            className="mb-6"
            items={[{ label: 'Trang chủ', href: '/' }, { label: 'Danh mục thể thao' }]}
          />

          <div className="max-w-2xl">
            <span className="rounded-full bg-neutral-100 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-neutral-950">
              Phân loại chuyên sâu
            </span>
            <h1 className="mt-3 text-3xl font-bold text-ink sm:text-5xl">
              Danh mục thể thao &amp; Thiết bị chuyên nghiệp
            </h1>
            <p className="mt-3 text-base text-neutral-600 sm:text-lg">
              Lựa chọn đúng môn tập bạn theo đuổi để xem các thiết bị, phụ kiện và combo được tuyển chọn kỹ lưỡng.
            </p>
          </div>

          <div className="mt-12">
            {items.length > 0 ? (
              <CategoryGrid items={items} />
            ) : (
              <div className="rounded-4xl border border-dashed border-neutral-300 bg-white p-12 text-center">
                <h2 className="text-lg font-bold text-ink">Chưa có danh mục nào để hiển thị</h2>
                <p className="mt-2 text-sm text-neutral-500">
                  Danh mục đang được cập nhật. Bạn có thể xem toàn bộ sản phẩm trong lúc chờ.
                </p>
                <Link
                  href="/products"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-neutral-800"
                >
                  Xem tất cả sản phẩm
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
  );
}
